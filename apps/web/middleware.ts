import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // 🕵️ DEBUG : On affiche ce que le middleware voit dans le TERMINAL
    console.log('🔍 [MIDDLEWARE] Chemin demandé:', pathname);
    console.log('🔍 [MIDDLEWARE] Token présent ?', token ? 'OUI' : 'NON');
    if (token) {
        console.log('🔍 [MIDDLEWARE] JWT_SECRET est défini ?', process.env.JWT_SECRET ? 'OUI' : 'NON (C\'EST LE PROBLÈME !)');
    }

    // 1. Si on est sur la page de login
    if (pathname === '/admin/login') {
        if (token) {
            try {
                jwt.verify(token, process.env.JWT_SECRET!);
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
                console.error('❌ [MIDDLEWARE] Échec vérification sur /login:', errorMessage);
                const response = NextResponse.next();
                response.cookies.delete('token');
                return response;
            }
        }
        return NextResponse.next();
    }

    // 2. Pour TOUTES les autres routes /admin/*
    if (pathname.startsWith('/admin')) {
        if (!token) {
            console.log('⚠️ [MIDDLEWARE] Pas de token, redirection vers login');
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET!);
            console.log('✅ [MIDDLEWARE] Token valide, accès autorisé à', pathname);
            return NextResponse.next();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            console.error('❌ [MIDDLEWARE] Token invalide ou expiré. Erreur:', errorMessage);
            console.error('❌ [MIDDLEWARE] Valeur brute du secret:', process.env.JWT_SECRET);
            
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('error', 'session_expired');
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

// ✅ Matcher simplifié et robuste : s'applique UNIQUEMENT aux routes /admin
export const config = {
    matcher: ['/admin/:path*'],
};