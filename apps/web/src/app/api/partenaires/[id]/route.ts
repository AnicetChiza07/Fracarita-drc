import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const partnerSchema = z.object({
    logoUrl: z.string().url('L\'URL du logo est invalide'),
    order: z.number().int().min(0).default(0),
});

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

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const user = await verifyAdmin();
        if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const body = await request.json();
        const result = partnerSchema.safeParse(body);
        if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

        const existing = await prisma.partner.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Partenaire non trouvé' }, { status: 404 });

        const { logoUrl, order } = result.data;

        const partner = await prisma.partner.update({
            where: { id },
            data: {
                logoUrl,
                order,
            },
        });

        return NextResponse.json({ message: 'Partenaire mis à jour avec succès', partner });
    } catch (error) {
        console.error('Erreur modification partenaire:', error);
        return NextResponse.json(
            { error: 'Erreur interne: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const user = await verifyAdmin();
        if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const existing = await prisma.partner.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Partenaire non trouvé' }, { status: 404 });

        await prisma.partner.delete({ where: { id } });
        return NextResponse.json({ message: 'Partenaire supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression partenaire:', error);
        return NextResponse.json(
            { error: 'Erreur interne: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}