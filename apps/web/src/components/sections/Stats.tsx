'use client';

import { useState, useEffect, useRef } from 'react';
import { FolderHeart, MapPin, HandHeart, School, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const statsData = [
    { icon: FolderHeart, value: 50, suffix: '+', label: 'Projets réalisés' },
    { icon: MapPin, value: 8, suffix: '', label: 'Provinces couvertes' },
    { icon: HandHeart, value: 200, suffix: '+', label: 'Bénévoles actifs' },
    { icon: School, value: 2500, suffix: '+', label: 'Élèves scolarisés' },
];

export default function Stats() {
    const [isVisible, setIsVisible] = useState(false);
    const [countersAnimated, setCountersAnimated] = useState(false);
    const [counts, setCounts] = useState(statsData.map(() => 0));
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    
                    if (!countersAnimated) {
                        setCountersAnimated(true);
                        statsData.forEach((stat, index) => {
                            let current = 0;
                            const step = stat.value / 60;
                            const timer = setInterval(() => {
                                current += step;
                                if (current >= stat.value) {
                                    current = stat.value;
                                    clearInterval(timer);
                                }
                                setCounts(prev => {
                                    const newCounts = [...prev];
                                    newCounts[index] = Math.floor(current);
                                    return newCounts;
                                });
                            }, 16);
                        });
                    }
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [countersAnimated]);

    return (
        <section ref={sectionRef} className="py-20 lg:py-32 bg-cream relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-lime/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-lime/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20 items-center">
                    
                    <div className={`${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}>
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-lime/30 text-text text-sm font-medium mb-6">
                            <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                            Notre Impact
                        </div>
                        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark leading-tight mb-5">
                            {`Des chiffres qui `}
                            <span className="text-lime-dark italic relative inline-block">
                                transforment
                                <span className="absolute bottom-1 left-0 w-full h-2 bg-lime/25 -z-10 rounded-sm" />
                            </span>
                            {` des vies.`}
                        </h2>
                        <p className="font-sans text-base text-text-light leading-relaxed mb-8 max-w-md">
                            {`Depuis notre création, nous mesurons chaque action par son impact réel sur les communautés congolaises. Voici notre empreinte humanitaire.`}
                        </p>
                        
                        <Link
                            href="/rapports"
                            className="inline-flex items-center gap-2 bg-dark text-white pl-5 pr-1.5 py-2 rounded-full font-sans font-semibold text-sm border-none cursor-pointer transition-all duration-300 hover:bg-lime hover:text-dark hover:-translate-y-1 group w-fit"
                        >
                            Voir nos rapports
                            <span className="w-8 h-8 bg-lime rounded-full flex items-center justify-center group-hover:bg-dark transition-all duration-300">
                                <ArrowRight size={14} className="text-dark group-hover:text-lime transition-colors duration-300" />
                            </span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {statsData.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div 
                                    key={index}
                                    className={`bg-white p-6 lg:p-8 rounded-2xl border border-black/5 transition-all duration-500 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-white hover:to-lime/5 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="w-10 h-10 rounded-full bg-lime/15 text-lime-dark flex items-center justify-center transition-all duration-300">
                                            <Icon size={20} />
                                        </div>
                                    </div>
                                    <div className="font-serif text-3xl lg:text-4xl font-bold text-dark tracking-tight mb-2">
                                        {counts[index].toLocaleString('fr-FR')}
                                        {stat.suffix && <span className="text-xl text-lime-dark">{stat.suffix}</span>}
                                    </div>
                                    <div className="font-sans text-sm text-text-light font-medium">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}