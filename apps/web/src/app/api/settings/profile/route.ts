import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const profileSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide'),
});

export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        let userId = '';
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
            userId = decoded.userId;
        } catch {
            return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
        }

        const body = await request.json();
        const result = profileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { name, email } = result.data;

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser && existingUser.id !== userId) {
            return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { name, email },
            select: { id: true, name: true, email: true, role: true },
        });

        return NextResponse.json({ message: 'Profil mis à jour avec succès', user });
    } catch (error) {
        console.error('Erreur mise à jour profil:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}