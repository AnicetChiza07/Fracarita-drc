import Skeleton from '@/components/ui/Skeleton';

/**
 * Skeleton de la carte d'opportunité - Reproduit fidèlement la structure
 * de la vraie carte d'offre pour une transition fluide au chargement.
 * 
 * @example
 * // Une grille de 6 opportunités
 * <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 *   {Array.from({ length: 6 }).map((_, i) => (
 *     <JobCardSkeleton key={i} />
 *   ))}
 * </div>
 */
export default function JobCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-200 flex flex-col relative overflow-hidden">
            {/* Header : Icône + Badge statut */}
            <div className="flex items-start justify-between mb-5">
                <Skeleton width="56px" height="56px" rounded="full" />
                <div className="flex gap-2">
                    <Skeleton width="80px" height="20px" rounded="full" />
                    <Skeleton width="90px" height="20px" rounded="full" />
                </div>
            </div>

            {/* Titre (2 lignes) */}
            <Skeleton width="100%" height="22px" rounded="md" className="mb-2" />
            <Skeleton width="75%" height="22px" rounded="md" className="mb-4" />

            {/* Métadonnées (4 lignes) */}
            <div className="flex flex-col gap-2.5 mb-6">
                <div className="flex items-center gap-2">
                    <Skeleton width="14px" height="14px" rounded="full" />
                    <Skeleton width="120px" height="14px" rounded="md" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton width="14px" height="14px" rounded="full" />
                    <Skeleton width="140px" height="14px" rounded="md" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton width="14px" height="14px" rounded="full" />
                    <Skeleton width="160px" height="14px" rounded="md" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton width="14px" height="14px" rounded="full" />
                    <Skeleton width="130px" height="14px" rounded="md" />
                </div>
            </div>

            {/* Footer : Boutons */}
            <div className="flex items-center justify-end gap-2 pt-5 border-t border-black/5 mt-auto">
                <Skeleton width="70px" height="32px" rounded="full" />
                <Skeleton width="110px" height="32px" rounded="full" />
            </div>
        </div>
    );
}