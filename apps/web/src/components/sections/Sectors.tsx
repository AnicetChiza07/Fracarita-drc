'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FolderOpen } from 'lucide-react';

type StatItem = {
    value: string;
    label: string;
};

// ✅ On change 'stats' en 'unknown' pour accepter le JsonValue de Prisma sans erreur TS
type DbSector = {
    id: string;
    name: string;
    subtitle?: string | null;
    description?: string | null;
    imageUrl?: string | null;
    stats?: unknown; 
};

interface SectorsProps {
    initialSectors: DbSector[];
}

export default function Sectors({ initialSectors }: SectorsProps) {
    const [activeSector, setActiveSector] = useState(0);

    if (initialSectors.length === 0) {
        return (
            <section className="py-20 lg:py-32 bg-cream relative overflow-hidden">
                <div className="container relative z-10 text-center px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lime/20 text-lime-dark mb-6 mx-auto">
                        <FolderOpen size={32} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-dark mb-4">
                        {`Nos Domaines d'Intervention`}
                    </h2>
                    <p className="text-text-light max-w-md mx-auto">
                        {`Les domaines d'intervention seront bientôt disponibles. Revenez très vite !`}
                    </p>
                </div>
            </section>
        );
    }

    // ✅ Mapping sécurisé qui gère le JsonValue de Prisma
    const sectors = initialSectors.map((s) => {
        let parsedStats: StatItem[] = [];
        
        if (s.stats) {
            // Cas 1 : C'est une chaîne de caractères JSON
            if (typeof s.stats === 'string') {
                try {
                    parsedStats = JSON.parse(s.stats);
                } catch {
                    parsedStats = [];
                }
            } 
            // Cas 2 : C'est déjà un tableau (Prisma l'a parfois parsé automatiquement)
            else if (Array.isArray(s.stats)) {
                parsedStats = s.stats as StatItem[];
            } 
            // Cas 3 : C'est un objet brut JsonValue
            else if (typeof s.stats === 'object') {
                parsedStats = s.stats as StatItem[];
            }
        }

        return {
            id: s.id,
            category: s.name,
            title: s.name,
            subtitle: s.subtitle || s.name,
            description: s.description || '',
            image: s.imageUrl,
            stats: parsedStats,
        };
    });

    const current = sectors[activeSector];

    return (
        <section className="py-20 lg:py-32 bg-cream relative overflow-hidden">
            <div className="container relative z-10">
                {/* Header en 2 colonnes */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 mb-12 lg:mb-16 items-end">
                    <div>
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-lime/30 text-text text-sm font-medium mb-6">
                            <div className="w-1.5 h-1.5 bg-lime rounded-full"></div>
                            {`Nos Domaines d'Intervention`}
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-dark leading-tight">
                            Là où nous <span className="text-lime-dark italic">agissons</span> chaque jour.
                        </h2>
                    </div>

                    <div className="lg:text-right">
                        <p className="text-base sm:text-lg text-text-light leading-relaxed max-w-lg lg:ml-auto">
                            {`Nous intervenons dans les domaines essentiels pour transformer durablement les conditions de vie des communautés congolaises.`}
                        </p>
                    </div>
                </div>

                {/* Onglets avec scroll premium sur mobile */}
                <div className="mb-8 -mx-4 px-4 lg:mx-0 lg:px-0">
                    <div 
                        className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {sectors.map((sector, index) => (
                            <button
                                key={sector.id}
                                onClick={() => setActiveSector(index)}
                                onMouseEnter={() => setActiveSector(index)}
                                className={`snap-center flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm border transition-all duration-300 ${
                                    activeSector === index
                                        ? 'bg-dark text-white border-dark shadow-md scale-105'
                                        : 'bg-white text-dark border-gray-200 hover:border-lime hover:text-lime-dark hover:-translate-y-0.5'
                                }`}
                            >
                                {sector.category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Affichage dynamique */}
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 min-h-[440px]">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
                        
                        {/* Image avec overlay intelligent */}
                        <div className="relative overflow-hidden min-h-[300px] lg:min-h-[440px] bg-gray-100">
                            {current.image ? (
                                <Image
                                    src={current.image}
                                    alt={current.category}
                                    fill
                                    className="object-cover transition-transform duration-700"
                                    sizes="(max-width: 1024px) 100vw, 60vw"
                                    priority={activeSector === 0}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-lime/10 text-lime-dark">
                                    <FolderOpen size={48} />
                                </div>
                            )}
                            
                            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-white pointer-events-none" />
                            <div className="lg:hidden block absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white pointer-events-none" />
                            
                            {/* Tag en haut de l'image */}
                            <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full font-semibold text-sm text-dark flex items-center gap-2 z-10 shadow-sm">
                                <div className="w-1.5 h-1.5 bg-lime rounded-full"></div>
                                {current.category}
                            </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            
                            {/* TITRE (petit, avec ligne verte) */}
                            <div className="flex items-center gap-2.5 text-sm font-semibold text-lime-dark mb-4">
                                <div className="w-6 h-0.5 bg-lime"></div>
                                {current.title}
                            </div>

                            {/* SOUS-TITRE (grand, serif) */}
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-dark leading-tight mb-4">
                                {current.subtitle}
                            </h3>

                            {/* Paragraphe de description */}
                            <p className="text-base sm:text-lg text-text-light leading-relaxed mb-8">
                                {current.description}
                            </p>

                            {/* Statistiques clés */}
                            {current.stats && current.stats.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                                    {current.stats.map((stat: StatItem, index: number) => (
                                        <div
                                            key={index}
                                            className="bg-cream p-4 rounded-xl border border-transparent transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime hover:border-lime/30"
                                        >
                                            <div className="text-xl lg:text-2xl font-bold text-dark mb-1">
                                                {stat.value}
                                            </div>
                                            <div className="text-xs text-text-light font-medium">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="pt-6 border-t border-gray-100 text-sm text-text-light italic">
                                    Statistiques détaillées à venir pour ce domaine.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}