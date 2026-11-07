import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

        const secret = process.env.JWT_SECRET || 'fallback_secret_for_testing_only';
        
        // Génération du token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            secret,
            { expiresIn: '24h' }
        );

        console.log('✅ [API LOGIN] Token généré avec succès. Secret utilisé ?', process.env.JWT_SECRET ? 'OUI' : 'NON (utilisé fallback)');

        const response = NextResponse.json({ 
            message: 'Connexion réussie',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

        // Définition du cookie (path: '/' est CRUCIAL)
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // false en local (http)
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 heures
            path: '/', 
        });

        return response;

    } catch (error) {
        console.error('❌ [API LOGIN] Erreur interne:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}