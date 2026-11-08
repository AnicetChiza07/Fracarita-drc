'use client';

import { useState, useEffect, useRef } from 'react';
import { HeartHandshake, Users, Globe, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutVolunteer() {
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

    const features = [
        { 
            icon: HeartHandshake, 
            title: 'Impact', 
            desc: 'Accompagnement concret des communautés vulnérables au quotidien.' 
        },
        { 
            icon: Users, 
            title: 'Esprit d\'équipe', 
            desc: 'Intégration à des programmes éducatifs et de santé aux côtés d\'experts.' 
        },
        { 
            icon: Globe, 
            title: 'Mobilité', 
            desc: 'Mission dans l\'une de nos 8 provinces d\'intervention en RDC.' 
        }
    ];

    return (
        <section ref={ref} className="py-24 lg:py-32 bg-dark relative overflow-hidden">
            
            {/* Arrière-plan organique et premium */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lime/5 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[150px]" />
            </div>

            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* COLONNE GAUCHE : Contenu Textuel */}
                    <div className={`lg:col-span-6 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                        
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-lime text-sm font-medium mb-8 backdrop-blur-sm">
                            <Sparkles size={14} className="text-lime" />
                            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em]">Devoir volontaire</span>
                        </div>

                        <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6">
                            Rejoignez-nous pour une vie <span className="text-lime italic">meilleure</span> et un bel avenir.
                        </h2>
                        
                        <p className="font-sans text-base lg:text-lg text-white/70 leading-relaxed mb-10 max-w-lg">
                            {`En devenant volontaire, vous avez diverses options pour participer à nos actions en faveur des personnes qui en ont besoin.`}
                        </p>

                        {/* ✅ Grille de Cartes : 2 en haut, 1 en bas (qui prend toute la largeur) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {features.map((feature, i) => {
                                const Icon = feature.icon;
                                // La 3ème carte (index 2) prend 2 colonnes sur les écrans moyens et grands
                                const isLastCard = i === 2;
                                
                                return (
                                    <div 
                                        key={i} 
                                        className={`group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-lime/30 transition-all duration-300 hover:-translate-y-1 ${
                                            isLastCard ? 'sm:col-span-2' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-lime/10 border border-lime/20 flex items-center justify-center text-lime flex-shrink-0 transition-all duration-300 group-hover:bg-lime group-hover:text-dark group-hover:border-lime group-hover:scale-110">
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-sans text-sm font-bold text-white mb-1.5 group-hover:text-lime transition-colors duration-300">
                                                    {feature.title}
                                                </h4>
                                                <p className="font-sans text-xs text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                                                    {feature.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ✅ Bouton CTA qui redirige vers /contact */}
                        <Link 
                            href="/contact"
                            className="group relative inline-flex items-center gap-3 bg-lime text-dark pl-5 pr-2 py-2 rounded-full font-sans font-bold text-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 w-fit"
                        >
                            <span className="relative z-10">Devenir volontaire</span>
                            <span className="relative z-10 w-8 h-8 bg-dark rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white">
                                <ArrowRight size={16} className="text-lime transition-colors duration-300 group-hover:text-dark" />
                            </span>
                            {/* Effet de brillance au survol */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out" />
                        </Link>
                    </div>

                                        {/* COLONNE DROITE : Visuel Impactant */}
                    <div className={`lg:col-span-6 relative transition-all duration-1000 delay-200 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                        
                        {/* Cadre décoratif derrière l'image */}
                        <div className="absolute -inset-4 border border-lime/20 rounded-[2rem] -z-10" />

                        {/* ✅ Conteneur principal de l'image (sans padding externe pour éviter les débordements) */}
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-square group shadow-black/50">
                            
                            {/* Image qui remplit parfaitement le conteneur */}
                            <Image 
                                src="/images/volontaire-fracarita.jpg" 
                                alt="Volontaires en action" 
                                fill 
                                className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" 
                                sizes="(max-width: 1024px) 100vw, 50vw" 
                            />
                            
                            {/* Dégradé subtil en bas pour la lisibilité */}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-80 pointer-events-none" />

                            {/* ✅ Carte Glassmorphism (strictement à l'intérieur, avec marges internes) */}
                            <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 z-20 animate-[float_6s_ease-in-out_infinite]">
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 lg:p-5 flex items-center gap-4 shadow-xl">
                                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-lime rounded-full flex items-center justify-center text-dark flex-shrink-0 shadow-lg shadow-lime/20">
                                        <Users size={20} className="lg:w-6 lg:h-6" />
                                    </div>
                                    <div>
                                        <div className="font-serif text-xl lg:text-2xl font-bold text-white leading-none mb-1">
                                            <span className="text-lime">200+</span> volontaires
                                        </div>
                                        <div className="text-[0.65rem] lg:text-xs text-white/70 font-medium tracking-wide uppercase">Actifs à travers la RDC</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animation personnalisée pour le flottement doux de la carte */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </section>
    );
}