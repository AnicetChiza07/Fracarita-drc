import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
    width?: string;
    height?: string;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

/**
 * Composant Skeleton de base - Utilisé pour créer des placeholders animés
 * pendant le chargement des données depuis le backend.
 * 
 * @example
 * // Un rectangle (pour une image)
 * <Skeleton width="100%" height="200px" rounded="2xl" />
 * 
 * @example
 * // Un cercle (pour un avatar)
 * <Skeleton width="40px" height="40px" rounded="full" />
 * 
 * @example
 * // Une ligne de texte
 * <Skeleton width="60%" height="16px" rounded="md" />
 */
export default function Skeleton({ 
    className, 
    width = '100%', 
    height = '20px',
    rounded = 'md' 
    }: SkeletonProps) {
    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full',
  };

    return (
        <div
            className={cn(
                'skeleton-shimmer bg-gray-200',
                roundedClasses[rounded],
                className
            )}
            style={{ width, height }}
            aria-hidden="true"
        />
    );
}