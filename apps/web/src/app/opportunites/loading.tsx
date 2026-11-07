import JobCardSkeleton from '@/components/skeletons/JobCardSkeleton';

export default function Loading() {
    return (
        <main className="bg-white">
            {/* 1. Hero skeleton */}
            <section className="relative min-h-[60vh] lg:min-h-[65vh] flex items-center justify-center overflow-hidden py-32 lg:py-40 bg-dark">
                <div className="absolute inset-0 bg-gray-800" />
                <div className="container relative z-40 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-xl border border-white/12 px-5 py-2 rounded-full mb-8">
                            <div className="w-16 h-3 bg-white/20 rounded" />
                            <div className="w-3 h-3 bg-white/20 rounded-full" />
                            <div className="w-20 h-3 bg-lime/30 rounded" />
                        </div>
                        <div className="w-full h-12 bg-white/20 rounded mb-4" />
                        <div className="w-3/4 h-12 bg-white/20 rounded mb-6 mx-auto" />
                        <div className="w-2/3 h-4 bg-white/15 rounded mb-3 mx-auto" />
                        <div className="w-1/2 h-4 bg-white/15 rounded mx-auto" />
                    </div>
                </div>
            </section>

            {/* 2. Jobs skeleton */}
            <section className="py-20 lg:py-32 bg-cream">
                <div className="container">
                    {/* Filtres + Titre */}
                    <div className="mb-12">
                        {/* Filtres en haut */}
                        <div className="flex flex-wrap gap-2 mb-10">
                            <div className="w-20 h-10 bg-white rounded-full" />
                            <div className="w-32 h-10 bg-white rounded-full" />
                            <div className="w-24 h-10 bg-white rounded-full" />
                            <div className="w-28 h-10 bg-white rounded-full" />
                        </div>

                        {/* Titre + Description */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-end">
                            <div>
                                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-lime/30 mb-5">
                                    <div className="w-3 h-3 bg-lime/30 rounded-full" />
                                    <div className="w-32 h-4 bg-gray-200 rounded" />
                                </div>
                                <div className="w-60 h-8 bg-gray-200 rounded" />
                            </div>
                            <div className="lg:text-right">
                                <div className="w-full h-4 bg-gray-200 rounded lg:ml-auto" />
                            </div>
                        </div>
                    </div>

                    {/* ✅ Grille 2 colonnes (comme le design final) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <JobCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}