import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const realisationSchema = z.object({
    title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères').max(200),
    description: z.string().max(1000).nullable().optional(),
    location: z.string().min(2, 'Le lieu est obligatoire'),
    eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Date invalide' }),
    imageUrl: z.string().url('L\'URL de l\'image est invalide'),
    categoryId: z.string().min(1, 'La catégorie est obligatoire'),
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
        const result = realisationSchema.safeParse(body);
        if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

        const existing = await prisma.realisation.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Réalisation non trouvée' }, { status: 404 });

        const { title, description, location, eventDate, imageUrl, categoryId } = result.data;

        const realisation = await prisma.realisation.update({
            where: { id },
            data: {
                title,
                description: description || null,
                location,
                eventDate: new Date(eventDate),
                imageUrl,
                categoryId,
            },
            include: { category: true },
        });

        return NextResponse.json({ message: 'Réalisation mise à jour avec succès', realisation });
    } catch (error) {
        console.error('Erreur modification réalisation:', error);
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

        const existing = await prisma.realisation.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Réalisation non trouvée' }, { status: 404 });

        await prisma.realisation.delete({ where: { id } });
        return NextResponse.json({ message: 'Réalisation supprimée avec succès' });
    } catch (error) {
        console.error('Erreur suppression réalisation:', error);
        return NextResponse.json(
            { error: 'Erreur interne: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}