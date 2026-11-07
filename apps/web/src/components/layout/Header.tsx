'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Gérer l'effet de scroll pour changer le fond du header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Empêcher le scroll du body quand le menu mobile est ouvert
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Accueil', href: '/' },
        { name: 'À Propos', href: '/a-propos' },
        { name: 'Opportunités', href: '/opportunites' },
        { name: 'Rapports', href: '/rapports' },
        { name: 'Actualités', href: '/blog' },
    ];

    return (
        <>
            {/* Wrapper pour centrer et donner l'effet flottant */}
            <div className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] max-w-[1280px]">
                <header
                    className={`flex items-center justify-between gap-4 px-2 sm:px-2 py-1 rounded-full border transition-all duration-400 ease-in-out backdrop-blur-xl
                        ${isScrolled 
                            ? 'bg-dark/90 border-white/10 shadow-lg' 
                            : 'bg-white/15 border-white/20'
                        }`}
                >
                    {/* Logo avec taille augmentée */}
                    <Link href="/" className="flex items-center flex-shrink-0 group">
                        <Image 
                            src="/logo-clair.png" 
                            alt="Logo Fracarita" 
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="h-13 sm:h-14 w-auto group-hover:scale-105 transition-transform duration-300"
                            priority
                        />
                    </Link>

                    {/* Navigation Desktop */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors duration-300 relative ${
                                        isActive 
                                            ? 'text-lime' 
                                            : 'text-white hover:text-lime'
                                    }`}
                                >
                                    {link.name}
                                    {/* Petit indicateur sous le lien actif */}
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-lime rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* CTA Desktop */}
                    <Link 
                        href="/contact" 
                        className="hidden lg:flex items-center gap-2 bg-lime text-dark pl-2 pr-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-white hover:-translate-y-0.5 flex-shrink-0"
                    >
                        <span className="w-8 h-8 bg-dark rounded-full flex items-center justify-center">
                            <Mail size={16} className="text-lime" />
                        </span>
                        Contact
                    </Link>

                    {/* Bouton Menu Mobile */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden flex items-center justify-center w-10 h-10 bg-lime text-dark rounded-full hover:bg-white transition-all flex-shrink-0"
                        aria-label="Ouvrir le menu"
                    >
                        <Menu size={22} />
                    </button>
                </header>
            </div>

            {/* Overlay Mobile */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-all duration-400 ${
                    isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Mobile (Drawer) */}
            <nav
                className={`fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-white z-[70] p-6 sm:p-8 flex flex-col gap-3 overflow-y-auto transform transition-transform duration-400 ease-in-out ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header du menu mobile */}
                <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-200">
                    <div className="flex items-center gap-2.5">
                        <Image 
                            src="/logo-fonce.png" 
                            alt="Logo Fracarita" 
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="h-10 w-auto"
                        />
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-10 h-10 bg-dark text-white rounded-lg flex items-center justify-center hover:bg-lime hover:text-dark transition-all"
                        aria-label="Fermer le menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Liens du menu mobile avec état actif dynamique */}
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`w-full py-3.5 px-5 border rounded-lg font-medium text-base transition-all duration-300 hover:translate-x-1 ${
                                isActive 
                                    ? 'bg-lime border-lime text-dark font-semibold' 
                                    : 'border-gray-300 text-dark hover:bg-lime/10 hover:border-lime/50'
                            }`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
                
                <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3.5 px-5 border border-gray-300 rounded-lg font-medium text-base text-dark text-center mt-4 hover:bg-lime hover:border-lime hover:text-dark transition-all duration-300"
                >
                    Nous contacter
                </Link>
            </nav>
        </>
    );
}