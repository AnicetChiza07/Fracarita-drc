'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Calendar, ArrowRight, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/layout/PageHero';

// Types pour les données reçues du Server Component
type FeaturedArticle = {
    id: string;
    slug: string;
    category: string;
    date: string;
    title: string;
    excerpt: string;
    authorName: string;
    authorRole: string;
    authorInitials: string;
    image: string | null;
};

type GridArticle = {
    id: string;
    slug: string;
    number: string;
    category: string;
    categoryId: string;
    date: string;
    title: string;
    excerpt: string;
    authorName: string;
    authorInitials: string;
    image: string | null;
};

type Filter = {
    id: string;
    name: string;
    count: number;
};

interface BlogClientProps {
    initialFeatured: FeaturedArticle | null;
    initialGrid: GridArticle[];
    initialFilters: Filter[];
}

export default function BlogClient({ initialFeatured, initialGrid, initialFilters }: BlogClientProps) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Animation au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Filtrage des articles
    const displayedArticles = activeFilter === 'all' 
        ? initialGrid 
        : initialGrid.filter(article => article.category === activeFilter || article.categoryId === activeFilter);

    // État vide si aucun article ne correspond au filtre
    if (initialGrid.length === 0 && !initialFeatured) {
        return (
            <main className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream border border-lime/30 text-lime-dark mb-6 mx-auto">
                        <FileText size={32} />
                    </div>
                    <h2 className="text-2xl font-serif font-semibold text-dark mb-4">Aucune actualité pour le moment</h2>
                    <p className="text-text-light">Revenez très vite pour découvrir nos dernières actions sur le terrain.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-white">
            {/* 1. Hero Réutilisable */}
            <PageHero
                titleBefore="Nos"
                highlight="actualités"
                titleAfter="récentes."
                description={`Suivez nos dernières actions, témoignages et avancées sur le terrain. Chaque article raconte une histoire d'espoir et de transformation.`}
                breadcrumbCurrent="Actualités"
                bgImage="/images/blog.jpg"
            />

            {/* 2. Article à la une (Bento Style) */}
            {initialFeatured && (
                <section className="py-16 lg:py-24 bg-white">
                    <div className="container">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-6 h-0.5 bg-lime" />
                            <span className="font-sans text-xs font-semibold text-lime-dark uppercase tracking-[0.15em]">Article à la une</span>
                        </div>

                        <Link href={`/blog/${initialFeatured.slug}`} className="group grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] bg-cream rounded-3xl overflow-hidden border border-transparent hover:border-lime/40 hover:-translate-y-2 transition-all duration-500">
                            {/* Image */}
                            <div className="relative overflow-hidden min-h-[360px] lg:min-h-[480px]">
                                {initialFeatured.image ? (
                                    <Image
                                        src={initialFeatured.image}
                                        alt={initialFeatured.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-lime/10 flex items-center justify-center">
                                        <FileText size={64} className="text-lime-dark/50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cream/20 lg:to-cream" />
                                
                                <div className="absolute top-6 left-6 bg-lime text-dark px-4 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-2 z-10">
                                    <Star size={12} />
                                    À la une
                                </div>
                            </div>

                            {/* Contenu */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-5 flex-wrap">
                                    <span className="font-sans text-xs font-semibold text-lime-dark uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-4 h-0.5 bg-lime" />
                                        {initialFeatured.category}
                                    </span>
                                    <span className="font-sans text-sm text-text-light flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {initialFeatured.date}
                                    </span>
                                </div>

                                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-dark leading-tight mb-4 transition-colors duration-300 group-hover:text-lime-dark">
                                    {initialFeatured.title}
                                </h2>

                                <p className="font-sans text-sm leading-relaxed text-text-light mb-8 line-clamp-3">
                                    {initialFeatured.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-black/8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-lime to-lime-dark flex items-center justify-center font-serif font-bold text-sm text-dark flex-shrink-0">
                                            {initialFeatured.authorInitials}
                                        </div>
                                        <div>
                                            <div className="font-serif text-sm font-semibold text-dark">{initialFeatured.authorName}</div>
                                            <div className="font-sans text-xs text-text-light">{initialFeatured.authorRole}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 font-sans text-sm font-semibold text-dark transition-colors duration-300 group-hover:text-lime-dark">
                                        {`Lire l'article`}
                                        <div className="w-10 h-10 bg-dark rounded-full flex items-center justify-center transition-all duration-400 group-hover:bg-lime group-hover:translate-x-1">
                                            <ArrowRight size={16} className="text-lime group-hover:text-dark transition-colors duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* 3. Grille d'articles et Filtres */}
            <section ref={sectionRef} className="py-16 lg:py-24 bg-cream relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-lime/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="container relative z-10">
                    <div className="max-w-xl mb-10">
                        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark leading-tight mb-6">
                            Toutes les <span className="text-lime-dark italic">publications</span>.
                        </h2>
                        
                        {/* Filtres dynamiques */}
                        <div className="flex flex-wrap gap-2 w-full">
                            {initialFilters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`flex-shrink-0 px-5 py-2.5 rounded-full font-sans text-sm font-medium transition-all duration-300 border ${
                                        activeFilter === filter.id
                                            ? 'bg-dark text-white border-dark'
                                            : 'bg-white text-dark border-transparent hover:border-lime/50 hover:-translate-y-0.5'
                                    }`}
                                >
                                    {filter.name} <span className={`ml-1 text-xs ${activeFilter === filter.id ? 'text-lime' : 'opacity-50'}`}>({filter.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grille */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedArticles.map((article, index) => (
                            <Link
                                key={article.id}
                                href={`/blog/${article.slug}`}
                                className={`group bg-white rounded-3xl overflow-hidden border border-black/5 hover:border-lime/40 hover:-translate-y-2 transition-all duration-500 flex flex-col ${
                                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden aspect-[16/10]">
                                    {article.image ? (
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-cream flex items-center justify-center">
                                            <FileText size={32} className="text-lime-dark/50" />
                                        </div>
                                    )}
                                    
                                    <div className="absolute top-4 left-4 bg-lime text-dark font-sans text-xs font-bold px-3 py-1.5 rounded-full z-10 tracking-wider shadow-sm">
                                        {article.number}
                                    </div>
                                    
                                    <div className="absolute top-4 right-4 bg-white text-dark font-sans text-[0.7rem] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10 transition-all duration-300 group-hover:bg-lime group-hover:-translate-y-1">
                                        <span className="w-1.5 h-1.5 bg-lime rounded-full group-hover:bg-dark" />
                                        {article.category}
                                    </div>
                                </div>

                                {/* Contenu */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="font-sans text-xs text-text-light mb-3 flex items-center gap-2">
                                        <span className="w-3.5 h-0.5 bg-lime" />
                                        {article.date}
                                    </div>

                                    <h3 className="font-serif text-base lg:text-lg font-semibold text-dark leading-snug mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-lime-dark">
                                        {article.title}
                                    </h3>

                                    <p className="font-sans text-sm text-text-light leading-relaxed mb-6 line-clamp-2 flex-grow">
                                        {article.excerpt}
                                    </p>

                                    {/* Footer de la carte */}
                                    <div className="flex items-center justify-between pt-4 border-t border-black/6 mt-auto">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center font-serif font-bold text-[0.7rem] text-dark transition-all duration-300 group-hover:bg-lime">
                                                {article.authorInitials}
                                            </div>
                                            <span className="font-serif text-xs font-semibold text-dark">{article.authorName}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center transition-all duration-300 group-hover:bg-lime group-hover:translate-x-1">
                                            <ArrowRight size={14} className="text-dark" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Message si aucun résultat après filtrage */}
                    {displayedArticles.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-text-light font-sans">Aucun article trouvé dans cette catégorie.</p>
                        </div>
                    )}

                    {/* Pagination (Statique pour l'instant, peut être connectée plus tard) */}
                    <div className="mt-16 flex items-center justify-center gap-2">
                        <button className="w-11 h-11 rounded-xl border border-black/6 flex items-center justify-center text-dark hover:bg-lime hover:border-lime hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="w-11 h-11 rounded-xl bg-dark text-white font-sans text-sm font-semibold flex items-center justify-center">1</button>
                        <button className="w-11 h-11 rounded-xl border border-black/6 bg-white text-dark font-sans text-sm font-semibold flex items-center justify-center hover:bg-lime hover:border-lime hover:-translate-y-0.5 transition-all duration-300">2</button>
                        <button className="w-11 h-11 rounded-xl border border-black/6 bg-white text-dark font-sans text-sm font-semibold flex items-center justify-center hover:bg-lime hover:border-lime hover:-translate-y-0.5 transition-all duration-300">3</button>
                        <button className="w-11 h-11 rounded-xl border border-black/6 flex items-center justify-center text-dark hover:bg-lime hover:border-lime hover:-translate-y-0.5 transition-all duration-300">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}