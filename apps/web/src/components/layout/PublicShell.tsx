'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function PublicShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Si on est dans la zone admin, on affiche juste le contenu (sans Header/Footer)
    const isAdminRoute = pathname.startsWith('/admin');
    
    if (isAdminRoute) {
        return <>{children}</>;
    }
    
    // Sinon, on affiche le site public normal
    return (
        <>
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </>
    );
}