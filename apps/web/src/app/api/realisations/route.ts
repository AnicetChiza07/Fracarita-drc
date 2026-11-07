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
        const result = realisationSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { title, description, location, eventDate, imageUrl, categoryId } = result.data;

        const realisation = await prisma.realisation.create({
            data: {
                title,
                description: description?.trim() || "Aucune description fournie.",
                location,
                eventDate: new Date(eventDate),
                imageUrl,
                categoryId,
            },
            include: { category: true },
        });

        return NextResponse.json(
            { message: 'Réalisation créée avec succès', realisation },
            { status: 201 }
        );
    } catch (error) {
        console.error('Erreur création réalisation:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}