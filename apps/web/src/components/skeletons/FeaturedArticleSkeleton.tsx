import Skeleton from '@/components/ui/Skeleton';

/**
 * Skeleton de l'article "À la une" - Reproduit fidèlement la structure
 * de la grande carte horizontale pour une transition fluide au chargement.
 * 
 * @example
 * <FeaturedArticleSkeleton />
 */
export default function FeaturedArticleSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] bg-cream rounded-3xl overflow-hidden border border-transparent">
            {/* Image */}
            <div className="relative overflow-hidden min-h-[360px] lg:min-h-[480px]">
                <Skeleton width="100%" height="100%" rounded="none" />
                
                {/* Badge "À la une" */}
                <div className="absolute top-6 left-6">
                    <Skeleton width="100px" height="32px" rounded="full" />
                </div>
            </div>

            {/* Contenu */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
                {/* Meta : Catégorie + Date */}
                <div className="flex items-center gap-4 mb-5 flex-wrap">
                    <Skeleton width="80px" height="16px" rounded="md" />
                    <Skeleton width="120px" height="16px" rounded="md" />
                </div>

                {/* Titre (3 lignes) */}
                <Skeleton width="100%" height="28px" rounded="md" className="mb-3" />
                <Skeleton width="95%" height="28px" rounded="md" className="mb-3" />
                <Skeleton width="80%" height="28px" rounded="md" className="mb-4" />

                {/* Extrait (3 lignes) */}
                <Skeleton width="100%" height="16px" rounded="md" className="mb-2" />
                <Skeleton width="95%" height="16px" rounded="md" className="mb-2" />
                <Skeleton width="85%" height="16px" rounded="md" className="mb-8" />

                {/* Footer : Avatar + auteur + bouton */}
                <div className="flex items-center justify-between pt-6 border-t border-black/8">
                    <div className="flex items-center gap-3">
                        <Skeleton width="44px" height="44px" rounded="full" />
                        <div>
                            <Skeleton width="140px" height="14px" rounded="md" className="mb-2" />
                            <Skeleton width="100px" height="12px" rounded="md" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Skeleton width="100px" height="16px" rounded="md" />
                        <Skeleton width="40px" height="40px" rounded="full" />
                    </div>
                </div>
            </div>
        </div>
    );
}