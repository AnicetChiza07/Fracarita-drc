import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const updateUserSchema = z.object({
    role: z.enum(['SUPER_ADMIN', 'EDITOR', 'VIEWER']),
    isActive: z.boolean(),
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

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const currentUser = await verifyAdmin();
        if (!currentUser) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        if (currentUser.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });

        const { id } = await context.params;
        
        // Sécurité : On ne peut pas modifier son propre compte via cette route (utiliser Paramètres pour ça)
        if (id === currentUser.userId) {
            return NextResponse.json({ error: 'Vous ne pouvez pas modifier votre propre compte ici. Utilisez la page Paramètres.' }, { status: 400 });
        }

        const body = await request.json();
        const result = updateUserSchema.safeParse(body);
        if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

        const { role, isActive } = result.data;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role, isActive },
            select: { id: true, name: true, email: true, role: true, isActive: true },
        });

        return NextResponse.json({ message: 'Utilisateur mis à jour', user: updatedUser });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const currentUser = await verifyAdmin();
        if (!currentUser) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        if (currentUser.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });

        const { id } = await context.params;

        if (id === currentUser.userId) {
            return NextResponse.json({ error: 'Vous ne pouvez pas supprimer votre propre compte.' }, { status: 400 });
        }

        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}