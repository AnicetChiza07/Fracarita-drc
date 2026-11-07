import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const partnerSchema = z.object({
    logoUrl: z.string().url('L\'URL du logo est invalide'),
    order: z.number().int().min(0).default(0),
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
        const result = partnerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { logoUrl, order } = result.data;

        const partner = await prisma.partner.create({
            data: {
                logoUrl,
                order,
            },
        });

        return NextResponse.json(
            { message: 'Partenaire ajouté avec succès', partner },
            { status: 201 }
        );
    } catch (error) {
        console.error('Erreur création partenaire:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}