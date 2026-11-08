import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
        }

        if (!user.isActive) {
            return NextResponse.json({ error: 'Ce compte est désactivé' }, { status: 403 });
        }

        // ✅ CORRECTION 1 : Ne JAMAIS utiliser de fallback pour le JWT_SECRET en production
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('❌ [API LOGIN] JWT_SECRET manquant dans les variables d\'environnement Vercel !');
            return NextResponse.json({ error: 'Erreur de configuration serveur' }, { status: 500 });
        }
        
        // Génération du token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            secret,
            { expiresIn: '7d' } // ✅ Aligné avec le maxAge du cookie (7 jours)
        );

        const response = NextResponse.json({ 
            message: 'Connexion réussie',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

        const cookieStore = await cookies();
        
        // CORRECTION 2 : Forcer secure: true sur Vercel
        cookieStore.set('token', token, {
            httpOnly: true,       // Empêche le JavaScript d'y accéder (sécurité XSS)
            secure: true,         // OBLIGATOIRE sur Vercel car le site est en HTTPS
            sameSite: 'lax',      // Autorise le cookie lors des redirections internes
            path: '/',            // Le cookie est valable sur tout le site
            maxAge: 60 * 60 * 24 * 7, // Expire dans 7 jours
        });

        return response;

    } catch (error) {
        console.error('[API LOGIN] Erreur interne:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}