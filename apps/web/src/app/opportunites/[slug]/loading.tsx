export default function Loading() {
    return (
        <main className="bg-white">
            {/* 1. Hero Skeleton (Sombre) */}
            <section className="relative py-32 lg:py-40 bg-dark overflow-hidden">
                {/* Motif de grille subtil */}
                <div 
                    className="absolute inset-0 pointer-events-none opacity-100"
                    style={{ 
                        backgroundImage: 'linear-gradient(rgba(200, 224, 71, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 224, 71, 0.03) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }} 
                />
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-lime/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

                <div className="container relative z-10">
                    <div className="max-w-4xl">
                        {/* Bouton Retour */}
                        <div className="w-48 h-4 bg-white/20 rounded mb-8 animate-pulse" />

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <div className="w-32 h-7 bg-lime/30 rounded-full animate-pulse" />
                            <div className="w-36 h-7 bg-lime/10 rounded-full animate-pulse" />
                        </div>

                        {/* Titre */}
                        <div className="space-y-3 mb-8">
                            <div className="w-full h-10 bg-white/20 rounded animate-pulse" />
                            <div className="w-3/4 h-10 bg-white/20 rounded animate-pulse" />
                        </div>

                        {/* Meta Infos */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="w-28 h-5 bg-white/20 rounded animate-pulse" />
                            <div className="w-1 h-1 bg-white/30 rounded-full" />
                            <div className="w-32 h-5 bg-white/20 rounded animate-pulse" />
                            <div className="w-64 h-9 bg-white/5 border border-white/10 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Job Layout (2 Colonnes) */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">
                        
                        {/* Colonne Gauche : Contenu Principal */}
                        <article className="max-w-3xl">
                            {/* Tag & Titre de section */}
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-4 h-0.5 bg-lime/40" />
                                <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                            </div>
                            <div className="w-64 h-8 bg-gray-200 rounded mb-6 animate-pulse" />
                            
                            {/* Paragraphes de texte (Simulation Tiptap) */}
                            <div className="space-y-4 mb-10">
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-11/12 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                            </div>

                            {/* Blockquote (Citation) */}
                            <div className="my-10 p-8 lg:p-10 bg-lime/5 border-l-4 border-lime/40 rounded-r-2xl animate-pulse">
                                <div className="w-12 h-12 bg-lime/20 rounded mb-4" />
                                <div className="space-y-3">
                                    <div className="w-full h-5 bg-gray-200 rounded" />
                                    <div className="w-11/12 h-5 bg-gray-200 rounded" />
                                    <div className="w-2/3 h-5 bg-gray-200 rounded" />
                                </div>
                                <div className="w-40 h-3 bg-lime/20 rounded mt-4" />
                            </div>

                            {/* Paragraphe final */}
                            <div className="space-y-4">
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </article>

                        {/* Colonne Droite : Sidebar (Carte Sombre) */}
                        <aside className="lg:sticky lg:top-24">
                            <div className="bg-dark text-white rounded-3xl p-6 lg:p-8 relative overflow-hidden border border-white/5">
                                {/* Motif de grille sidebar */}
                                <div 
                                    className="absolute inset-0 pointer-events-none z-0"
                                    style={{ 
                                        backgroundImage: 'linear-gradient(rgba(200, 224, 71, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 224, 71, 0.06) 1px, transparent 1px)',
                                        backgroundSize: '30px 30px'
                                    }} 
                                />
                                <div className="absolute -top-20 -right-20 w-56 h-56 bg-lime/15 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />

                                <div className="relative z-10">
                                    <div className="w-32 h-4 bg-white/20 rounded mb-6 animate-pulse" />

                                    <ul className="space-y-5 mb-8">
                                        {/* Item 1 */}
                                        <li className="flex items-start gap-3.5 pb-5 border-b border-white/8">
                                            <div className="w-10 h-10 bg-lime/10 border border-lime/20 rounded-full animate-pulse" />
                                            <div className="pt-1.5 flex-1">
                                                <div className="w-20 h-2 bg-white/10 rounded mb-2" />
                                                <div className="w-24 h-4 bg-white/20 rounded animate-pulse" />
                                            </div>
                                        </li>
                                        {/* Item 2 */}
                                        <li className="flex items-start gap-3.5 pb-5 border-b border-white/8">
                                            <div className="w-10 h-10 bg-lime/10 border border-lime/20 rounded-full animate-pulse" />
                                            <div className="pt-1.5 flex-1">
                                                <div className="w-20 h-2 bg-white/10 rounded mb-2" />
                                                <div className="w-28 h-4 bg-white/20 rounded animate-pulse" />
                                            </div>
                                        </li>
                                        {/* Item 3 */}
                                        <li className="flex items-start gap-3.5">
                                            <div className="w-10 h-10 bg-lime/10 border border-lime/20 rounded-full animate-pulse" />
                                            <div className="pt-1.5 flex-1">
                                                <div className="w-20 h-2 bg-white/10 rounded mb-2" />
                                                <div className="w-32 h-4 bg-white/20 rounded animate-pulse" />
                                            </div>
                                        </li>
                                    </ul>

                                    {/* Bouton CTA */}
                                    <div className="w-full h-12 bg-lime/30 rounded-full animate-pulse" />
                                </div>
                            </div>
                        </aside>

                    </div>
                </div>
            </section>

            {/* 3. Section Offres Similaires Skeleton */}
            <section className="py-16 lg:py-24 bg-cream relative overflow-hidden">
                <div className="container relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-lime/30 mb-5">
                                <div className="w-1.5 h-1.5 bg-lime/40 rounded-full animate-pulse" />
                                <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                            </div>
                            <div className="w-64 h-8 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="w-9 h-9 bg-dark rounded-full animate-pulse" />
                        </div>
                    </div>

                    {/* Grille 3 colonnes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-11 h-11 bg-dark rounded-full animate-pulse" />
                                    <div className="w-20 h-5 bg-lime/15 rounded-full animate-pulse" />
                                </div>

                                <div className="w-full h-5 bg-gray-200 rounded mb-2 animate-pulse" />
                                <div className="w-3/4 h-5 bg-gray-200 rounded mb-4 animate-pulse" />

                                <div className="flex flex-col gap-1.5 mb-5">
                                    <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
                                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                                    <div className="w-8 h-8 bg-cream rounded-full animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}