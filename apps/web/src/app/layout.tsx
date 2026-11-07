import type { Metadata } from 'next';
import './globals.css';
import PublicShell from '@/components/layout/PublicShell';

// Importe tes polices ici si tu en as (ex: Playfair_Display, Inter)
// import { playfair, inter } from '@/lib/fonts';

export const metadata: Metadata = {
    title: 'FRACARITA RDC',
    description: 'Organisation humanitaire dédiée à l\'amélioration des conditions de vie.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            {/* 
                IMPORTANT : On enlève 'bg-white text-dark' d'ici.
                On laisse juste 'antialiased'. 
                Ce sont les sections (Hero, About, etc.) qui gèrent leurs propres couleurs de fond.
            */}
            <body className="antialiased">
                <PublicShell>
                    {children}
                </PublicShell>
            </body>
        </html>
    );
}