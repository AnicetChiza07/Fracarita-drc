'use client';

import { useState, useEffect, useRef } from 'react';
import { Briefcase, MapPin, Clock, ArrowUpRight, Download, HeartHandshake, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/layout/PageHero';

type OpportunityType = "Offres d'emploi" | "Stages" | "Appels d'offre";

type OpportunityData = {
    id: string;
    slug: string;
    title: string;
    type: OpportunityType;
    status: "valide" | "expiree";
    location: string;
    contract: string;
    experience: string;
    deadline: string;
    coverImage: string | null;
    pdfUrl: string | null;
    pdfName: string | null;
    excerpt: string;
};

interface OpportunitesClientProps {
    initialOpportunities: OpportunityData[];
    initialFilters: string[];
}

export default function OpportunitesClient({ initialOpportunities, initialFilters }: OpportunitesClientProps) {
    const [activeFilter, setActiveFilter] = useState('Tous');
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const filteredOpportunities = activeFilter === 'Tous' 
        ? initialOpportunities 
        : initialOpportunities.filter(job => job.type === activeFilter);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    if (initialOpportunities.length === 0) {
        return (
            <main className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream border border-lime/30 text-lime-dark mb-6 mx-auto">
                        <Briefcase size={32} />
                    </div>
                    <h2 className="text-2xl font-serif font-semibold text-dark mb-4">Aucune opportunité pour le moment</h2>
                    <p className="text-text-light">{`Revenez très vite pour découvrir nos offres d'emploi, stages et appels d'offre.`}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-white">
            <PageHero
                titleBefore="Construisez une carrière"
                highlight="porteuse de sens"
                titleAfter="."
                description={`Rejoignez une équipe engagée au service des communautés congolaises. Mettez vos compétences au profit d'une mission qui a du sens.`}
                breadcrumbCurrent="Opportunités"
                bgImage="/images/job.jpg"
            />

            <section className="py-20 lg:py-32 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className={`${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-300`}>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-6 h-0.5 bg-lime"></div>
                                <span className="font-sans text-xs font-semibold text-lime-dark uppercase tracking-[0.15em]">Pourquoi nous rejoindre</span>
                            </div>
                            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark leading-tight mb-6">
                                Une mission qui <span className="text-lime-dark italic">dépasse</span> le travail.
                            </h2>
                            <p className="font-sans text-base leading-relaxed text-text-light mb-4">
                                Chez FRACARITA RDC, chaque collaborateur et partenaire participe à une œuvre plus grande que lui. Nous croyons que le travail prend tout son sens quand il sert les autres.
                            </p>
                            <p className="font-sans text-base leading-relaxed text-text-light">
                                {`Rejoindre notre équipe ou répondre à nos appels, c'est choisir de mettre ses compétences au service d'une cause noble, dans un environnement bienveillant et stimulant.`}
                            </p>
                        </div>

                        <div className={`relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[500px] group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 delay-200`}>
                            <Image 
                                src="/images/travail.jpg" 
                                alt="Équipe FRACARITA" 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-darker/60 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 flex items-center gap-4 z-10">
                                <div className="w-12 h-12 bg-lime rounded-full flex items-center justify-center text-dark flex-shrink-0">
                                    <HeartHandshake size={24} />
                                </div>
                                <div>
                                    <div className="font-serif text-xl font-bold text-white leading-none mb-1"><span className="text-lime">100%</span> engagé</div>
                                    <div className="text-xs text-white/70">Pour les communautés</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={sectionRef} className="py-20 lg:py-32 bg-cream relative overflow-hidden">
                <div className="container relative z-10">

                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-end mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-lime/30 text-text text-sm font-medium mb-5">
                                <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                                Opportunités disponibles
                            </div>
                            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark leading-tight">
                                Nos <span className="text-lime-dark italic">opportunités</span>.
                            </h2>
                        </div>
                        <div className="lg:text-right">
                            <p className="font-sans text-base text-text-light leading-relaxed max-w-lg lg:ml-auto">
                                {`Découvrez nos postes ouverts, nos stages et nos appels d'offre à travers la RDC.`}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-12">
                        {initialFilters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2.5 rounded-full font-sans text-sm font-medium transition-all duration-300 border ${
                                    activeFilter === filter
                                        ? 'bg-dark text-white border-dark shadow-md'
                                        : 'bg-white text-dark border-transparent hover:border-lime/50 hover:-translate-y-0.5'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {filteredOpportunities.map((job, index) => (
                            <Link
                                key={job.id}
                                href={`/opportunites/${job.slug}`}
                                className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-lime/40 hover:shadow-2xl hover:shadow-lime/10 transition-all duration-500 flex flex-col md:flex-row ${
                                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                                style={{ transitionDelay: `${index * 80}ms` }}
                            >
                                <div className="relative w-full md:w-2/5 h-56 md:h-auto min-h-[240px] md:min-h-[320px] overflow-hidden bg-gray-100 flex-shrink-0">
                                    {job.coverImage ? (
                                        <Image 
                                            src={job.coverImage} 
                                            alt={job.title} 
                                            fill 
                                            className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                            sizes="(max-width: 1024px) 100vw, 40vw"
                                            priority={index < 2}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream via-white to-lime/5">
                                            <Briefcase size={40} className="text-lime/30" />
                                        </div>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:bg-gradient-to-r" />

                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm ${
                                            job.status === 'valide' 
                                            ? 'bg-lime/95 text-dark border-lime' 
                                            : 'bg-red-500/95 text-white border-red-500'
                                        }`}>
                                            {job.status === 'valide' ? 'Active' : 'Expirée'}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full md:w-3/5 p-6 lg:p-7 flex flex-col flex-grow">
                                    <h3 className="font-serif text-xl lg:text-[1.35rem] font-bold text-dark leading-tight mb-3 line-clamp-2 group-hover:text-lime-dark transition-colors duration-300">
                                        {job.title}
                                    </h3>

                                    <p className="font-sans text-sm text-text-light leading-relaxed mb-5 line-clamp-2 min-h-[3rem]">
                                        {job.excerpt || 'Aucune description disponible pour cette opportunité.'}
                                    </p>

                                    <div className="flex flex-col gap-2.5 mb-6 pb-5 border-b border-gray-100">
                                        <div className="flex items-center gap-3 text-sm text-text-light">
                                            <div className="w-7 h-7 rounded-full bg-lime/10 flex items-center justify-center flex-shrink-0">
                                                <MapPin size={13} className="text-lime-dark" />
                                            </div>
                                            <span className="truncate">{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-text-light">
                                            <div className="w-7 h-7 rounded-full bg-lime/10 flex items-center justify-center flex-shrink-0">
                                                <Briefcase size={13} className="text-lime-dark" />
                                            </div>
                                            <span className="truncate">{job.contract}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-text-light">
                                            <div className="w-7 h-7 rounded-full bg-lime/10 flex items-center justify-center flex-shrink-0">
                                                <Clock size={13} className="text-lime-dark" />
                                            </div>
                                            <span>Clôture : <span className="font-semibold text-dark">{job.deadline}</span></span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between gap-3">
                                        <span className="text-sm font-semibold text-dark group-hover:text-lime-dark transition-colors flex items-center gap-2">
                                            Voir les détails
                                            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </span>

                                        {job.pdfUrl && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    window.open(job.pdfUrl!, '_blank', 'noopener,noreferrer');
                                                }}
                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-cream text-dark hover:bg-lime hover:text-dark transition-all duration-300"
                                                title={`Télécharger : ${job.pdfName || 'PDF'}`}
                                            >
                                                <Download size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredOpportunities.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 mt-8">
                            <FileText size={40} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-text-light font-sans">Aucune opportunité trouvée dans cette catégorie.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}