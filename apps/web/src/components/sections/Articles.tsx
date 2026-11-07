'use client';

import { Clock, ArrowRight, ArrowUpRight, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Type correspondant aux données venant de Prisma
type DbArticle = {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    publishedAt: Date | string | null;
    coverImage?: string | null;
    readTime?: string | null;
    category: { name: string } | null;
    author: { name: string } | null;
};

interface ArticlesProps {
    initialArticles: DbArticle[];
}

// Fonction utilitaire pour formater la date en français
const formatDate = (date: Date | string | null) => {
    if (!date) return 'Date non spécifiée';
    return new Date(date).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
};

export default function Articles({ initialArticles }: ArticlesProps) {
    // 🛡️ ÉTAT VIDE ÉLÉGANT
    if (initialArticles.length === 0) {
        return (
            <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
                <div className="container relative z-10 text-center px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream border border-lime/30 text-lime-dark mb-6 mx-auto">
                        <FileText size={32} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-dark mb-4">
                        Dernières Nouvelles
                    </h2>
                    <p className="text-text-light max-w-md mx-auto">
                        Nos articles seront bientôt disponibles. Revenez très vite pour lire nos actualités !
                    </p>
                </div>
            </section>
        );
    }

    // ✅ MAPPING DES DONNÉES
    // On sépare le premier (featured) et les deux suivants (side)
    const featured = initialArticles[0];
    const sideArticles = initialArticles.slice(1, 3);

    return (
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
            {/* Ligne décorative en haut */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-lime/30" />

            <div className="container relative z-10">
                {/* Header en 2 colonnes */}
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12 lg:mb-16">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cream border border-lime/30 text-text text-sm font-medium mb-5">
                            <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse" />
                            Dernières Nouvelles
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-dark leading-tight">
                            Nos derniers <span className="text-lime-dark italic">articles</span> publiés.
                        </h2>
                    </div>

                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-3 font-semibold text-dark hover:text-lime-dark transition-all duration-300 group"
                    >
                        Tous les articles
                        <span className="w-10 h-10 bg-dark rounded-full flex items-center justify-center transition-all duration-400 group-hover:bg-lime group-hover:translate-x-1">
                            <ArrowRight size={16} className="text-lime group-hover:text-dark transition-colors duration-300" />
                        </span>
                    </Link>
                </div>

                {/* Layout Editorial */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
                    
                    {/* ✅ ARTICLE FEATURED (Grand) */}
                    <Link 
                        href={`/blog/${featured.slug}`} 
                        className="group relative block rounded-3xl overflow-hidden min-h-[480px] transition-all duration-600 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0">
                            {featured.coverImage ? (
                                <Image
                                    src={featured.coverImage}
                                    alt={featured.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-lime/10 flex items-center justify-center">
                                    <FileText size={64} className="text-lime-dark/50" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/35 to-black/85" />
                        </div>

                        <div className="absolute top-6 right-6 z-10 flex flex-col items-end gap-2.5">
                            <span className="inline-flex items-center gap-2 bg-lime px-3.5 py-1.5 rounded-full font-semibold text-xs text-dark">
                                <span className="w-1.5 h-1.5 bg-dark rounded-full" />
                                {featured.category?.name || 'Actualité'}
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xl px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/20">
                                <Clock size={11} />
                                {featured.readTime || '5 min de lecture'}
                            </span>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-9 z-10 text-white">
                            <div className="flex items-center gap-2 text-xs font-medium text-lime mb-2.5">
                                <span className="w-4 h-0.5 bg-lime" />
                                {formatDate(featured.publishedAt)}
                            </div>

                            <h3 className="text-xl sm:text-2xl lg:text-[1.4rem] font-semibold leading-tight mb-3 max-w-[90%]">
                                {featured.title}
                            </h3>

                            <p className="text-sm leading-relaxed text-white/82 mb-5 max-w-[85%] line-clamp-2">
                                {featured.excerpt || 'Découvrez les détails de cette action et son impact sur le terrain.'}
                            </p>

                            <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime to-lime-dark flex items-center justify-center font-bold text-sm text-dark flex-shrink-0">
                                    {featured.author?.name ? featured.author.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'EF'}
                                </div>
                                <div className="font-semibold text-sm text-white">
                                    {featured.author?.name || 'Équipe Fracarita'}
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center z-20 transition-all duration-400 group-hover:bg-lime group-hover:-rotate-45">
                            <ArrowUpRight size={20} className="text-dark" />
                        </div>
                    </Link>

                    {/* ✅ ARTICLES SIDE (2 petits) */}
                    <div className="flex flex-col gap-7">
                        {sideArticles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/blog/${article.slug}`}
                                className="group relative grid grid-cols-[150px_1fr] gap-5 pb-7 border-b border-black/8 transition-all duration-400 hover:translate-x-1.5 last:border-b-0 last:pb-0"
                            >
                                <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                                    {article.coverImage ? (
                                        <Image
                                            src={article.coverImage}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-800 group-hover:scale-105"
                                            sizes="150px"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-cream flex items-center justify-center">
                                            <FileText size={24} className="text-lime-dark/50" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col justify-center py-1">
                                    <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                                        <span className="font-semibold text-[0.68rem] text-lime-dark uppercase tracking-wider">
                                            {article.category?.name || 'Actualité'}
                                        </span>
                                        <span className="w-1 h-1 bg-lime rounded-full" />
                                        <span className="text-xs text-text-light">{formatDate(article.publishedAt)}</span>
                                    </div>

                                    <h3 className="text-base sm:text-lg font-semibold text-dark leading-tight mb-2 transition-colors duration-300 group-hover:text-lime-dark line-clamp-1">
                                        {article.title}
                                    </h3>

                                    <p className="text-sm leading-relaxed text-text-light mb-3 line-clamp-2">
                                        {article.excerpt || 'Lire la suite de cet article...'}
                                    </p>

                                    <div className="flex items-center gap-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6.5 h-6.5 rounded-full bg-cream flex items-center justify-center font-bold text-[0.65rem] text-dark">
                                                {article.author?.name ? article.author.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'EF'}
                                            </div>
                                            <span className="text-xs font-medium text-text">
                                                {article.author?.name || 'Équipe Fracarita'}
                                            </span>
                                        </div>

                                        <div className="ml-auto w-7.5 h-7.5 bg-cream rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-lime">
                                            <ArrowRight size={13} className="text-dark transition-transform duration-300 group-hover:translate-x-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}