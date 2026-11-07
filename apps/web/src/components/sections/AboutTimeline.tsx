'use client';

import { useState, useEffect, useRef } from 'react';

const timelineData = [
    { year: '1807', label: 'Les origines', title: 'Fondation de la congrégation', text: 'Naissance des Frères de la Charité en 1807, avec une mission claire : éducation et soins aux plus démunis.' },
    { year: '1911', label: 'Expansion', title: 'Arrivée en RD Congo', text: `Implantation des premières communautés en terre congolaise, début d'une aventure humaine exceptionnelle.` },
    { year: '2011', label: 'Célébration', title: 'Centenaire à Lusambo', text: `La région célèbre son centenaire, témoignant d'un siècle de présence et d'engagement continu.` },
    { year: '2018', label: 'Restructuration', title: 'Scission en deux régions', text: 'Lors du Chapitre général, la RD Congo est scindée en deux régions distinctes pour mieux servir les communautés.' },
    { year: '2026', label: `Aujourd'hui`, title: 'FRACARITA RDC en action', text: 'Une équipe de frères et de laïcs collaborateurs unis pour transformer durablement les conditions de vie en RDC.' },
];

export default function AboutTimeline() {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className="py-20 lg:py-32 bg-cream relative overflow-hidden">
            <div className="container relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-lime/30 text-text text-sm font-medium mb-6">
                        <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                        Notre parcours
                    </div>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark leading-tight mb-4">
                        {`Plus de deux siècles `}<span className="text-lime-dark italic">d&apos;engagement</span>.
                    </h2>
                    <p className="font-sans text-base text-text-light leading-relaxed">
                        {`De nos origines en 1807 à notre présence actuelle en RDC, chaque étape a renforcé notre mission au service des plus vulnérables.`}
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute top-0 bottom-0 left-6 md:left-1/2 w-0.5 bg-gradient-to-b from-transparent via-lime/30 to-transparent md:-translate-x-1/2" />

                    <div className="space-y-12">
                        {timelineData.map((item, index) => (
                            <div 
                                key={index} 
                                className={`relative grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className={`md:col-span-1 ${index % 2 === 0 ? 'md:col-start-1 md:text-right' : 'md:col-start-3 md:order-3'} order-2`}>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-lime hover:-translate-y-1 transition-all duration-300">
                                        <div className="font-sans text-xs font-semibold text-lime-dark uppercase tracking-wider mb-2">{item.label}</div>
                                        <h3 className="font-serif text-lg font-semibold text-dark mb-2">{item.title}</h3>
                                        <p className="font-sans text-sm text-text-light leading-relaxed">{item.text}</p>
                                    </div>
                                </div>

                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-lime text-dark flex items-center justify-center font-serif font-bold text-sm md:text-base border-4 border-cream z-10 order-1 md:order-2 flex-shrink-0 shadow-sm">
                                    {item.year}
                                </div>

                                <div className={`hidden md:block ${index % 2 === 0 ? 'md:col-start-3' : 'md:col-start-1'}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}