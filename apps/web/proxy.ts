import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

async function isValidToken(token: string): Promise<boolean> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('[PROXY] JWT_SECRET manquant');
        return false;
    }
    try {
        await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ['HS256'] });
        return true;
    } catch (error) {
        console.error('[PROXY] Token invalide:', error instanceof Error ? error.message : error);
        return false;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // Page de login : si déjà connecté, aller au dashboard
    if (pathname === '/admin/login') {
        if (token && (await isValidToken(token))) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Toutes les autres routes /admin/*
    if (!token) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (!(await isValidToken(token))) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('error', 'session_expired');
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('token');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};