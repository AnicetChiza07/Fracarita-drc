// Fichier : apps/web/src/app/api/message/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch {
        return null;
    }
}

// ✅ PUT : Marquer comme lu (Admin)
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin())) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        const { id } = await context.params;
        const body = await request.json();

        const updated = await prisma.message.update({
            where: { id },
            data: { isRead: body.isRead },
        });
        return NextResponse.json({ message: 'Mis à jour', updated });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// ✅ DELETE : Supprimer (Admin)
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        if (!(await verifyAdmin())) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        const { id } = await context.params;

        await prisma.message.delete({ where: { id } });
        return NextResponse.json({ message: 'Supprimé' });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}