'use client';

import { Download, Calendar, FileText, ArrowRight, HardDrive, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type ReportData = {
    id: string;
    slug: string;
    year: number;
    type: string;
    title: string;
    fileSize: string;
    date: string;
    coverImage: string | null;
    description: string;
    pdfUrl: string | null;
    pdfName: string;
};

type OtherReportData = {
    id: string;
    slug: string;
    year: number;
    type: string;
    title: string;
    fileSize: string;
    image: string | null;
};

interface ReportDetailClientProps {
    report: ReportData;
    otherReports: OtherReportData[];
}

export default function ReportDetailClient({ report, otherReports }: ReportDetailClientProps) {
    const handleDownload = () => {
        if (report.pdfUrl) {
            window.open(report.pdfUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <main className="bg-white">
            {/* 1. Hero */}
            <section className="relative min-h-[65vh] lg:min-h-[75vh] flex items-end overflow-hidden pb-16 lg:pb-24">
                <div className="absolute inset-0 z-10">
                    {report.coverImage ? (
                        <Image
                            src={report.coverImage}
                            alt={report.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-dark flex items-center justify-center">
                            <FileText size={64} className="text-lime/50" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/95 z-20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(200,224,71,0.15)_0%,transparent_50%)] z-30" />
                </div>

                <div className="container relative z-40">
                    <div className="max-w-4xl text-white">
                        <div className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-xl border border-white/12 px-5 py-2 rounded-full text-sm text-white/80 mb-8">
                            <Link href="/" className="hover:text-lime transition-colors">Accueil</Link>
                            <span className="opacity-50">/</span>
                            <Link href="/rapports" className="hover:text-lime transition-colors">Rapports</Link>
                            <span className="opacity-50">/</span>
                            <span className="text-lime font-semibold line-clamp-1">{report.type}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="inline-flex items-center gap-2 bg-lime text-dark px-4 py-1.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 bg-dark rounded-full"></div>
                                {report.type}
                            </span>
                            <span className="flex items-center gap-2 text-white/70 font-sans text-sm">
                                <Calendar size={16} className="text-lime" />
                                {report.date}
                            </span>
                            <span className="flex items-center gap-2 text-white/70 font-sans text-sm">
                                <FileText size={16} className="text-lime" />
                                PDF · {report.fileSize}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight tracking-tight">
                            {report.title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* 2. Description à gauche + Autres rapports à droite */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16">
                        
                        {/* Gauche : Description */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="w-6 h-0.5 bg-lime" />
                                <span className="font-sans text-xs font-semibold text-lime-dark uppercase tracking-[0.15em]">Description du rapport</span>
                            </div>

                            <div className="prose prose-lg text-text-light font-sans leading-relaxed mb-8 max-w-none">
                                {report.description.split('\n\n').map((paragraph, i) => (
                                    <p key={i} className="mb-4">{paragraph}</p>
                                ))}
                            </div>

                            {report.pdfUrl ? (
                                <button 
                                    onClick={handleDownload}
                                    className="inline-flex items-center justify-center gap-3 bg-dark text-white pl-6 pr-2 py-3 rounded-full font-sans font-semibold text-sm border-none cursor-pointer transition-all duration-300 hover:bg-lime hover:text-dark hover:-translate-y-1 group w-full sm:w-auto mb-5"
                                >
                                    Télécharger le rapport
                                    <span className="bg-lime text-dark w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-dark group-hover:text-lime transition-all duration-300">
                                        <Download size={16} />
                                    </span>
                                </button>
                            ) : (
                                <div className="inline-flex items-center justify-center gap-3 bg-gray-100 text-gray-500 pl-6 pr-2 py-3 rounded-full font-sans font-semibold text-sm w-full sm:w-auto mb-5 cursor-not-allowed">
                                    Document bientôt disponible
                                    <span className="bg-gray-200 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center">
                                        <Download size={16} />
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-5 border-t border-black/5">
                                <div className="flex items-center gap-2 text-sm text-text-light font-medium">
                                    <FileText size={16} className="text-lime-dark" />
                                    Format PDF
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text-light font-medium">
                                    <HardDrive size={16} className="text-lime-dark" />
                                    Taille : {report.fileSize}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text-light font-medium">
                                    <ShieldCheck size={16} className="text-lime-dark" />
                                    Vérifié par le comité
                                </div>
                            </div>
                        </div>

                        {/* Droite : Autres rapports */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="w-6 h-0.5 bg-lime" />
                                <span className="font-sans text-xs font-semibold text-lime-dark uppercase tracking-[0.15em]">Autres rapports</span>
                            </div>

                            <div className="space-y-4">
                                {otherReports.map((otherReport) => (
                                    <Link
                                        key={otherReport.id}
                                        href={`/rapports/${otherReport.slug}`}
                                        className="group flex gap-4 p-4 bg-cream rounded-2xl border border-transparent hover:border-lime hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                                            {otherReport.image ? (
                                                <Image
                                                    src={otherReport.image}
                                                    alt={otherReport.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    sizes="80px"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <FileText size={24} className="text-lime/40" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center flex-grow">
                                            <div className="font-sans text-xs text-text-light mb-1">{otherReport.year} · {otherReport.type}</div>
                                            <h4 className="font-serif text-sm font-semibold text-dark line-clamp-2 group-hover:text-lime-dark transition-colors duration-300">
                                                {otherReport.title}
                                            </h4>
                                            <div className="font-sans text-xs text-text-light mt-1">PDF · {otherReport.fileSize}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CTA en bas */}
            <section className="py-20 lg:py-32 bg-cream relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-lime/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-lime/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="container relative z-10 text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-lime/30 text-text text-sm font-medium mb-6">
                        <div className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse"></div>
                        Rejoignez-nous
                    </div>

                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-dark leading-tight mb-5">
                        Ensemble, construisons un <span className="text-lime-dark italic">avenir meilleur</span>.
                    </h2>

                    <p className="font-sans text-base lg:text-lg text-text-light leading-relaxed mb-10 max-w-2xl mx-auto">
                        Que vous souhaitiez devenir bénévole, faire un don ou simplement en savoir plus sur nos actions, chaque geste compte et transforme des vies en RDC.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 bg-dark text-white pl-6 pr-2 py-3 rounded-full font-sans font-semibold text-sm border-none cursor-pointer transition-all duration-300 hover:bg-lime hover:text-dark hover:-translate-y-1 group"
                        >
                            Nous contacter
                            <span className="bg-lime text-dark w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-dark group-hover:text-lime transition-all duration-300">
                                <ArrowRight size={16} />
                            </span>
                        </Link>

                        <Link
                            href="/a-propos"
                            className="inline-flex items-center justify-center gap-2 bg-white text-dark pl-6 pr-2 py-3 rounded-full font-sans font-semibold text-sm border border-gray-200 cursor-pointer transition-all duration-300 hover:bg-lime hover:border-lime hover:-translate-y-1 group"
                        >
                            En savoir plus
                            <span className="bg-dark text-lime w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-lime group-hover:text-dark transition-all duration-300">
                                <ArrowRight size={16} />
                            </span>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}