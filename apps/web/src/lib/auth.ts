import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
            email: string;
            role: string;
        };

        return decoded;
    } catch (error) {
        return null;
    }
}

export function requireRole(allowedRoles: string[]) {
    return async function () {
        const user = await getCurrentUser();
        
        if (!user || !allowedRoles.includes(user.role)) {
            return new NextResponse(JSON.stringify({ error: 'Accès refusé' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        return user;
    };
}