import ReportCardSkeleton from '@/components/skeletons/ReportCardSkeleton';

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

            {/* 2. Reports grid skeleton */}
            <section className="py-20 lg:py-32 bg-white">
                <div className="container">
                    <div className="mb-12 lg:mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-0.5 bg-lime/40 rounded animate-pulse" />
                            <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="w-60 h-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <ReportCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}