import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ArticlesManager, { Article } from './ArticlesManager';

const prisma = new PrismaClient();

export default async function ArticlesPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) redirect('/admin/login');

    const [articles, categories] = await Promise.all([
        prisma.article.findMany({
            include: {
                category: { select: { id: true, name: true } },
                author: { select: { email: true } },
            },
            orderBy: { publishedAt: 'desc' },
        }),
        prisma.category.findMany({ 
            select: { id: true, name: true }, 
            orderBy: { name: 'asc' } 
        }),
    ]);

    return (
        <ArticlesManager 
            // ✅ Cast typé propre : JsonValue (Prisma) → JSONContent (Tiptap)
            initialArticles={articles as Article[]} 
            initialCategories={categories} 
        />
    );
}