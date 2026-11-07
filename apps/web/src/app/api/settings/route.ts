import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const settingsSchema = z.object({
    siteName: z.string().min(1, 'Le nom du site est obligatoire'),
    siteDescription: z.string().nullable().optional(),
    contactEmail: z.string().email('Email invalide'),
    contactPhone: z.string().min(5, 'Numéro de téléphone trop court'),
    contactAddress: z.string().min(5, 'Adresse trop courte'),
    socialLinks: z.object({
        facebook: z.string().url().optional().or(z.literal('')),
        twitter: z.string().url().optional().or(z.literal('')),
        instagram: z.string().url().optional().or(z.literal('')),
        linkedin: z.string().url().optional().or(z.literal('')),
    }),
});

export async function PUT(request: Request) {
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
        const result = settingsSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { siteName, siteDescription, contactEmail, contactPhone, contactAddress, socialLinks } = result.data;

        const settings = await prisma.globalSettings.update({
            where: { id: 'global_settings_id' },
            data: {
                siteName,
                siteDescription,
                contactEmail,
                contactPhone,
                contactAddress,
                socialLinks,
            },
        });

        return NextResponse.json({ message: 'Paramètres sauvegardés avec succès', settings });
    } catch (error) {
        console.error('Erreur sauvegarde paramètres:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}