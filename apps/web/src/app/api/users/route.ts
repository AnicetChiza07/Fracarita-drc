import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { generateRandomPassword } from '@/lib/password';

const prisma = new PrismaClient();

const userSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide'),
    role: z.enum(['SUPER_ADMIN', 'EDITOR', 'VIEWER']),
});

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    } catch {
        return null;
    }
}

export async function GET() {
    try {
        const user = await verifyAdmin();
        if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const currentUser = await verifyAdmin();
        if (!currentUser) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        if (currentUser.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });
        }

        const body = await request.json();
        const result = userSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { name, email, role } = result.data;

        // 1. Générer un mot de passe aléatoire
        const randomPassword = generateRandomPassword(12);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // 2. Créer l'utilisateur en base de données
        let newUser;
        try {
            newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    passwordHash: hashedPassword,
                    role,
                    isActive: true,
                },
                select: { id: true, name: true, email: true, role: true, isActive: true },
            });
        } catch (dbError: unknown) {
            const error = dbError as { code?: string; meta?: { target?: string[] } };
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                return NextResponse.json({ error: 'Cet email est déjà utilisé par un autre compte.' }, { status: 400 });
            }
            return NextResponse.json({ error: 'Erreur lors de la création en base de données.' }, { status: 500 });
        }

        // 3. Renvoyer le mot de passe en clair au frontend pour qu'il soit affiché à l'admin
        return NextResponse.json({
            message: 'Utilisateur créé avec succès',
            user: newUser,
            tempPassword: randomPassword, // ✅ Le mot de passe est renvoyé une seule fois
        }, { status: 201 });

    } catch (error) {
        console.error('Erreur création utilisateur:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}