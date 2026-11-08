'use client';

import { useState, useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';
import Image from 'next/image';

export default function AboutIntro() {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className="py-24 lg:py-32 bg-white relative overflow-hidden">
            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* COLONNE GAUCHE : Composition Visuelle Épurée */}
                    <div className={`lg:col-span-6 relative transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                        
                        {/* Conteneur principal */}
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                            
                            {/* Cercle décoratif d'arrière-plan */}
                            <div className="absolute inset-8 bg-gray-50 rounded-full" />

                            {/* ✅ Tag "Qui sommes-nous" parfaitement centré en haut */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-dark text-white px-5 py-2 rounded-full shadow-lg">
                                <span className="font-sans text-xs font-semibold tracking-wide">Qui sommes-nous</span>
                            </div>

                            {/* Image Principale (Grande, circulaire) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] rounded-full overflow-hidden shadow-xl border-8 border-white z-10">
                                <Image 
                                    src="/images/about-fracarita.jpg" 
                                    alt="Frères de la Charité" 
                                    fill 
                                    className="object-cover transition-transform duration-[2s] ease-out hover:scale-110" 
                                    sizes="(max-width: 1024px) 75vw, 50vw" 
                                />
                            </div>

                            {/* Image Secondaire (Plus petite, superposée en bas à droite) */}
                            <div className="absolute bottom-8 right-8 w-[45%] h-[45%] rounded-full overflow-hidden border-8 border-white shadow-lg z-20 group">
                                <Image 
                                    src="/images/about-kit.jpg" 
                                    alt="Action sur le terrain" 
                                    fill 
                                    className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-110" 
                                    sizes="(max-width: 1024px) 45vw, 25vw" 
                                />
                            </div>

                        </div>
                    </div>

                    {/* COLONNE DROITE : Texte + Citation */}
                    <div className={`lg:col-span-6 relative transition-all duration-1000 delay-200 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                        
                        {/* Tag secondaire discret */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-text text-sm font-medium mb-6">
                            <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                            Organisation Sans But Lucratif
                        </div>

                        {/* Titre */}
                        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark leading-tight mb-6">
                            Les <span className="text-lime-dark italic">Frères de la Charité</span>, une présence qui traverse les siècles.
                        </h2>

                        {/* Paragraphes (sans soulignement) */}
                        <div className="space-y-4 font-sans text-base text-text-light leading-relaxed mb-8">
                            <p>
                                {`Depuis 1807, les Frères de la Charité se tiennent du côté de ceux que la société oublie. Une mission qui a traversé les époques, incarnée aujourd'hui par des milliers de frères et de laïcs collaborateurs.`}
                            </p>
                            <p>
                                {`Unis par une même conviction : `}
                                <span className="text-dark font-semibold">
                                    {`offrir de l'éducation et des soins à ceux qui en ont le plus besoin.`}
                                </span>
                            </p>
                        </div>

                        {/* Citation élégante */}
                        <div className="relative bg-lime/5 border-l-4 border-lime pl-6 pr-6 py-5 rounded-r-xl">
                            <Quote size={20} className="absolute top-3 left-3 text-lime-dark/30" />
                            <p className="font-sans text-base text-dark italic leading-relaxed pl-4">
                                {`« Se mettre du côté de ceux qui n'ont nulle part ailleurs de réponse à leur demande d'aide. »`}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}