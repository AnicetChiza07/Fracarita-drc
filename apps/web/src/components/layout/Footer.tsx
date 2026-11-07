'use client';

import { ArrowUp, MapPin, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const navigationLinks = [
    { number: '01', name: 'Accueil', href: '/' },
    { number: '02', name: 'À Propos', href: '/a-propos' },
    { number: '03', name: 'Opportunités', href: '/opportunites' },
    { number: '04', name: 'Rapports', href: '/rapports' },
    { number: '05', name: 'Actualités', href: '/blog' },
];

// Icônes SVG inline pour les réseaux sociaux
const socialLinks = [
    { 
        name: 'Facebook', 
        href: '#',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        )
    },
    { 
        name: 'X (Twitter)', 
        href: '#',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        )
    },
    { 
        name: 'Instagram', 
        href: '#',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
        )
    },
    { 
        name: 'LinkedIn', 
        href: '#',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        )
    },
];

const contactInfo = [
    { 
        icon: MapPin, 
        label: 'Adresse', 
        value: 'Goma, Quartier Eringeti, N°35', 
        href: null // null = non cliquable
    },
    { 
        icon: Mail, 
        label: 'Email', 
        value: 'contact@fracarita-rdc.org', 
        href: 'mailto:contact@fracarita-rdc.org' 
    },
    { 
        icon: Phone, 
        label: 'Téléphone', 
        value: '+243 999 458 216', 
        href: 'tel:+243999458216' 
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-darker text-white relative overflow-hidden">
            {/* Gradient lime en haut */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lime to-transparent opacity-60" />

            {/* Effets de glow en arrière-plan */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime/8 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lime/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            {/* Contenu principal */}
            <div className="container relative z-10 py-16 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12 lg:gap-16">
                    
                    {/* Colonne 1 : Brand avec Logo */}
                    <div className="max-w-sm">
                        <Link href="/" className="flex items-center gap-3.5 mb-3 group">
                            <Image 
                                src="/logo-clair.png" 
                                alt="Logo Fracarita" 
                                width={250}
                                height={0}
                                className="h-22 sm:h-20 w-auto transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>

                        <p className="text-sm leading-relaxed text-white/50 font-sans">
                            {`Organisation humanitaire dédiée à l'amélioration des conditions de vie des communautés en République Démocratique du Congo.`}
                        </p>
                    </div>

                    {/* Colonne 2 : Navigation */}
                    <div>
                        <h3 className="text-xs font-semibold text-lime uppercase tracking-[0.15em] mb-7 flex items-center gap-3 font-sans">
                            <span className="w-5 h-0.5 bg-lime"></span>
                            Navigation
                        </h3>
                        <ul className="space-y-4">
                            {navigationLinks.map((link) => (
                                <li key={link.number}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-3.5 group transition-transform duration-300 hover:translate-x-1"
                                    >
                                        <span className="text-xs font-semibold text-white/25 min-w-6 transition-colors duration-300 group-hover:text-lime font-sans">
                                            {link.number}
                                        </span>
                                        <span className="text-sm text-white/65 transition-colors duration-300 group-hover:text-white font-sans">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 3 : Réseaux sociaux */}
                    <div>
                        <h3 className="text-xs font-semibold text-lime uppercase tracking-[0.15em] mb-7 flex items-center gap-3 font-sans">
                            <span className="w-5 h-0.5 bg-lime"></span>
                            Suivez-nous
                        </h3>
                        <ul className="space-y-3.5">
                            {socialLinks.map((social) => (
                                <li key={social.name}>
                                    <a
                                        href={social.href}
                                        className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-1"
                                        aria-label={social.name}
                                    >
                                        <div className="w-10 h-10 bg-lime/8 border border-lime/15 rounded-full flex items-center justify-center text-lime flex-shrink-0 transition-all duration-300 group-hover:bg-lime group-hover:text-dark group-hover:border-lime group-hover:-translate-y-0.5">
                                            {social.icon}
                                        </div>
                                        <span className="text-sm font-medium text-white/65 transition-colors duration-300 group-hover:text-lime font-sans">
                                            {social.name}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colonne 4 : Contact (Gestion cliquable / non cliquable) */}
                    <div>
                        <h3 className="text-xs font-semibold text-lime uppercase tracking-[0.15em] mb-7 flex items-center gap-3 font-sans">
                            <span className="w-5 h-0.5 bg-lime"></span>
                            Contact
                        </h3>
                        <ul className="space-y-5">
                            {contactInfo.map((contact) => {
                                const IconComponent = contact.icon;
                                const isClickable = !!contact.href;

                                const InnerContent = (
                                    <>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                            isClickable 
                                                ? 'bg-lime/8 border border-lime/15 text-lime group-hover:bg-lime group-hover:text-dark group-hover:border-lime' 
                                                : 'bg-lime/8 border border-lime/15 text-lime'
                                        }`}>
                                            <IconComponent size={15} />
                                        </div>
                                        <div className="flex flex-col gap-1 pt-1">
                                            <span className="text-[0.68rem] text-white/35 uppercase tracking-[0.1em] font-medium font-sans">
                                                {contact.label}
                                            </span>
                                            <span className={`text-sm font-medium transition-colors duration-300 font-sans ${
                                                isClickable ? 'text-white group-hover:text-lime' : 'text-white/80'
                                            }`}>
                                                {contact.value}
                                            </span>
                                        </div>
                                    </>
                                );

                                return (
                                    <li key={contact.label} className={`flex items-start gap-3.5 transition-transform duration-300 ${isClickable ? 'hover:translate-x-1 group' : ''}`}>
                                        {isClickable ? (
                                            <a href={contact.href} className="flex items-start gap-3.5 w-full">
                                                {InnerContent}
                                            </a>
                                        ) : (
                                            <div className="flex items-start gap-3.5 w-full">
                                                {InnerContent}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Barre de copyright */}
            <div className="border-t border-white/6 py-6 lg:py-8 relative z-10">
                <div className="container">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-5 flex-wrap">
                        <p className="text-xs text-white/45 text-center md:text-left font-sans">
                            © {currentYear} <span className="text-lime font-semibold">FRACARITA RDC</span>. Tous droits réservés.
                        </p>

                        <button
                            onClick={scrollToTop}
                            className="flex items-center gap-3 bg-transparent border border-white/10 pl-5 pr-2 py-2 rounded-full cursor-pointer transition-all duration-400 text-white/70 text-xs font-medium font-sans hover:bg-lime hover:text-dark hover:border-lime hover:-translate-y-0.75 group"
                            aria-label="Retour en haut"
                        >
                            Retour en haut
                            <div className="w-7 h-7 bg-lime/15 rounded-full flex items-center justify-center transition-all duration-400 group-hover:bg-dark group-hover:-rotate-45">
                                <ArrowUp size={13} className="text-lime group-hover:text-lime" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}