export default function Loading() {
    return (
        <main className="bg-white">
            {/* 1. Hero Skeleton (Sombre) */}
            <section className="relative min-h-[65vh] lg:min-h-[75vh] flex items-end overflow-hidden pb-16 lg:pb-24 bg-dark">
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/95 z-20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(200,224,71,0.15)_0%,transparent_50%)] z-30" />

                <div className="container relative z-40">
                    <div className="max-w-4xl text-white">
                        {/* Breadcrumb */}
                        <div className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-xl border border-white/12 px-5 py-2 rounded-full mb-8">
                            <div className="w-12 h-3 bg-white/20 rounded animate-pulse" />
                            <span className="opacity-50">/</span>
                            <div className="w-16 h-3 bg-white/20 rounded animate-pulse" />
                            <span className="opacity-50">/</span>
                            <div className="w-20 h-3 bg-lime/30 rounded animate-pulse" />
                        </div>

                        {/* Badges & Meta */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="w-28 h-7 bg-lime/30 rounded-full animate-pulse" />
                            <div className="w-32 h-5 bg-white/20 rounded animate-pulse" />
                            <div className="w-24 h-5 bg-white/20 rounded animate-pulse" />
                        </div>

                        {/* Titre */}
                        <div className="space-y-3">
                            <div className="w-full h-10 bg-white/20 rounded animate-pulse" />
                            <div className="w-3/4 h-10 bg-white/20 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Main Content (2 Colonnes) */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16">
                        
                        {/* Colonne Gauche : Description */}
                        <div>
                            {/* Tag */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-6 h-0.5 bg-lime/40" />
                                <div className="w-40 h-3 bg-gray-200 rounded animate-pulse" />
                            </div>

                            {/* Paragraphes (Simulation de texte) */}
                            <div className="space-y-4 mb-8">
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-11/12 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                            </div>

                            {/* Bouton Télécharger */}
                            <div className="w-full sm:w-64 h-12 bg-gray-200 rounded-full animate-pulse mb-5" />

                            {/* Métadonnées footer */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-5 border-t border-black/5">
                                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-28 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>

                        {/* Colonne Droite : Autres rapports */}
                        <div>
                            {/* Tag */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-6 h-0.5 bg-lime/40" />
                                <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
                            </div>

                            {/* Liste des 3 autres rapports */}
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-cream rounded-2xl border border-transparent">
                                        {/* Image placeholder */}
                                        <div className="relative w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0 animate-pulse" />
                                        
                                        {/* Contenu texte */}
                                        <div className="flex flex-col justify-center flex-grow space-y-2 py-1">
                                            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                                            <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                                            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                                            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse mt-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CTA en bas Skeleton */}
            <section className="py-20 lg:py-32 bg-cream relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-lime/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-lime/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

                <div className="container relative z-10 text-center max-w-3xl">
                    {/* Tag */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-lime/30 mb-6 mx-auto">
                        <div className="w-1.5 h-1.5 bg-lime/40 rounded-full animate-pulse" />
                        <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>

                    {/* Titre */}
                    <div className="space-y-3 mb-5 mx-auto max-w-lg">
                        <div className="w-full h-8 bg-gray-200 rounded animate-pulse" />
                        <div className="w-2/3 h-8 bg-gray-200 rounded animate-pulse mx-auto" />
                    </div>

                    {/* Paragraphe */}
                    <div className="space-y-3 mb-10 mx-auto max-w-2xl">
                        <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="w-11/12 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
                        <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
                    </div>

                    {/* Boutons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <div className="w-48 h-12 bg-gray-200 rounded-full animate-pulse" />
                        <div className="w-40 h-12 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>
            </section>
        </main>
    );
}