// Fichier : apps/web/src/app/api/message/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ POST : Reçu quand le visiteur remplit le formulaire sur /contact
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, content } = body;

        if (!name || !email || !subject || !content) {
            return NextResponse.json(
                { error: 'Veuillez remplir tous les champs obligatoires.' },
                { status: 400 }
            );
        }

        await prisma.message.create({
            data: {
                name,
                email,
                subject,
                content,
                isRead: false,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur POST /api/message:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de l\'envoi.' },
            { status: 500 }
        );
    }
}