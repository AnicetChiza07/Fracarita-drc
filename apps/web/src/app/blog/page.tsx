import { PrismaClient } from '@prisma/client';
import BlogClient from './BlogClient';

// ✅ CETTE LIGNE DIT À NEXT.JS DE TOUJOURS ALLER CHERCHER LES DONNÉES LES PLUS RÉCENTES
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Fonction pour formater la date
const formatDate = (date: Date | string | null) => {
    if (!date) return 'Date non spécifiée';
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default async function BlogPage() {
    // 1. Récupérer tous les articles publiés
    const allArticles = await prisma.article.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        include: { 
            category: true,
            author: true 
        },
    }).catch(() => []);

    // 2. Séparer le premier article (À la une) du reste (Grille)
    const featuredArticle = allArticles[0] || null;
    const gridArticles = allArticles.slice(1);

    // 3. Générer les filtres dynamiquement avec les vrais comptes
    const categoryCounts = allArticles.reduce((acc, curr) => {
        const catName = curr.category?.name || 'Général';
        acc[catName] = (acc[catName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const filters = [
        { id: 'all', name: 'Tous', count: allArticles.length },
        ...Object.entries(categoryCounts).map(([name, count]) => ({
            id: name,
            name: name,
            count: count
        }))
    ];

    // 4. Mapper les données pour le composant Client
    const mappedFeatured = featuredArticle ? {
        id: featuredArticle.id,
        slug: featuredArticle.slug,
        category: featuredArticle.category?.name || 'Actualité',
        date: formatDate(featuredArticle.publishedAt),
        title: featuredArticle.title,
        excerpt: featuredArticle.excerpt || 'Découvrez les détails de cette action sur le terrain.',
        authorName: featuredArticle.author?.name || 'Équipe Fracarita',
        authorRole: 'Direction', 
        authorInitials: featuredArticle.author?.name ? featuredArticle.author.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'EF',
        image: featuredArticle.coverImage,
    } : null;

    const mappedGrid = gridArticles.map((article, index) => ({
        id: article.id,
        slug: article.slug,
        number: String(index + 1).padStart(2, '0'),
        category: article.category?.name || 'Actualité',
        categoryId: article.category?.id || 'all',
        date: formatDate(article.publishedAt),
        title: article.title,
        excerpt: article.excerpt || 'Lire la suite de cet article...',
        authorName: article.author?.name || 'Équipe Fracarita',
        authorInitials: article.author?.name ? article.author.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'EF',
        image: article.coverImage,
    }));

    return (
        // On passe les données préparées au composant Client
        <BlogClient 
            initialFeatured={mappedFeatured}
            initialGrid={mappedGrid}
            initialFilters={filters}
        />
    );
}