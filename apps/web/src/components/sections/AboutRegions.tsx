'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const regionsData = [
    { 
        year: 'Région Sud-Ouest', 
        name: `Notre-Dame d'Afrique`, 
        territory: 'Sud-Ouest de la RD Congo', 
        text: `Cette région couvre le sud-ouest de la République Démocratique du Congo. Elle compte un important groupe de membres associés qui travaillent main dans la main avec les frères.` 
    },
    { 
        year: 'Région Nord-Est', 
        name: 'Notre-Dame de Lorette', 
        territory: 'Nord-Est de la RD Congo & RCA', 
        text: `Cette région s'étend sur le nord-est de la RD Congo et la République Centrafricaine. Elle dispose également d'un important groupe de membres associés engagés.` 
    }
];

export default function AboutRegions() {
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
        <section ref={ref} className="py-20 lg:py-32 bg-white">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cream border border-lime/30 text-text text-sm font-medium mb-6">
                        <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                        Notre présence
                    </div>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark leading-tight mb-4">
                        Une forte équipe de <span className="text-lime-dark italic">professionnels</span> pour les démunis.
                    </h2>
                    <p className="font-sans text-base text-text-light leading-relaxed">
                        {`Plusieurs frères congolais ont été envoyés dans d'autres pays africains pour aider à développer de nouvelles communautés. En 2018, la RD Congo a été scindée en deux régions distinctes.`}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {regionsData.map((region, index) => (
                        <div 
                            key={index} 
                            className={`relative bg-cream p-8 lg:p-10 rounded-3xl border border-transparent transition-all duration-500 hover:bg-white hover:border-lime hover:-translate-y-2 group overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-lime/10 rounded-full blur-3xl pointer-events-none group-hover:w-60 group-hover:h-60 transition-all duration-500" />
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 bg-lime text-dark px-3.5 py-1.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider mb-6">
                                    <div className="w-1.5 h-1.5 bg-dark rounded-full"></div>
                                    {region.year}
                                </div>
                                <h3 className="font-serif text-xl lg:text-2xl font-bold text-dark mb-3">{region.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-lime-dark font-medium mb-4">
                                    <MapPin size={16} />
                                    {region.territory}
                                </div>
                                <p className="font-sans text-sm text-text-light leading-relaxed">{region.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}