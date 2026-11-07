import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// ✅ Schéma aligné exactement sur ce que le frontend envoie
const articleSchema = z.object({
    title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
    excerpt: z.string().nullable().optional(),
    content: z.any(), // Accepte le JSON complexe de Tiptap
    coverImage: z.string().nullable().optional(),
    categoryId: z.string().min(1, 'La catégorie est obligatoire'),
    isFeatured: z.boolean(),
    isPublished: z.boolean(),
    publishedAt: z.string().optional(),
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

// Fonction utilitaire pour générer le slug
const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
};

export async function GET() {
    try {
        if (!(await verifyAdmin())) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const articles = await prisma.article.findMany({
            include: {
                author: { select: { email: true } },
                category: { select: { id: true, name: true } },
            },
            orderBy: { publishedAt: 'desc' },
        });

        return NextResponse.json({ articles });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const currentUser = await verifyAdmin();
        if (!currentUser) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const body = await request.json();
        const result = articleSchema.safeParse(body);
        
        if (!result.success) {
            console.error('Erreur de validation Zod:', result.error.issues);
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { title, excerpt, content, coverImage, categoryId, isFeatured, isPublished, publishedAt } = result.data;

        // ✅ Génération automatique du slug
        const slug = generateSlug(title);

        const article = await prisma.article.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                coverImage,
                isPublished,
                isFeatured,
                categoryId,
                authorId: currentUser.userId, // ✅ Récupéré depuis le token JWT
                publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
            },
            include: {
                author: { select: { email: true } },
                category: { select: { id: true, name: true } },
            },
        });

        return NextResponse.json({ message: 'Article créé avec succès', article }, { status: 201 });
    } catch (error) {
        console.error('Erreur création article:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}