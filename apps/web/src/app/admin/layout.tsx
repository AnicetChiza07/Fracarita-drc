import { cookies, headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { Toaster } from 'sonner';
import Sidebar from './Sidebar';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getAdminSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; role: string };
    } catch {
        return null;
    }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const headersList = await headers();
    // Détection plus fiable de l'URL dans Next.js App Router
    const pathname = headersList.get('x-invoke-path') || headersList.get('next-url') || '';
    const isLoginPage = pathname.includes('/admin/login');

    const session = await getAdminSession();

    // ✅ Si on est sur la page de login, on affiche juste la page (le fixed inset-0 fera le reste)
    if (isLoginPage) {
        return (
            <>
                {children}
                <Toaster position="top-right" richColors closeButton theme="dark" />
            </>
        );
    }

    let unreadCount = 0;
    if (session) {
        unreadCount = await prisma.message.count({ where: { isRead: false } }).catch(() => 0);
    }

    return (
        <div className="h-screen bg-cream font-sans overflow-hidden">
            {session && (
                <Sidebar userEmail={session.email} userRole={session.role} userInitial={session.email.charAt(0).toUpperCase()} />
            )}

            <div className={`h-screen flex flex-col ${session ? 'lg:ml-64' : ''}`}>
                {session && (
                    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-20">
                        <h2 className="text-lg lg:text-xl font-bold text-dark ml-12 lg:ml-0">Bonjour, Administrateur 👋</h2>
                        
                        <div className="flex items-center gap-4">
                            <Link href="/admin/messages" className="relative w-10 h-10 rounded-full bg-cream flex items-center justify-center text-dark hover:bg-lime/20 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                            </Link>
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8">
                    {children}
                </main>
            </div>

            <Toaster position="top-right" richColors closeButton theme="light" />
        </div>
    );
}