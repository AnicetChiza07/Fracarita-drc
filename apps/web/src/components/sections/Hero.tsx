'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
    {
        badge: 'Depuis 1807',
        title: 'Une présence qui traverse les',
        highlight: 'siècles',
        titleEnd: 'pour transformer des vies.',
        description: "Les Frères de la Charité s'engagent aux côtés des plus vulnérables en RDC, offrant éducation, soins et espoir là où le besoin est le plus grand.",
        buttonText: 'Qui sommes-nous ?',
        link: '/a-propos',
        image: '/images/humanitaire.jpg',
    },
    {
        badge: 'Nos Actions',
        title: 'Agir concrètement dans nos',
        highlight: 'domaines',
        titleEnd: "d'intervention.",
        description: "De l'éducation de qualité aux soins de santé communautaire, nous déployons des programmes durables pour autonomiser les familles congolaises.",
        buttonText: 'Nos Domaines',
        link: '/#domaines',
        image: '/images/education.jpg',
    },
    {
        badge: 'Impact Réel',
        title: 'Des résultats qui parlent',
        highlight: "d'eux-mêmes",
        titleEnd: 'sur le terrain.',
        description: "Découvrez nos projets achevés et en cours : écoles construites, centres de santé équipés et communautés transformées à travers la RDC.",
        buttonText: 'Nos Réalisations',
        link: '/#realisations',
        image: '/images/sante.jpg',
    },
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [animationKey, setAnimationKey] = useState(0);

    // Auto-play toutes les 6 secondes (6000ms est idéal pour la lecture)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setAnimationKey((prev) => prev + 1);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setAnimationKey((prev) => prev + 1);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setAnimationKey((prev) => prev + 1);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setAnimationKey((prev) => prev + 1);
    };

    return (
        <section className="relative h-screen min-h-[700px] overflow-hidden bg-darker">
            {/* Carousel */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${
                            index === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        {/* Background Image avec Next.js Image pour l'optimisation */}
                        <div className="absolute inset-0 z-[1]">
                            <Image
                                src={slide.image}
                                alt={slide.badge}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            {/* Overlays pour la lisibilité */}
                            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
                        </div>

                        {/* Contenu centré */}
                        <div className="container relative z-[2] text-center px-4">
                            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                            
                                {/* Badge */}
                                <div
                                    key={`badge-${animationKey}`}
                                    className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-xl border border-white/25 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-white fade-in-up"
                                    style={{ animationDelay: '0s' }}
                                >
                                    <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse" />
                                    {slide.badge}
                                </div>

                                {/* Titre avec le mot clé en italique et lime */}
                                <h1
                                    key={`title-${animationKey}`}
                                    className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold leading-[1.1] tracking-tight text-white fade-in-up delay-1"
                                >
                                    {slide.title}{' '}
                                    <span className="text-lime italic">{slide.highlight}</span>{' '}
                                    {slide.titleEnd}
                                </h1>

                                {/* Description */}
                                <p
                                    key={`desc-${animationKey}`}
                                    className="text-base sm:text-lg leading-relaxed text-white/85 max-w-2xl mx-auto font-sans fade-in-up delay-2"
                                >
                                    {slide.description}
                                </p>

                                {/* Bouton d'action avec lien dynamique */}
                                <div
                                    key={`btn-${animationKey}`}
                                    className="fade-in-up delay-3"
                                >
                                    <Link
                                        href={slide.link}
                                        className="inline-flex items-center gap-2 bg-lime text-dark pl-5 pr-1.5 py-2 rounded-full font-semibold text-sm sm:text-base border-none cursor-pointer transition-all duration-300 hover:bg-white hover:-translate-y-1 group"
                                    >
                                        {slide.buttonText}
                                        <span className='bg-dark w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-lime transition-colors duration-300'>
                                            <ArrowRight size={14} className="text-lime group-hover:text-dark transition-colors duration-300" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Contrôleur de carousel (Prev + Dots + Next) centré en bas */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[30] flex items-center gap-4">
                    {/* Bouton Précédent */}
                    <button
                        onClick={prevSlide}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-lime hover:text-dark hover:border-lime transition-all duration-300 group"
                        aria-label="Slide précédente"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Indicateurs (Dots) */}
                    <div className="flex items-center gap-3">
                        {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-1 rounded-sm cursor-pointer transition-all duration-500 ${
                            index === currentSlide ? 'bg-lime w-12' : 'bg-white/30 w-8 hover:bg-white/60'
                            }`}
                            aria-label={`Aller à la diapositive ${index + 1}`}
                        />
                        ))}
                    </div>

                    {/* Bouton Suivant */}
                    <button
                        onClick={nextSlide}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-lime hover:text-dark hover:border-lime transition-all duration-300 group"
                        aria-label="Slide suivante"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}