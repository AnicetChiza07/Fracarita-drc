import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
    try {
        // 1. Récupérer le cookie de manière sécurisée
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        // 2. Si aucun token, l'utilisateur n'est pas connecté
        if (!token) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        // 3. Vérifier et décoder le token avec la clé secrète
        // Si le token est expiré ou falsifié, jwt.verify lancera une erreur
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
            email: string;
            role: string;
        };

        // 4. Renvoyer uniquement les infos nécessaires au frontend (pas le token !)
        return NextResponse.json({
            user: {
                id: decoded.userId,
                email: decoded.email,
                role: decoded.role,
            },
        });

    } catch (error) {
        // Le token est invalide, expiré ou a été tamponné
        const response = NextResponse.json({ error: 'Session invalide ou expirée' }, { status: 401 });
        
        // Nettoyer le cookie invalide pour forcer une nouvelle connexion
        response.cookies.set('token', '', { maxAge: 0, path: '/' });
        return response;
    }
}