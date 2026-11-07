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

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        try {
            jwt.verify(token, process.env.JWT_SECRET!);
        } catch {
            return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
        }

        const body = await request.json();
        const result = testimonialSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { quote, authorName, role, location, initials } = result.data;

        const testimonial = await prisma.testimonial.create({
            data: {
                quote,
                authorName,
                role,
                location,
                initials: initials || '',
            },
        });

        return NextResponse.json(
            { message: 'Témoignage créé avec succès', testimonial },
            { status: 201 }
        );
    } catch (error) {
        console.error('Erreur création témoignage:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}