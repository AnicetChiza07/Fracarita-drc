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
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export async function POST(request: Request) {
    try {
        // 1. Vérification de l'authentification
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        try {
            jwt.verify(token, process.env.JWT_SECRET!);
        } catch {
            return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
        }

        // 2. Validation des données
        const body = await request.json();
        const result = categorySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { name } = result.data;
        const slug = generateSlug(name);

        // 3. Vérifier si la catégorie existe déjà
        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json({ error: 'Cette catégorie existe déjà' }, { status: 400 });
        }

        // 4. Création en base de données
        const category = await prisma.category.create({
            data: { name, slug },
        });

        return NextResponse.json({ 
            message: 'Catégorie créée avec succès', 
            category 
        }, { status: 201 });

    } catch (error) {
        console.error('Erreur création catégorie:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}