'use client';

import Image from 'next/image';
import { Handshake } from 'lucide-react';

type DbPartner = {
    id: string;
    logoUrl: string | null;
    order: number;
};

interface PartnersProps {
    initialPartners?: DbPartner[]; // ✅ Rendu optionnel avec '?'
}

// ✅ Valeur par défaut = [] si rien n'est passé
export default function Partners({ initialPartners = [] }: PartnersProps) {
    
    // 🛡️ Vérification de sécurité : si c'est null, undefined ou vide
    if (!initialPartners || initialPartners.length === 0) {
        return (
            <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
                <div className="container relative z-10 text-center px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream border border-lime/30 text-lime-dark mb-6 mx-auto">
                        <Handshake size={32} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-dark mb-4">
                        Nos Partenaires
                    </h2>
                    <p className="text-text-light max-w-md mx-auto">
                        La liste de nos partenaires sera bientôt disponible. Revenez très vite !
                    </p>
                </div>
            </section>
        );
    }

    // ✅ MAPPING DES DONNÉES
    const partners = initialPartners.map((p) => ({
        id: p.id,
        name: 'Partenaire',
        logo: p.logoUrl || '/logos/placeholder.png',
    }));

    // On duplique la liste pour créer l'effet de boucle infinie (Marquee)
    const duplicatedPartners = [...partners, ...partners];

    return (
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
            {/* Ligne décorative en haut */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-lime/30" />

            <div className="container relative z-10">
                {/* Header en 2 colonnes */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-end mb-12 lg:mb-16">
                    {/* Gauche : Tag + Titre */}
                    <div>
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cream border border-lime/30 text-text text-sm font-medium mb-5">
                            <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                            Ils nous font confiance
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-dark leading-tight">
                            Nos <span className="text-lime-dark italic">partenaires</span>.
                        </h2>
                    </div>

                    {/* Droite : Description */}
                    <div className="lg:text-right">
                        <p className="text-base sm:text-lg text-text-light leading-relaxed max-w-lg lg:ml-auto">
                            {`Ensemble avec des organisations locales et internationales, nous amplifions notre impact pour transformer durablement les conditions de vie des communautés congolaises à travers la RDC.`}
                        </p>
                    </div>
                </div>

                {/* Marquee des logos */}
                <div className="relative overflow-hidden py-5">
                    {/* Fondu à gauche */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 lg:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    {/* Fondu à droite */}
                    <div className="absolute right-0 top-0 bottom-0 w-24 lg:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                    {/* Track animée */}
                    <div className="flex gap-12 lg:gap-8 w-max animate-marquee hover:[animation-play-state:paused]">
                        {duplicatedPartners.map((partner, index) => (
                            <div
                                key={`${partner.id}-${index}`}
                                className="flex-shrink-0 w-40 h-20 flex items-center justify-center px-4"
                            >
                                <Image
                                    src={partner.logo}
                                    alt={`Logo Partenaire`}
                                    width={140}
                                    height={48}
                                    className="h-12 w-auto max-w-[140px] object-contain transition-all duration-300 hover:scale-110 hover:opacity-90 cursor-pointer hover:grayscale-0"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}