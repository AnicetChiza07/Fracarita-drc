'use client';

import { Target, Eye, Heart } from 'lucide-react';

const mvvData = [
    { 
        type: 'light', 
        number: '01', 
        icon: Target, 
        label: 'Notre mission', 
        title: `Accompagner vers l'autonomie`, 
        text: `Offrir aux communautés vulnérables les outils, les connaissances et le soutien nécessaire pour qu'elles deviennent actrices de leur propre développement.` 
    },
    { 
        type: 'dark', 
        number: '02', 
        icon: Eye, 
        label: 'Notre vision', 
        title: 'Une RDC prospère et solidaire', 
        text: `Contribuer à bâtir une société congolaise où chaque individu, quelle que soit sa condition, a accès aux opportunités fondamentales : éducation, santé, dignité.` 
    },
    { 
        type: 'light', 
        number: '03', 
        icon: Heart, 
        label: 'Nos valeurs', 
        title: 'Charité, transparence, impact', 
        text: `Trois piliers qui guident chacune de nos actions. Nous croyons en l'amour du prochain, en la redevabilité totale et en la mesure concrète de notre impact.` 
    },
];

export default function AboutMvv() {
    return (
        <section className="py-20 lg:py-32 bg-white">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cream border border-lime/30 text-text text-sm font-medium mb-6">
                        <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                        Ce qui nous guide
                    </div>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark leading-tight">
                        Notre <span className="text-lime-dark italic">boussole</span> au quotidien.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mvvData.map((item, index) => {
                        const Icon = item.icon;
                        const isDark = item.type === 'dark';
                        return (
                            <div 
                                key={index} 
                                className={`relative p-8 rounded-3xl border border-transparent transition-all duration-500 hover:-translate-y-2 group overflow-hidden ${isDark ? 'bg-dark text-white hover:border-lime' : 'bg-cream hover:bg-white hover:border-lime'}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-lime/10' : 'from-lime/15'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                                <div className={`absolute top-6 right-8 font-serif text-5xl font-bold leading-none select-none ${isDark ? 'text-white/10' : 'text-dark/5'}`}>
                                    {item.number}
                                </div>
                                <div className="relative z-10">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:rotate-[-8deg] group-hover:scale-105 ${isDark ? 'bg-lime/15 text-lime group-hover:bg-lime group-hover:text-dark' : 'bg-lime text-dark'}`}>
                                        <Icon size={26} />
                                    </div>
                                    <div className={`font-sans text-xs font-semibold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-lime' : 'text-lime-dark'}`}>
                                        {item.label}
                                    </div>
                                    <h3 className={`font-serif text-xl font-bold mb-4 leading-tight ${isDark ? 'text-white' : 'text-dark'}`}>
                                        {item.title}
                                    </h3>
                                    <p className={`font-sans text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-text-light'}`}>
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}