export default function Loading() {
    return (
        <main className="bg-white">
            {/* Barre de progression animée */}
            <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-lime to-lime-dark z-[999] w-1/3 animate-pulse" />

            {/* 1. Hero Skeleton */}
            <section className="relative min-h-[65vh] lg:min-h-[75vh] flex items-end overflow-hidden pb-16 lg:pb-24 bg-dark">
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/95 z-20" />

                <div className="container relative z-40">
                    <div className="max-w-4xl text-white">
                        {/* Breadcrumb */}
                        <div className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-xl border border-white/12 px-5 py-2 rounded-full mb-8">
                            <div className="w-12 h-3 bg-white/20 rounded" />
                            <div className="w-3 h-3 bg-white/20 rounded-full" />
                            <div className="w-16 h-3 bg-white/20 rounded" />
                            <div className="w-3 h-3 bg-white/20 rounded-full" />
                            <div className="w-20 h-3 bg-lime/30 rounded" />
                        </div>

                        {/* Meta (catégorie + date) */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="w-24 h-7 bg-lime/30 rounded-full" />
                            <div className="w-32 h-5 bg-white/20 rounded" />
                            <div className="w-28 h-5 bg-white/20 rounded" />
                        </div>

                        {/* Titre */}
                        <div className="space-y-3">
                            <div className="w-full h-10 bg-white/20 rounded" />
                            <div className="w-3/4 h-10 bg-white/20 rounded" />
                            <div className="w-1/2 h-10 bg-white/20 rounded" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Layout 2 colonnes : Contenu + Sidebar */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
                        
                        {/* Contenu principal */}
                        <article className="max-w-3xl space-y-6">
                            {/* Paragraphe d'intro */}
                            <div className="space-y-3">
                                <div className="w-full h-4 bg-gray-200 rounded" />
                                <div className="w-full h-4 bg-gray-200 rounded" />
                                <div className="w-5/6 h-4 bg-gray-200 rounded" />
                                <div className="w-4/6 h-4 bg-gray-200 rounded" />
                            </div>

                            {/* Titre de section */}
                            <div className="flex items-center gap-4 mt-10">
                                <div className="w-1 h-8 bg-lime/40 rounded" />
                                <div className="w-48 h-8 bg-gray-200 rounded" />
                            </div>

                            {/* Paragraphes */}
                            <div className="space-y-3">
                                <div className="w-full h-4 bg-gray-200 rounded" />
                                <div className="w-full h-4 bg-gray-200 rounded" />
                                <div className="w-11/12 h-4 bg-gray-200 rounded" />
                                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                            </div>

                            {/* Image placeholder */}
                            <div className="my-10 rounded-2xl overflow-hidden">
                                <div className="aspect-video bg-gray-200 animate-pulse" />
                                <div className="flex items-center gap-3 p-4 bg-cream">
                                    <div className="w-5 h-0.5 bg-lime/40" />
                                    <div className="w-64 h-3 bg-gray-200 rounded" />
                                </div>
                            </div>

                            {/* Citation */}
                            <div className="my-10 p-8 lg:p-10 bg-lime/5 border-l-4 border-lime/30 rounded-r-2xl">
                                <div className="w-12 h-12 bg-lime/20 rounded mb-4" />
                                <div className="space-y-3">
                                    <div className="w-full h-5 bg-gray-200 rounded" />
                                    <div className="w-11/12 h-5 bg-gray-200 rounded" />
                                    <div className="w-2/3 h-5 bg-gray-200 rounded" />
                                </div>
                                <div className="w-40 h-3 bg-lime/20 rounded mt-4" />
                            </div>

                            {/* Liste à puces */}
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-lime/40 rounded-full mt-2.5 flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="w-1/3 h-4 bg-gray-200 rounded" />
                                            <div className="w-full h-4 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats block */}
                            <div className="my-10 p-8 bg-dark rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="text-center">
                                        <div className="w-20 h-10 bg-lime/20 rounded mx-auto mb-2" />
                                        <div className="w-24 h-3 bg-white/20 rounded mx-auto" />
                                    </div>
                                ))}
                            </div>
                        </article>

                        {/* Sidebar sticky */}
                        <aside className="hidden lg:flex flex-col gap-10 sticky top-24">
                            {/* Partager */}
                            <div>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-4 h-0.5 bg-lime/40" />
                                    <div className="w-16 h-3 bg-gray-200 rounded" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 bg-cream rounded-full" />
                                    ))}
                                </div>
                            </div>

                            {/* Auteur */}
                            <div>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-4 h-0.5 bg-lime/40" />
                                    <div className="w-16 h-3 bg-gray-200 rounded" />
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-cream rounded-xl">
                                    <div className="w-12 h-12 rounded-full bg-lime/20 flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="w-24 h-3 bg-gray-200 rounded" />
                                        <div className="w-16 h-3 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* 3. Articles similaires skeleton */}
            <section className="py-16 lg:py-24 bg-cream relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-lime/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="container relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-lime/30 mb-5">
                                <div className="w-1.5 h-1.5 bg-lime/40 rounded-full" />
                                <div className="w-20 h-3 bg-gray-200 rounded" />
                            </div>
                            <div className="w-48 h-8 bg-gray-200 rounded" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-28 h-4 bg-gray-200 rounded" />
                            <div className="w-10 h-10 bg-dark rounded-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-black/5 flex flex-col">
                                <div className="relative aspect-[16/10] bg-gray-200 animate-pulse">
                                    <div className="absolute top-4 right-4 w-20 h-6 bg-white rounded-full" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-3.5 h-0.5 bg-lime/40" />
                                        <div className="w-24 h-3 bg-gray-200 rounded" />
                                    </div>
                                    <div className="w-full h-5 bg-gray-200 rounded mb-2" />
                                    <div className="w-3/4 h-5 bg-gray-200 rounded mb-6" />
                                    <div className="w-full h-3 bg-gray-200 rounded mb-2" />
                                    <div className="w-5/6 h-3 bg-gray-200 rounded mb-6" />
                                    <div className="flex items-center justify-between pt-4 border-t border-black/6 mt-auto">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-cream" />
                                            <div className="w-20 h-3 bg-gray-200 rounded" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-cream" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}