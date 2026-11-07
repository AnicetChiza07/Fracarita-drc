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
        const result = reportSchema.safeParse(body);
        if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

        const existing = await prisma.report.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Rapport non trouvé' }, { status: 404 });

        const { title, year, description, categoryId, pdfName, pdfUrl, pdfSize, coverImage, isPublished } = result.data;

        const report = await prisma.report.update({
            where: { id },
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

        return NextResponse.json({ message: 'Rapport mis à jour avec succès', report });
    } catch (error) {
        console.error('Erreur modification rapport:', error);
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

        const existing = await prisma.report.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Rapport non trouvé' }, { status: 404 });

        await prisma.report.delete({ where: { id } });
        return NextResponse.json({ message: 'Rapport supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression rapport:', error);
        return NextResponse.json(
            { error: 'Erreur interne: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}