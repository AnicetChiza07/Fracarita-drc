import { NextResponse } from 'next/server';

export async function POST() {
    // 1. Créer la réponse JSON
    const response = NextResponse.json({ message: 'Déconnecté avec succès' });
    
    // 2. Supprimer le cookie via l'objet réponse (méthode la plus fiable)
    response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0), // Expire immédiatement (1er janvier 1970)
        path: '/',
    });

    return response;
}