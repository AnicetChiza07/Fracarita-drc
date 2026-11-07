'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="fixed inset-0 z-[9999] bg-cream flex items-center justify-center overflow-hidden">
        
            {/* Éléments décoratifs contenus */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-lime/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-lime/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 text-center px-4 py-16 max-w-3xl w-full">
            
                    {/* Grand chiffre 404 */}
                    <div className="mb-6 select-none">
                        <span className="font-serif text-[7rem] sm:text-[9rem] lg:text-[11rem] font-bold text-dark leading-none tracking-tighter">
                            4<span className="text-lime">0</span>4
                        </span>
                    </div>

                    {/* Titre */}
                    <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-4">
                        Oups ! Page introuvable.
                    </h1>
            
                    {/* Description */}
                    <p className="font-sans text-sm sm:text-base text-text-light max-w-xl mx-auto mb-10 leading-relaxed">
                        La page que vous recherchez n&apos;existe pas ou a été déplacée. 
                        Pas de panique, vous pouvez facilement retourner à l&apos;accueil pour reprendre votre navigation.
                    </p>

                    {/* Bouton unique : Retour à l'accueil */}
                    <Link 
                        href="/"
                        className="inline-flex items-center justify-center gap-3 bg-dark text-white px-8 py-3.5 rounded-full font-sans font-semibold text-sm border-none cursor-pointer transition-all duration-300 hover:bg-lime hover:text-dark hover:-translate-y-1 group w-full sm:w-auto"
                    >
                        <Home size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                        Retour à l&apos;accueil
                    </Link>

                </div>
        </main>
    );
}