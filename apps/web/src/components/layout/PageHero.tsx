'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface PageHeroProps {
    titleBefore: string;
    highlight: string;
    titleAfter: string;
    description: string;
    breadcrumbCurrent: string;
    bgImage: string;
}

export default function PageHero({ titleBefore, highlight, titleAfter, description, breadcrumbCurrent, bgImage }: PageHeroProps) {
    return (
        <section className="relative min-h-[60vh] lg:min-h-[65vh] flex items-center justify-center overflow-hidden py-32 lg:py-40">
            {/* Background Image */}
            <div className="absolute inset-0 z-10">
                <Image
                    src={bgImage}
                    alt={breadcrumbCurrent}
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-darker/90 via-dark/80 to-darker/90 z-20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(200,224,71,0.12)_0%,transparent_50%)] z-30" />
            </div>

            {/* Content (Centré) */}
            <div className="container relative z-40 text-center">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-xl border border-white/12 px-5 py-2 rounded-full text-sm text-white/80 mb-8">
                        <Link href="/" className="hover:text-lime transition-colors">
                        Accueil
                        </Link>
                        <ChevronRight size={14} className="opacity-50" />
                        <span className="text-lime font-semibold">{breadcrumbCurrent}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight text-white tracking-tight mb-6">
                        {titleBefore}{' '}
                        <span className="text-lime italic relative inline-block">
                        {highlight}
                        <span className="absolute bottom-2 left-0 w-full h-2.5 bg-lime/20 -z-10 rounded-sm" />
                        </span>{' '}
                        {titleAfter}
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-lg leading-relaxed text-white/75 max-w-2xl mx-auto font-sans">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
}