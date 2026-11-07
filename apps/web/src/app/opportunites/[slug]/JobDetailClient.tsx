'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    ArrowLeft, MapPin, Briefcase, Calendar, Clock, Download, 
    ArrowRight, FileText
} from 'lucide-react';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

type JobData = {
    id: string;
    slug: string;
    type: string;
    status: 'valide' | 'expiree';
    title: string;
    location: string;
    contract: string;
    publishedDate: string | null;
    deadline: string;
    description: unknown; // JSON Tiptap
    pdfUrl: string | null;
    pdfName: string | null;
};

type SimilarJobData = {
    id: string;
    slug: string;
    title: string;
    type: string;
    location: string;
    contract: string;
    deadline: string;
};

interface JobDetailClientProps {
    job: JobData;
    similarJobs: SimilarJobData[];
}

export default function JobDetailClient({ job, similarJobs }: JobDetailClientProps) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const isValid = job.status === 'valide';

    // ✅ Configuration Tiptap en lecture seule pour le contenu riche
    const editor = useEditor({
        extensions: [StarterKit],
        content: (typeof job.description === 'string' ? job.description : (job.description as Record<string, unknown> | undefined)) || undefined,
        editable: false,
        immediatelyRender: false,
    });

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

    return (
        <main className="bg-white">
            {/* 1. Job Hero */}
            <section className="relative py-32 lg:py-40 bg-dark overflow-hidden">
                <div 
                    className="absolute inset-0 pointer-events-none opacity-100"
                    style={{ 
                        backgroundImage: 'linear-gradient(rgba(200, 224, 71, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 224, 71, 0.03) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }} 
                />
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-lime/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="container relative z-10">
                    <div className="max-w-4xl">
                        <Link 
                            href="/opportunites" 
                            className="inline-flex items-center gap-2.5 text-white/70 font-sans text-sm font-medium mb-8 transition-all duration-300 hover:text-lime group"
                        >
                            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                            Retour aux opportunités
                        </Link>

                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-2 bg-lime text-dark px-4 py-1.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 bg-dark rounded-full"></div>
                                {job.type}
                            </span>
                            
                            {isValid ? (
                                <span className="inline-flex items-center gap-2 bg-lime/10 border border-lime/30 text-lime px-4 py-1.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider">
                                    <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                                    Soumission valide
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                    Soumission expirée
                                </span>
            )}
                        </div>

                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.05] tracking-tight mb-8 max-w-3xl">
                            {job.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-white/70 font-sans text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-lime" />
                                {job.location}
                            </div>
                            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                            <div className="flex items-center gap-2">
                                <Briefcase size={16} className="text-lime" />
                                {job.contract}
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full ml-0 lg:ml-2">
                                <div className="flex items-center gap-1.5 text-xs">
                                    <Calendar size={13} className="text-lime" />
                                    Publié le <strong className="text-white font-semibold">{job.publishedDate}</strong>
                                </div>
                                <div className="w-px h-4 bg-white/20"></div>
                                <div className="flex items-center gap-1.5 text-xs">
                                    <Clock size={13} className="text-lime" />
                                    Limite le <strong className="text-white font-semibold">{job.deadline}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Job Layout */}
            <section ref={sectionRef} className="py-16 lg:py-24 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">
                        
                        <article className={`max-w-3xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-4 h-0.5 bg-lime"></div>
                                <span className="font-sans text-[0.7rem] font-semibold text-lime-dark uppercase tracking-[0.15em]">À propos du poste</span>
                            </div>
                            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-dark mb-6 tracking-tight">
                                Description de la mission
                            </h2>
                            
                            {/* ✅ Rendu Tiptap avec classes Tailwind Typography pour un design parfait */}
                            <div className="font-sans text-base lg:text-lg leading-relaxed text-text-light prose prose-lg max-w-none 
                                prose-headings:font-serif prose-headings:font-bold prose-headings:text-dark prose-headings:mt-8 prose-headings:mb-4
                                prose-strong:text-dark prose-strong:font-semibold
                                prose-blockquote:relative prose-blockquote:my-10 prose-blockquote:p-8 lg:prose-blockquote:p-10 prose-blockquote:bg-lime/5 prose-blockquote:border-l-4 prose-blockquote:border-lime prose-blockquote:rounded-r-2xl prose-blockquote:font-serif prose-blockquote:text-lg lg:prose-blockquote:text-xl prose-blockquote:text-dark prose-blockquote:italic
                                prose-ul:list-disc prose-ul:space-y-2 prose-ul:mb-6 prose-li:ml-4">
                                
                                {editor ? (
                                    <EditorContent editor={editor} />
                                ) : (
                                    <p className="text-text-light italic">Chargement du contenu...</p>
                                )}
                            </div>

                            <p className="font-sans text-base lg:text-lg leading-relaxed text-text-light mt-8">
                                {`Intégrer FRACARITA RDC, c'est rejoindre une équipe pluridisciplinaire engagée, présente dans `}
                                <strong className="text-dark font-semibold">8 provinces</strong>
                                {` du pays et reconnue pour la qualité de ses interventions sur le terrain. Nous offrons un environnement de travail stimulant, des moyens concrets pour agir, et la fierté de contribuer à une mission porteuse de sens.`}
                            </p>
                        </article>

                        {/* SIDEBAR */}
                        <aside className={`lg:sticky lg:top-24 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="bg-dark text-white rounded-3xl p-6 lg:p-8 relative overflow-hidden border border-white/5">
                                <div 
                                    className="absolute inset-0 pointer-events-none z-0"
                                    style={{ 
                                        backgroundImage: 'linear-gradient(rgba(200, 224, 71, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 224, 71, 0.06) 1px, transparent 1px)',
                                        backgroundSize: '30px 30px'
                                    }} 
                                />
                                <div className="absolute -top-20 -right-20 w-56 h-56 bg-lime/15 rounded-full blur-3xl pointer-events-none z-0" />

                                <div className="relative z-10">
                                    <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider mb-6">
                                        Informations clés
                                    </h3>

                                    <ul className="space-y-5 mb-8">
                                        <li className="flex items-start gap-3.5 pb-5 border-b border-white/8 group hover:translate-x-1 transition-transform duration-300">
                                            <div className="w-10 h-10 bg-lime/10 border border-lime/20 rounded-full flex items-center justify-center text-lime flex-shrink-0 transition-all duration-300 group-hover:bg-lime group-hover:text-dark group-hover:border-lime">
                                                <Clock size={18} />
                                            </div>
                                            <div className="pt-1.5">
                                                <div className="text-[0.65rem] text-white/50 uppercase tracking-wider font-medium mb-1">Date limite</div>
                                                <div className="font-sans text-sm font-medium text-white group-hover:text-lime transition-colors duration-300">
                                                    {job.deadline}
                                                </div>
                                            </div>
                                        </li>

                                        <li className="flex items-start gap-3.5 pb-5 border-b border-white/8 group hover:translate-x-1 transition-transform duration-300">
                                            <div className="w-10 h-10 bg-lime/10 border border-lime/20 rounded-full flex items-center justify-center text-lime flex-shrink-0 transition-all duration-300 group-hover:bg-lime group-hover:text-dark group-hover:border-lime">
                                                <MapPin size={18} />
                                            </div>
                                            <div className="pt-1.5">
                                                <div className="text-[0.65rem] text-white/50 uppercase tracking-wider font-medium mb-1">Localisation</div>
                                                <div className="font-sans text-sm font-medium text-white group-hover:text-lime transition-colors duration-300">
                                                    {job.location}
                                                </div>
                                            </div>
                                        </li>

                                        <li className="flex items-start gap-3.5 group hover:translate-x-1 transition-transform duration-300">
                                            <div className="w-10 h-10 bg-lime/10 border border-lime/20 rounded-full flex items-center justify-center text-lime flex-shrink-0 transition-all duration-300 group-hover:bg-lime group-hover:text-dark group-hover:border-lime">
                                                <Briefcase size={18} />
                                            </div>
                                            <div className="pt-1.5">
                                                <div className="text-[0.65rem] text-white/50 uppercase tracking-wider font-medium mb-1">Type de contrat</div>
                                                <div className="font-sans text-sm font-medium text-white group-hover:text-lime transition-colors duration-300">
                                                    {job.contract}
                                                </div>
                                            </div>
                                        </li>
                                    </ul>

                                    {isValid && job.pdfUrl ? (
                                        <a 
                                            href={job.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2.5 bg-lime text-dark py-3.5 rounded-full font-sans font-semibold text-sm transition-all duration-400 hover:bg-white hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(200,224,71,0.4)] group"
                                        >
                                            {`Télécharger l'offre`}
                                            <Download size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                                        </a>
                                    ) : (
                                        <button 
                                            disabled 
                                            className="w-full flex items-center justify-center gap-2.5 bg-gray-700 text-gray-400 py-3.5 rounded-full font-sans font-semibold text-sm cursor-not-allowed opacity-70"
                                        >
                                            {isValid ? 'Aucun PDF disponible' : 'Soumission expirée'}
                                            <Download size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </aside>

                    </div>
                </div>
            </section>

            {/* 3. Section Offres Similaires */}
            {similarJobs.length > 0 && (
                <section className="py-16 lg:py-24 bg-cream relative overflow-hidden">
                    <div className="container relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
                            <div>
                                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-lime/30 text-text text-sm font-medium mb-5">
                                    <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                                    Offres similaires
                                </div>
                                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-dark leading-tight">
                                    {`D'autres postes `}<span className="text-lime-dark italic">pourraient</span>{` vous intéresser.`}
                                </h2>
                            </div>
                            <Link href="/opportunites" className="inline-flex items-center gap-2.5 font-sans text-sm font-semibold text-dark hover:text-lime-dark transition-all duration-300 group">
                                Voir toutes les offres
                                <div className="w-9 h-9 bg-dark rounded-full flex items-center justify-center transition-all duration-400 group-hover:bg-lime group-hover:translate-x-1">
                                    <ArrowRight size={14} className="text-lime group-hover:text-dark" />
                                </div>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {similarJobs.map((simJob, index) => (
                                <Link
                                    key={simJob.id}
                                    href={`/opportunites/${simJob.slug}`}
                                    className={`group bg-white rounded-2xl p-6 border border-gray-200 hover:border-lime hover:-translate-y-1.5 transition-all duration-400 flex flex-col ${
                                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-11 h-11 bg-dark rounded-full flex items-center justify-center text-lime transition-all duration-300 group-hover:bg-lime group-hover:text-dark group-hover:-rotate-6">
                                            <FileText size={20} />
                                        </div>
                                        <span className="font-sans text-[0.65rem] font-semibold text-lime-dark uppercase tracking-wider px-2.5 py-1 bg-lime/15 rounded-full">
                                            {simJob.type}
                                        </span>
                                    </div>

                                    <h3 className="font-serif text-base font-bold text-dark leading-snug mb-4 line-clamp-2 group-hover:text-lime-dark transition-colors duration-300">
                                        {simJob.title}
                                    </h3>

                                    <div className="flex flex-col gap-1.5 mb-5">
                                        <div className="flex items-center gap-2 text-xs text-text-light">
                                            <MapPin size={13} className="text-lime-dark flex-shrink-0" />
                                            {simJob.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-text-light">
                                            <Briefcase size={13} className="text-lime-dark flex-shrink-0" />
                                            {simJob.contract}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
                                        <div className="flex items-center gap-1.5 text-xs text-text-light font-medium">
                                            <Clock size={12} />
                                            {simJob.deadline}
                                        </div>
                                        <div className="w-8 h-8 bg-cream rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-lime group-hover:translate-x-1">
                                            <ArrowRight size={13} className="text-dark" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}