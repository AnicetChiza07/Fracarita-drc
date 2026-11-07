import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const testimonialSchema = z.object({
    quote: z.string().min(10, 'Le témoignage doit contenir au moins 10 caractères').max(1000),
    authorName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
    role: z.string().min(2, 'Le rôle doit contenir au moins 2 caractères').max(100),
    location: z.string().min(2, 'Le lieu doit contenir au moins 2 caractères').max(100),
    initials: z.string().max(5).optional(),
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
        const result = testimonialSchema.safeParse(body);
        if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

        const existing = await prisma.testimonial.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Témoignage non trouvé' }, { status: 404 });

        const { quote, authorName, role, location, initials } = result.data;

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data: {
                quote,
                authorName,
                role,
                location,
                initials: initials || '',
            },
        });

        return NextResponse.json({ message: 'Témoignage mis à jour avec succès', testimonial });
    } catch (error) {
        console.error('Erreur modification témoignage:', error);
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

        const existing = await prisma.testimonial.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Témoignage non trouvé' }, { status: 404 });

        await prisma.testimonial.delete({ where: { id } });
        return NextResponse.json({ message: 'Témoignage supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression témoignage:', error);
        return NextResponse.json(
            { error: 'Erreur interne: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}