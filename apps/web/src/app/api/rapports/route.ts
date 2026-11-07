import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const reportSchema = z.object({
    title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères').max(200),
    year: z.number().int().min(2000).max(2100),
    description: z.string().max(500).nullable().optional(),
    categoryId: z.string().min(1, 'La catégorie est obligatoire'),
    pdfName: z.string().nullable().optional(),
    pdfUrl: z.string().url('L\'URL du PDF est invalide'),
    pdfSize: z.string().nullable().optional(),
    coverImage: z.string().url().nullable().optional(),
    isPublished: z.boolean().default(false),
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
        const result = reportSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { title, year, description, categoryId, pdfName, pdfUrl, pdfSize, coverImage, isPublished } = result.data;

        const report = await prisma.report.create({
            data: {
                title,
                year,
                description: description || null,
                categoryId,
                pdfName: pdfName || null,
                pdfUrl,
                pdfSize: pdfSize || null,
                coverImage: coverImage || null,
                isPublished,
            },
            include: { category: true },
        });

        return NextResponse.json(
            { message: isPublished ? 'Rapport publié avec succès' : 'Brouillon enregistré', report },
            { status: 201 }
        );
    } catch (error) {
        console.error('Erreur création rapport:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}