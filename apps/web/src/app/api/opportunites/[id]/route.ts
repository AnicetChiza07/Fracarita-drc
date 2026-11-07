import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const opportunitySchema = z.object({
    title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères').max(200),
    type: z.enum(['JOB', 'INTERNSHIP', 'TENDER']),
    categoryId: z.string().min(1, 'La catégorie est obligatoire'),
    location: z.string().min(2, 'Le lieu est obligatoire'),
    contractType: z.string().nullable().optional(),
    experienceLevel: z.string().nullable().optional(),
    deadline: z.string().nullable().optional(),
    description: z.any(),
    coverImage: z.string().url().nullable().optional(),
    pdfName: z.string().nullable().optional(),
    pdfUrl: z.string().url().nullable().optional(),
    pdfSize: z.string().nullable().optional(),
    isPublished: z.boolean().default(false),
});

function generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
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
        const result = opportunitySchema.safeParse(body);
        if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

        const existing = await prisma.opportunity.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Opportunité non trouvée' }, { status: 404 });

        const { title, type, categoryId, location, contractType, experienceLevel, deadline, description, coverImage, pdfName, pdfUrl, pdfSize, isPublished } = result.data;

        const baseSlug = generateSlug(title);
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (await prisma.opportunity.findUnique({ where: { slug: uniqueSlug } })) {
            if (uniqueSlug === existing.slug) break;
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }

        const opportunity = await prisma.opportunity.update({
            where: { id },
            data: {
                title, slug: uniqueSlug, type, categoryId, location,
                contractType: contractType || null, experienceLevel: experienceLevel || null,
                deadline: deadline ? new Date(deadline) : null, description,
                coverImage: coverImage || null, pdfName: pdfName || null,
                pdfUrl: pdfUrl || null, pdfSize: pdfSize || null, isPublished,
            },
            include: { category: true },
        });

        return NextResponse.json({ message: 'Opportunité mise à jour avec succès', opportunity });
    } catch (error) {
        console.error('Erreur modification:', error);
        return NextResponse.json({ error: 'Erreur interne: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const user = await verifyAdmin();
        if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const existing = await prisma.opportunity.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Opportunité non trouvée' }, { status: 404 });

        await prisma.opportunity.delete({ where: { id } });
        return NextResponse.json({ message: 'Opportunité supprimée avec succès' });
    } catch (error) {
        console.error('Erreur suppression:', error);
        return NextResponse.json({ error: 'Erreur interne: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
    }
}