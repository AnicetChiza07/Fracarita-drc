'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, TrendingUp, Wallet, File, ArrowRight, BarChart3, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/layout/PageHero';

type ReportData = {
    id: string;
    slug: string;
    year: number;
    type: string;
    title: string;
    excerpt: string;
    fileSize: string;
    image: string | null;
    pdfUrl: string | null;
    pdfName: string | null;
};

interface RapportsClientProps {
    initialReports: ReportData[];
}

// Fonction pour mapper le type de rapport à une icône Lucide
function getIconByType(type: string) {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('financ')) return Wallet;
    if (lowerType.includes('impact') || lowerType.includes('social')) return TrendingUp;
    if (lowerType.includes('stat') || lowerType.includes('donn')) return BarChart3;
    return FileText; // Fallback par défaut
}

export default function RapportsClient({ initialReports }: RapportsClientProps) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

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

    if (initialReports.length === 0) {
        return (
            <main className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream border border-lime/30 text-lime-dark mb-6 mx-auto">
                        <FolderOpen size={32} />
                    </div>
                    <h2 className="text-2xl font-serif font-semibold text-dark mb-4">Aucun rapport disponible</h2>
                    <p className="text-text-light">{`Nos rapports d'activité seront bientôt publiés. Revenez très vite.`}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-white">
            <PageHero
                titleBefore="Nos"
                highlight="rapports"
                titleAfter="d'activité."
                description={`Découvrez en toute transparence l'utilisation de vos contributions, nos résultats sur le terrain et l'impact réel de nos actions à travers la RDC.`}
                breadcrumbCurrent="Rapports"
                bgImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80"
            />

            <section ref={sectionRef} className="py-20 lg:py-32 bg-white">
                <div className="container">
                    <div className={`mb-12 lg:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-6 h-0.5 bg-lime" />
                            <span className="font-sans text-xs font-semibold text-lime-dark uppercase tracking-[0.15em]">Publications récentes</span>
                        </div>
                        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark leading-tight">
                            Tous nos <span className="text-lime-dark italic">rapports</span>.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {initialReports.map((report, index) => {
                            const IconType = getIconByType(report.type);
                            
                            return (
                                <Link
                                    key={report.id}
                                    href={`/rapports/${report.slug}`}
                                    className={`group bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-lime hover:-translate-y-2 transition-all duration-500 flex flex-col ${
                                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative overflow-hidden aspect-[16/10] bg-gray-100">
                                        {report.image ? (
                                            <Image 
                                                src={report.image} 
                                                alt={report.title} 
                                                fill 
                                                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                priority={index < 2}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream to-white">
                                                <IconType size={40} className="text-lime/30" />
                                            </div>
                                        )}
                                        
                                        <div className="absolute top-4 left-4 bg-lime text-dark px-3.5 py-1.5 rounded-full font-sans text-xs font-bold z-10 shadow-sm">
                                            {report.year}
                                        </div>
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-dark px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold flex items-center gap-1.5 z-10 transition-all duration-300 group-hover:bg-lime group-hover:text-dark">
                                            <IconType size={12} className="transition-colors duration-300" />
                                            {report.type}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-serif text-lg font-semibold text-dark mb-2 line-clamp-2 group-hover:text-lime-dark transition-colors duration-300">
                                            {report.title}
                                        </h3>
                                        <p className="font-sans text-sm text-text-light leading-relaxed mb-6 line-clamp-2 flex-grow">
                                            {report.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
                                            <div className="flex items-center gap-1.5 text-xs text-text-light font-medium">
                                                <File size={12} />
                                                PDF · {report.fileSize}
                                            </div>
                                            
                                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-dark group-hover:text-lime-dark transition-colors duration-300">
                                                Voir en détail
                                                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}