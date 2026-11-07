import Skeleton from '@/components/ui/Skeleton';

/**
 * Skeleton de la carte d'article - Reproduit fidèlement la structure
 * de la vraie carte d'article pour une transition fluide au chargement.
 * 
 * @example
 * // Une seule carte
 * <ArticleCardSkeleton />
 * 
 * @example
 * // Une grille de 6 cartes
 * <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 *   {Array.from({ length: 6 }).map((_, i) => (
 *     <ArticleCardSkeleton key={i} />
 *   ))}
 * </div>
 */
export default function ArticleCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 flex flex-col">
            {/* Image (aspect 16/10) */}
            <div className="relative aspect-[16/10]">
                <Skeleton width="100%" height="100%" rounded="none" />
                
                {/* Badge numéro (en haut à gauche) */}
                <div className="absolute top-4 left-4">
                    <Skeleton width="40px" height="24px" rounded="full" />
                </div>
                
                {/* Badge catégorie (en haut à droite) */}
                <div className="absolute top-4 right-4">
                    <Skeleton width="80px" height="24px" rounded="full" />
                </div>
            </div>

            {/* Contenu */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Date */}
                <Skeleton width="120px" height="12px" rounded="md" className="mb-3" />

                {/* Titre (2 lignes) */}
                <Skeleton width="100%" height="20px" rounded="md" className="mb-2" />
                <Skeleton width="75%" height="20px" rounded="md" className="mb-3" />

                {/* Extrait (2 lignes) */}
                <Skeleton width="100%" height="14px" rounded="md" className="mb-2" />
                <Skeleton width="85%" height="14px" rounded="md" className="mb-6 flex-grow" />

                {/* Footer : Avatar + auteur + flèche */}
                <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
                    <div className="flex items-center gap-2.5">
                        <Skeleton width="32px" height="32px" rounded="full" />
                        <Skeleton width="100px" height="12px" rounded="md" />
                    </div>
                    <Skeleton width="32px" height="32px" rounded="full" />
                </div>
            </div>
        </div>
    );
}