'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, ArrowRight, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// ✅ Imports Tiptap pour le rendu en lecture seule
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const socialIcons = {
    facebook: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    x: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    linkedin: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    link: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
};

type ArticleData = {
    id: string;
    slug: string;
    category: string;
    date: string;
    readTime: string;
    title: string;
    content: unknown; 
    coverImage: string | null;
    authorName: string;
    authorRole: string;
    authorInitials: string;
};

type RelatedArticle = {
    id: string;
    slug: string;
    category: string;
    date: string;
    title: string;
    excerpt: string;
    authorName: string;
    authorInitials: string;
    image: string | null;
};

interface ArticleClientProps {
    article: ArticleData;
    relatedArticles: RelatedArticle[];
}

export default function ArticleClient({ article, relatedArticles }: ArticleClientProps) {
    const [scrollProgress, setScrollProgress] = useState(0);

        // ✅ Configuration de l'éditeur Tiptap en mode lecture seule
    const editor = useEditor({
        extensions: [StarterKit],
        // ✅ On vérifie le type de manière sûre avant de le passer à Tiptap
        content: (typeof article.content === 'string' 
            ? article.content 
            : (article.content as Record<string, unknown> | undefined)) || undefined,
        editable: false, // Mode lecture seule
        immediatelyRender: false,
    });

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = totalScroll / windowHeight;
            setScrollProgress(scroll);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <main className="bg-white">
            <div 
                className="fixed top-0 left-0 h-1 bg-gradient-to-r from-lime to-lime-dark z-[999] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(200,224,71,0.5)]"
                style={{ width: `${scrollProgress * 100}%` }}
            />

            {/* 1. Article Hero */}
            <section className="relative min-h-[65vh] lg:min-h-[75vh] flex items-end overflow-hidden pb-16 lg:pb-24">
                <div className="absolute inset-0 z-10">
                    {article.coverImage ? (
                        <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority sizes="100vw" />
                    ) : (
                        <div className="absolute inset-0 bg-dark flex items-center justify-center">
                            <FileText size={64} className="text-lime/50" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/95 z-20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(200,224,71,0.15)_0%,transparent_50%)] z-30" />
                </div>

                <div className="container relative z-40">
                    <div className="max-w-4xl text-white">
                        <div className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-xl border border-white/12 px-5 py-2 rounded-full text-sm text-white/80 mb-8">
                            <Link href="/" className="hover:text-lime transition-colors">Accueil</Link>
                            <ChevronRight size={14} className="opacity-50" />
                            <Link href="/blog" className="hover:text-lime transition-colors">Actualités</Link>
                            <ChevronRight size={14} className="opacity-50" />
                            <span className="text-lime font-semibold line-clamp-1">{article.category}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="inline-flex items-center gap-2 bg-lime text-dark px-4 py-1.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 bg-dark rounded-full"></div>
                                {article.category}
                            </span>
                            <span className="flex items-center gap-2 text-white/70 font-sans text-sm">
                                <Calendar size={16} className="text-lime" />
                                {article.date}
                            </span>
                            <span className="flex items-center gap-2 text-white/70 font-sans text-sm">
                                <Clock size={16} className="text-lime" />
                                {article.readTime}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight tracking-tight">
                            {article.title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* 2. Article Layout (Content + Sidebar) */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
                        
                        {/* ✅ Main Content : Rendu Tiptap propre avec classes Tailwind Typography */}
                        <article className="max-w-3xl font-sans text-base lg:text-lg leading-relaxed text-text 
                            prose prose-lg prose-dark max-w-none 
                            prose-headings:font-serif prose-headings:font-bold prose-headings:text-dark prose-headings:mt-12 prose-headings:mb-6
                            prose-p:mb-6 prose-strong:text-dark prose-strong:font-semibold
                            prose-blockquote:relative prose-blockquote:my-10 prose-blockquote:p-8 lg:prose-blockquote:p-10 prose-blockquote:bg-lime/5 prose-blockquote:border-l-4 prose-blockquote:border-lime prose-blockquote:rounded-r-2xl prose-blockquote:font-serif prose-blockquote:text-xl lg:prose-blockquote:text-2xl prose-blockquote:text-dark prose-blockquote:italic
                            prose-ul:list-none prose-ul:space-y-3 prose-ul:mb-8 prose-li:flex prose-li:items-start prose-li:gap-3">
                            
                            {editor ? (
                                <EditorContent editor={editor} />
                            ) : (
                                <p className="text-text-light italic">Chargement du contenu...</p>
                            )}
                        </article>

                        {/* Sidebar (Sticky) */}
                        <aside className="hidden lg:flex flex-col gap-10 sticky top-24">
                            <div>
                                <h4 className="font-sans text-xs font-semibold text-lime-dark uppercase tracking-[0.15em] mb-4 flex items-center gap-2.5">
                                    <div className="w-4 h-0.5 bg-lime"></div>
                                    Partager
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(socialIcons).map((Icon, i) => (
                                        <button key={i} className="w-10 h-10 bg-cream rounded-full flex items-center justify-center text-dark hover:bg-lime hover:-translate-y-1 transition-all duration-300">
                                            {Icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-sans text-xs font-semibold text-lime-dark uppercase tracking-[0.15em] mb-4 flex items-center gap-2.5">
                                    <div className="w-4 h-0.5 bg-lime"></div>
                                    Auteur
                                </h4>
                                <div className="flex items-center gap-3 p-4 bg-cream rounded-xl">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lime to-lime-dark flex items-center justify-center font-serif font-bold text-sm text-dark flex-shrink-0">
                                        {article.authorInitials}
                                    </div>
                                    <div>
                                        <div className="font-serif text-sm font-semibold text-dark">{article.authorName}</div>
                                        <div className="font-sans text-xs text-text-light">{article.authorRole}</div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* 3. Articles Similaires */}
            {relatedArticles.length > 0 && (
                <section className="py-16 lg:py-24 bg-cream relative overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-lime/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="container relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
                            <div>
                                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-lime/30 text-text text-sm font-medium mb-5">
                                    <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                                    À lire aussi
                                </div>
                                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark leading-tight">
                                    Articles <span className="text-lime-dark italic">similaires</span>.
                                </h2>
                            </div>
                            <Link href="/blog" className="inline-flex items-center gap-3 font-sans text-sm font-semibold text-dark hover:text-lime-dark transition-all duration-300 group">
                                Tous les articles
                                <div className="w-10 h-10 bg-dark rounded-full flex items-center justify-center transition-all duration-400 group-hover:bg-lime group-hover:translate-x-1">
                                    <ArrowRight size={16} className="text-lime group-hover:text-dark transition-colors duration-300" />
                                </div>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedArticles.map((rel) => (
                                <Link key={rel.id} href={`/blog/${rel.slug}`} className="group bg-white rounded-3xl overflow-hidden border border-black/5 hover:border-lime/40 hover:-translate-y-2 transition-all duration-500 flex flex-col">
                                    <div className="relative overflow-hidden aspect-[16/10]">
                                        {rel.image ? (
                                            <Image src={rel.image} alt={rel.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                        ) : (
                                            <div className="absolute inset-0 bg-cream flex items-center justify-center"><FileText size={32} className="text-lime-dark/50" /></div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white text-dark font-sans text-[0.7rem] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10 transition-all duration-300 group-hover:bg-lime group-hover:-translate-y-1">
                                            <span className="w-1.5 h-1.5 bg-lime rounded-full group-hover:bg-dark"></span>
                                            {rel.category}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="font-sans text-xs text-text-light mb-3 flex items-center gap-2">
                                            <div className="w-3.5 h-0.5 bg-lime"></div>
                                            {rel.date}
                                        </div>
                                        <h3 className="font-serif text-base lg:text-lg font-semibold text-dark leading-snug mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-lime-dark">{rel.title}</h3>
                                        <p className="font-sans text-sm text-text-light leading-relaxed mb-6 line-clamp-2 flex-grow">{rel.excerpt}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-black/6 mt-auto">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center font-serif font-bold text-[0.7rem] text-dark transition-all duration-300 group-hover:bg-lime">{rel.authorInitials}</div>
                                                <span className="font-serif text-xs font-semibold text-dark">{rel.authorName}</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center transition-all duration-300 group-hover:bg-lime group-hover:translate-x-1">
                                                <ArrowRight size={14} className="text-dark" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}