import Skeleton from '@/components/ui/Skeleton';

/**
 * Skeleton du Hero - Reproduit fidèlement la structure
 * du haut des pages pour une transition fluide au chargement.
 * 
 * @example
 * <HeroSkeleton />
 */
export default function HeroSkeleton() {
    return (
        <section className="relative min-h-[60vh] lg:min-h-[65vh] flex items-center justify-center overflow-hidden py-32 lg:py-40 bg-dark">
            {/* Background skeleton */}
            <Skeleton width="100%" height="100%" rounded="none" className="absolute inset-0" />

            {/* Content (centré) */}
            <div className="container relative z-40 text-center">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-xl border border-white/12 px-5 py-2 rounded-full text-sm text-white/80 mb-8">
                        <Skeleton width="60px" height="14px" rounded="md" className="bg-white/20" />
                        <Skeleton width="14px" height="14px" rounded="full" className="bg-white/20" />
                        <Skeleton width="80px" height="14px" rounded="md" className="bg-lime/30" />
                    </div>

                    {/* Title (3 lignes) */}
                    <Skeleton width="100%" height="48px" rounded="md" className="mb-4 bg-white/20" />
                    <Skeleton width="90%" height="48px" rounded="md" className="mb-4 bg-white/20" />
                    <Skeleton width="70%" height="48px" rounded="md" className="mb-6 bg-white/20" />

                    {/* Description (2 lignes) */}
                    <Skeleton width="80%" height="18px" rounded="md" className="mb-3 bg-white/15 mx-auto" />
                    <Skeleton width="60%" height="18px" rounded="md" className="bg-white/15 mx-auto" />
                </div>
            </div>
        </section>
    );
}