'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Star, MessageSquareQuote } from 'lucide-react';

type DbTestimonial = {
    id: string;
    quote?: string | null;
    content?: string | null;
    authorName?: string | null;
    name?: string | null;
    role?: string | null;
    location?: string | null;
};

interface TestimonialsProps {
    initialTestimonials: DbTestimonial[];
}

export default function Testimonials({ initialTestimonials }: TestimonialsProps) {
    // ✅ 1. HOOKS EN PREMIER : Toujours au niveau supérieur, avant tout return
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollLeft = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
            setTimeout(checkScroll, 500);
        }
    };

    // Auto-défilement
    useEffect(() => {
        const timer = setInterval(() => {
            if (scrollContainerRef.current && canScrollRight) {
                scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                setTimeout(checkScroll, 500);
            } else if (scrollContainerRef.current && !canScrollRight) {
                scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                setTimeout(checkScroll, 500);
            }
        }, 5000);

        return () => clearInterval(timer);
    }, [canScrollRight]);

    // Vérification initiale et resize
    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    // ✅ 2. RETURN CONDITIONNEL : Maintenant qu'il est APRÈS les hooks, c'est 100% valide
    if (initialTestimonials.length === 0) {
        return (
            <section className="py-20 lg:py-32 bg-cream relative overflow-hidden">
                <div className="container relative z-10 text-center px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-lime/30 text-lime-dark mb-6 mx-auto">
                        <MessageSquareQuote size={32} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-dark mb-4">
                        Témoignages du terrain
                    </h2>
                    <p className="text-text-light max-w-md mx-auto">
                        Les témoignages de nos bénéficiaires seront bientôt disponibles.
                    </p>
                </div>
            </section>
        );
    }

    // ✅ 3. MAPPING DES DONNÉES + GÉNÉRATION DYNAMIQUE DES INITIALES
    const testimonials = initialTestimonials.map((t) => {
        const author = t.authorName || t.name || 'Anonyme';
        const initials = author
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

        return {
            id: t.id,
            quote: t.quote || t.content || 'Un témoignage inspirant de notre communauté.',
            author: author,
            role: t.role || 'Bénéficiaire',
            location: t.location || 'RDC',
            initials: initials,
        };
    });

    // ✅ 4. RENDU PRINCIPAL
    return (
        <section className="py-20 lg:py-32 bg-cream relative overflow-hidden">
            {/* Glows décoratifs subtils */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lime/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative z-10">
                {/* Header centré */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-lime/30 text-text text-sm font-medium mb-6">
                        <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                        Témoignages du terrain
                    </div>

                    <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-dark leading-[1.1]">
                        {`Des voix qui `}
                        <span className="text-lime-dark italic">portent</span>
                        {` nos actions.`}
                    </h2>
                </div>

                {/* Layout : Titre à gauche + Cartes à droite */}
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-16 items-start">
                    {/* Colonne gauche : Titre + Flèches */}
                    <div className="lg:sticky lg:top-32">
                        <div className="mb-8">
                            <div className="text-7xl lg:text-8xl font-serif font-bold text-lime/40 leading-none mb-4">
                                {"\u201C"}
                            </div>
                            <h3 className="font-serif text-2xl lg:text-3xl font-bold text-dark leading-tight">
                                {`La parole à `}
                                <br />
                                <span className="text-lime-dark italic">ceux qui comptent</span>
                                <span className="text-dark">.</span>
                            </h3>
                            <p className="font-sans text-base text-text-light leading-relaxed mt-4">
                                {`Chaque témoignage est une preuve vivante de l'impact de nos actions sur le terrain.`}
                            </p>
                        </div>

                        {/* Flèches de navigation */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => scroll('left')}
                                disabled={!canScrollLeft}
                                className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-dark hover:bg-lime hover:border-lime transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group"
                                aria-label="Témoignages précédents"
                            >
                                <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                disabled={!canScrollRight}
                                className="w-12 h-12 rounded-full bg-dark border border-dark flex items-center justify-center text-white hover:bg-lime hover:border-lime hover:text-dark transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group"
                                aria-label="Témoignages suivants"
                            >
                                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </div>

                    {/* Colonne droite : Carrousel de cartes */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={checkScroll}
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mb-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="flex-shrink-0 w-[320px] sm:w-[360px] bg-white rounded-2xl border border-gray-200 p-8 hover:border-lime transition-all duration-300 snap-start"
                            >
                                <div className="flex items-center gap-1 mb-5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-lime text-lime" />
                                    ))}
                                </div>

                                <p className="font-sans text-base text-text leading-relaxed mb-8 min-h-[120px]">
                                    {`"${testimonial.quote}"`}
                                </p>

                                <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                                    <div className="w-12 h-12 rounded-full bg-lime flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-dark">
                                            {testimonial.initials}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-sans text-base font-semibold text-dark">
                                            {testimonial.author}
                                        </div>
                                        <div className="font-sans text-sm text-text-light mt-0.5">
                                            {testimonial.role} • {testimonial.location}
                                        </div>
                                    </div>
                                </div>
            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}