import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const categorySchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50),
});

function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

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
        const result = categorySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { name } = result.data;
        const slug = generateSlug(name);

        const existing = await prisma.reportCategory.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json({ error: 'Cette catégorie existe déjà' }, { status: 400 });
        }

        const category = await prisma.reportCategory.create({
            data: { name, slug },
        });

        return NextResponse.json({ message: 'Catégorie créée avec succès', category }, { status: 201 });
    } catch (error) {
        console.error('Erreur création catégorie rapport:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}