import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import UsersManager from './UsersManager';

const prisma = new PrismaClient();

export default async function UsersPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) redirect('/admin/login');

    let currentUserRole = 'VIEWER';
    let currentUserId = '';
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
        currentUserRole = decoded.role;
        currentUserId = decoded.userId;
    } catch {
        redirect('/admin/login');
    }

    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <UsersManager 
            initialUsers={users} 
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
        />
    );
}