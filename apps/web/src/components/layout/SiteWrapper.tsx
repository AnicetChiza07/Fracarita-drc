'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function SiteWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Si on est dans /admin, on n'affiche ni le Header ni le Footer
    const isAdminRoute = pathname.startsWith('/admin');
    
    if (isAdminRoute) {
        return <>{children}</>;
    }
    
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
}