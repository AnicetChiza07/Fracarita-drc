import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const statSchema = z.object({
    value: z.string(),
    label: z.string(),
});

const sectorSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
    subtitle: z.string().min(5, 'Le sous-titre doit contenir au moins 5 caractères').max(200),
    description: z.string().min(10, 'La description doit contenir au moins 10 caractères').max(2000),
    imageUrl: z.string().url('L\'URL de l\'image est invalide'),
    stats: z.array(statSchema).optional(),
});

function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

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
        const result = sectorSchema.safeParse(body);
        if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

        const existing = await prisma.sector.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Secteur non trouvé' }, { status: 404 });

        const { name, subtitle, description, imageUrl, stats } = result.data;
        const slug = generateSlug(name);

        const sector = await prisma.sector.update({
            where: { id },
            data: {
                name,
                slug,
                subtitle,
                description,
                imageUrl,
                stats: stats || [],
            },
        });

        return NextResponse.json({ message: 'Secteur mis à jour avec succès', sector });
    } catch (error) {
        console.error('Erreur modification secteur:', error);
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

        const existing = await prisma.sector.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Secteur non trouvé' }, { status: 404 });

        await prisma.sector.delete({ where: { id } });
        return NextResponse.json({ message: 'Secteur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression secteur:', error);
        return NextResponse.json(
            { error: 'Erreur interne: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}