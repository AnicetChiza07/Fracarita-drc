import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import ArticleClient from './ArticleClient';

const prisma = new PrismaClient();

const formatDate = (date: Date | string | null) => {
    if (!date) return 'Date non spécifiée';
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const article = await prisma.article.findUnique({
        where: { slug, isPublished: true },
        include: { 
            category: true,
            author: true 
        },
    });

    if (!article) {
        notFound();
    }

    const relatedArticles = await prisma.article.findMany({
        where: {
            categoryId: article.categoryId,
            id: { not: article.id },
            isPublished: true,
        },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        include: { category: true, author: true },
    }).catch(() => []);

    const mappedArticle = {
        id: article.id,
        slug: article.slug,
        category: article.category?.name || 'Actualité',
        date: formatDate(article.publishedAt),
        // ✅ On met une valeur par défaut car le champ n'existe pas dans Prisma
        readTime: '5 min de lecture', 
        title: article.title,
        // ✅ On passe le JSON Tiptap tel quel au composant client
        content: article.content, 
        coverImage: article.coverImage,
        authorName: article.author?.name || 'Équipe Fracarita',
        authorRole: 'Direction',
        authorInitials: article.author?.name 
            ? article.author.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
            : 'EF',
    };

    const mappedRelated = relatedArticles.map((rel) => ({
        id: rel.id,
        slug: rel.slug,
        category: rel.category?.name || 'Actualité',
        date: formatDate(rel.publishedAt),
        title: rel.title,
        excerpt: rel.excerpt || 'Lire la suite...',
        authorName: rel.author?.name || 'Équipe Fracarita',
        authorInitials: rel.author?.name 
            ? rel.author.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
            : 'EF',
        image: rel.coverImage,
    }));

    return (
        <ArticleClient article={mappedArticle} relatedArticles={mappedRelated} />
    );
}