import ArticleCardSkeleton from '@/components/skeletons/ArticleCardSkeleton';
import FeaturedArticleSkeleton from '@/components/skeletons/FeaturedArticleSkeleton';

export default function Loading() {
    return (
        <main className="bg-white">
            {/* 1. Hero skeleton */}
            <section className="relative min-h-[60vh] lg:min-h-[65vh] flex items-center justify-center overflow-hidden py-32 lg:py-40 bg-dark">
                <div className="absolute inset-0 bg-gray-800" />
                <div className="container relative z-40 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-xl border border-white/12 px-5 py-2 rounded-full mb-8 mx-auto">
                            <div className="w-16 h-3 bg-white/20 rounded" />
                            <div className="w-3 h-3 bg-white/20 rounded-full" />
                            <div className="w-20 h-3 bg-lime/30 rounded" />
                        </div>
                        <div className="w-full h-12 bg-white/20 rounded mb-4 mx-auto" />
                        <div className="w-3/4 h-12 bg-white/20 rounded mb-6 mx-auto" />
                        <div className="w-2/3 h-4 bg-white/15 rounded mb-3 mx-auto" />
                        <div className="w-1/2 h-4 bg-white/15 rounded mx-auto" />
                    </div>
                </div>
            </section>

            {/* 2. Featured article skeleton */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container">
                    <div className="mb-8">
                        <div className="w-40 h-4 bg-gray-200 rounded mb-4" />
                    </div>
                    <FeaturedArticleSkeleton />
                </div>
            </section>

            {/* 3. Articles grid skeleton */}
            <section className="py-16 lg:py-24 bg-cream">
                <div className="container">
                    <div className="mb-12">
                        <div className="w-60 h-8 bg-gray-200 rounded mb-6" />
                        <div className="flex flex-wrap gap-2 mb-6">
                            <div className="w-20 h-10 bg-white rounded-full" />
                            <div className="w-24 h-10 bg-white rounded-full" />
                            <div className="w-16 h-10 bg-white rounded-full" />
                            <div className="w-28 h-10 bg-white rounded-full" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <ArticleCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}