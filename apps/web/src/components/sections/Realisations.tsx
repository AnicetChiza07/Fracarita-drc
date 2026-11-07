'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Trophy } from 'lucide-react';
import Image from 'next/image';

type DbRealisation = {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    eventDate: Date | string | null;
    imageUrl: string | null;
    category: { name: string } | null;
};

interface RealisationsProps {
    initialRealisations: DbRealisation[];
}

export default function Realisations({ initialRealisations }: RealisationsProps) {
    // ✅ 1. HOOKS EN PREMIER : Toujours au niveau supérieur, avant tout return
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        // Si pas de données, on ne lance pas le timer
        if (initialRealisations.length === 0) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % initialRealisations.length);
        }, 6000);
        
        return () => clearInterval(timer);
    }, [initialRealisations.length]);

    // ✅ 2. MAPPING DES DONNÉES
    const realisations = initialRealisations.map((r, index) => ({
        id: r.id,
        category: r.category?.name || 'Général',
        year: r.eventDate ? new Date(r.eventDate).getFullYear().toString() : '2024',
        number: String(index + 1).padStart(2, '0'),
        title: r.title,
        description: r.description || '',
        location: r.location || 'RDC',
        image: r.imageUrl,
    }));

    // ✅ 3. RETURN CONDITIONNEL : Maintenant qu'il est APRÈS les hooks, c'est 100% valide
    if (realisations.length === 0) {
        return (
            <section className="py-20 lg:py-32 bg-dark relative overflow-hidden">
                <div className="container relative z-10 text-center px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lime/20 text-lime mb-6 mx-auto">
                        <Trophy size={32} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-white mb-4">
                        Nos Réalisations
                    </h2>
                    <p className="text-white/60 max-w-md mx-auto">
                        Les réalisations seront bientôt disponibles. Revenez très vite !
                    </p>
                </div>
            </section>
        );
    }

    // ✅ 4. FONCTIONS DE NAVIGATION
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % realisations.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + realisations.length) % realisations.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const current = realisations[currentSlide];

    // ✅ 5. RENDU PRINCIPAL
    return (
        <section className="py-20 lg:py-32 bg-dark relative overflow-hidden">
            <div className="container relative z-10">
                {/* Header en 2 colonnes */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 mb-12 lg:mb-16 items-end">
                    <div>
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white text-sm font-medium mb-6">
                            <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                            Nos Réalisations
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-white leading-tight">
                            Des actions qui <span className="text-lime italic">prennent vie</span>.
                        </h2>
                    </div>

                    <div className="lg:text-right">
                        <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-lg lg:ml-auto">
                            {`Découvrez nos activités déjà réalisées sur le terrain, chaque image raconte une histoire d'espoir et de transformation.`}
                        </p>
                    </div>
                </div>

                {/* Carousel */}
                <div className="bg-dark rounded-3xl overflow-hidden border border-white/8">
                    {/* Images */}
                    <div className="relative overflow-hidden aspect-[21/9] min-h-[500px]">
                        {realisations.map((realisation, index) => (
                            <div
                                key={realisation.id}
                                className={`absolute inset-0 transition-all duration-800 ease-in-out ${
                                    index === currentSlide
                                        ? 'opacity-100 scale-100'
                                        : 'opacity-0 scale-105'
                                }`}
                            >
                                {realisation.image ? (
                                    <Image
                                        src={realisation.image}
                                        alt={realisation.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 100vw"
                                        priority={index === 0}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-lime/10 text-lime">
                                        <Trophy size={64} />
                                    </div>
                                )}
                                
                                {/* Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-black/50" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                                {/* Contenu */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-20 z-10">
                                    {/* Meta */}
                                    <div className="flex items-center gap-4 mb-5 flex-wrap">
                                        <span className="inline-flex items-center gap-2 bg-lime px-3.5 py-1.5 rounded-full font-semibold text-xs text-dark">
                                            <div className="w-1.5 h-1.5 bg-dark rounded-full"></div>
                                            {realisation.category}
                                        </span>
                                        <span className="bg-white/15 backdrop-blur-xl px-3.5 py-1.5 rounded-full font-semibold text-xs text-white border border-white/20">
                                            {realisation.year}
                                        </span>
                                        <span className="text-lime text-xs font-semibold flex items-center gap-2.5">
                                            <span className="w-6 h-0.5 bg-lime"></span>
                                            {realisation.number} — Réalisation
                                        </span>
                                    </div>

                                    {/* Titre */}
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-white leading-tight mb-4 max-w-3xl">
                                        {realisation.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-base text-white/80 leading-relaxed mb-6 max-w-2xl">
                                        {realisation.description}
                                    </p>

                                    {/* Localisation */}
                                    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/8 backdrop-blur-xl border border-white/12 text-white/70 text-sm font-medium">
                                        <MapPin size={16} className="text-lime" />
                                        {realisation.location}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between px-6 sm:px-8 py-6 bg-dark/95 backdrop-blur-xl border-t border-white/8">
                        {/* Counter */}
                        <div className="text-white/60 text-sm font-medium">
                            <span className="text-xl font-bold text-lime">
                                {String(currentSlide + 1).padStart(2, '0')}
                            </span>
                            <span className="opacity-50"> / {String(realisations.length).padStart(2, '0')}</span>
                        </div>

                        {/* Dots */}
                        <div className="flex items-center gap-2">
                            {realisations.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        index === currentSlide
                                            ? 'w-8 bg-lime'
                                            : 'w-2 bg-white/20 hover:bg-white/40'
                                    }`}
                                    aria-label={`Aller à la réalisation ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Flèches */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={prevSlide}
                                className="w-12 h-12 rounded-full bg-white/8 border border-white/15 flex items-center justify-center text-white hover:bg-lime hover:border-lime hover:text-dark transition-all duration-300 hover:-translate-y-0.5"
                                aria-label="Réalisation précédente"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-12 h-12 rounded-full bg-white/8 border border-white/15 flex items-center justify-center text-white hover:bg-lime hover:border-lime hover:text-dark transition-all duration-300 hover:-translate-y-0.5"
                                aria-label="Réalisation suivante"
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}