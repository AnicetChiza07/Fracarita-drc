'use client';

import { Award, HeartHandshake, Target, Eye, Heart, Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
    return (
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
                    
                    {/* Left Side : Grille Bento */}
                    <div>
                        <div className="w-full max-w-[480px] aspect-[1/1.1] grid grid-cols-[1.3fr_1fr] grid-rows-2 gap-4 mx-auto lg:mx-0">
                            
                            {/* Image Principale (span 2 rows) */}
                            <div className="row-span-2 rounded-3xl overflow-hidden relative bg-cream group">
                                <Image
                                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"
                                    alt="Équipe Fracarita"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent" />
                            </div>

                            {/* Carte Lime (Expérience) */}
                            <div className="bg-gradient-to-br from-lime to-lime-dark rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all duration-300 hover:bg-white hover:-translate-y-1">
                                <div className="absolute -top-8 -right-8 w-20 h-20 bg-white/15 rounded-full" />
                                <div className="w-11 h-11 bg-dark/15 rounded-xl flex items-center justify-center text-dark mb-3 group-hover:bg-lime group-hover:text-dark transition-all duration-300">
                                    <Award size={22} />
                                </div>
                                <div>
                                    <div className="font-serif text-3xl font-bold text-dark leading-none mb-1">10+</div>
                                    <div className="text-xs text-dark/80 font-medium">
                                        {`Années d'expérience`}
                                    </div>
                                </div>
                            </div>

                            {/* Carte Cream (Impact) */}
                            <div className="bg-cream rounded-2xl overflow-hidden relative flex flex-col group cursor-pointer transition-all duration-300 hover:bg-lime hover:-translate-y-1">
                                <div className="flex-1 relative overflow-hidden">
                                    <Image
                                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80"
                                        alt="Action terrain"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center text-dark flex-shrink-0 group-hover:bg-dark group-hover:text-lime transition-all duration-300">
                                        <HeartHandshake size={16} />
                                    </div>
                                    <div className="font-serif text-sm font-semibold text-dark leading-tight group-hover:text-dark transition-all">
                                        Impact réel
                                        <span className="block font-sans text-xs text-text-light font-normal mt-0.5 group-hover:text-dark/70 transition-all">
                                            Sur le terrain
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Side : Contenu textuel */}
                    <div className="relative">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cream border border-lime/30 text-text text-sm font-medium mb-6">
                            <div className="w-1.5 h-1.5 bg-lime rounded-full"></div>
                            À Propos de Nous
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-dark leading-tight mb-6">
                            <span className="text-lime-dark relative inline-block">
                                Fraternité
                                <span className="absolute bottom-1 left-0 w-full h-2 bg-lime/30 -z-10 rounded-sm" />
                            </span>{' '}
                            au service des communautés.
                        </h2>

                        <p className="text-base sm:text-lg text-text-light leading-relaxed mb-8 max-w-lg">
                            {`FRACARITA RDC accompagne les familles vulnérables de la RDC vers un avenir plus digne. À travers l'éducation, la santé et l'autonomisation, nous bâtissons une société plus juste.`}
                        </p>

                        {/* Grille des fonctionnalités */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                            <div className="flex items-start gap-3 p-3.5 bg-cream rounded-xl transition-all duration-300 hover:bg-white hover:-translate-y-0.5">
                                <div className="w-7 h-7 bg-lime rounded-lg flex items-center justify-center text-dark flex-shrink-0">
                                    <Target size={14} />
                                </div>
                                <div>
                                    <h4 className="font-serif text-sm font-semibold text-dark mb-0.5">Notre Mission</h4>
                                    <p className="text-xs text-text-light leading-tight">
                                        {`Accompagner vers l'autonomie`}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3 p-3.5 bg-cream rounded-xl transition-all duration-300 hover:bg-white hover:-translate-y-0.5">
                                <div className="w-7 h-7 bg-lime rounded-lg flex items-center justify-center text-dark flex-shrink-0">
                                    <Eye size={14} />
                                </div>
                                <div>
                                    <h4 className="font-serif text-sm font-semibold text-dark mb-0.5">Notre Vision</h4>
                                    <p className="text-xs text-text-light leading-tight">Une RDC prospère et solidaire</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3.5 bg-cream rounded-xl transition-all duration-300 hover:bg-white hover:-translate-y-0.5">
                                <div className="w-7 h-7 bg-lime rounded-lg flex items-center justify-center text-dark flex-shrink-0">
                                    <Heart size={14} />
                                </div>
                                <div>
                                    <h4 className="font-serif text-sm font-semibold text-dark mb-0.5">Nos Valeurs</h4>
                                    <p className="text-xs text-text-light leading-tight">Charité, transparence, impact</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3.5 bg-cream rounded-xl transition-all duration-300 hover:bg-white hover:-translate-y-0.5">
                                <div className="w-7 h-7 bg-lime rounded-lg flex items-center justify-center text-dark flex-shrink-0">
                                    <Users size={14} />
                                </div>
                                <div>
                                    <h4 className="font-serif text-sm font-semibold text-dark mb-0.5">Notre Équipe</h4>
                                    <p className="text-xs text-text-light leading-tight">200+ bénévoles engagés</p>
                                </div>
                            </div>
                        </div>

                        {/* Bouton d'action */}
                        <div>
                            <Link
                                href="/a-propos"
                                className="inline-flex items-center gap-2 bg-dark text-white pl-5 pr-1.5 py-2 rounded-full font-semibold text-sm sm:text-base border-none cursor-pointer transition-all duration-300 hover:bg-lime-dark hover:text-dark group"
                            >
                                En savoir plus
                                <span className="w-8 h-8 bg-lime rounded-full flex items-center justify-center group-hover:bg-dark transition-all duration-300">
                                    <ArrowRight size={14} className="text-dark group-hover:text-lime transition-colors duration-300" />
                                </span>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}