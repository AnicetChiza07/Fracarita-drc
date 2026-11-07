'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    FileBarChart,
    Trophy,
    MessageSquareQuote,
    Handshake,
    Globe,
    Users,
    Settings,
    ChevronDown,
    X,
    Menu,
} from 'lucide-react';
import LogoutButton from './LogoutButton';

// ✅ Ajout de la propriété 'roles' pour contrôler l'accès à chaque lien
const navCategories = [
    {
        label: 'Contenu',
        items: [
            { name: 'Articles', href: '/admin/articles', icon: FileText, roles: ['SUPER_ADMIN', 'EDITOR', 'VIEWER'] },
            { name: 'Opportunités', href: '/admin/opportunites', icon: Briefcase, roles: ['SUPER_ADMIN', 'EDITOR', 'VIEWER'] },
            { name: 'Rapports', href: '/admin/rapports', icon: FileBarChart, roles: ['SUPER_ADMIN', 'EDITOR', 'VIEWER'] },
            { name: 'Réalisations', href: '/admin/realisations', icon: Trophy, roles: ['SUPER_ADMIN', 'EDITOR', 'VIEWER'] },
        ],
    },
    {
        label: 'Médias & Communauté',
        items: [
            { name: 'Témoignages', href: '/admin/temoignages', icon: MessageSquareQuote, roles: ['SUPER_ADMIN', 'EDITOR', 'VIEWER'] },
            { name: 'Partenaires', href: '/admin/partenaires', icon: Handshake, roles: ['SUPER_ADMIN', 'EDITOR', 'VIEWER'] },
            { name: 'Secteurs', href: '/admin/secteurs', icon: Globe, roles: ['SUPER_ADMIN', 'EDITOR', 'VIEWER'] },
        ],
    },
    {
        label: 'Système',
        items: [
            // ✅ Ces deux liens sont réservés aux SUPER_ADMIN uniquement
            { name: 'Utilisateurs', href: '/admin/users', icon: Users, roles: ['SUPER_ADMIN'] },
            { name: 'Paramètres', href: '/admin/settings', icon: Settings, roles: ['SUPER_ADMIN'] },
        ],
    },
];

interface SidebarProps {
    userEmail: string;
    userRole: string;
    userInitial: string;
}

export default function Sidebar({ userEmail, userRole, userInitial }: SidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Fonction pour déterminer si un lien est actif
    const isActive = (href: string) => {
        if (href === '/admin/dashboard') {
            return pathname === '/admin/dashboard';
        }
        return pathname.startsWith(href);
    };

    // Formatage du rôle pour un affichage plus joli
    const formatRole = (role: string) => {
        if (role === 'SUPER_ADMIN') return 'Super Admin';
        if (role === 'EDITOR') return 'Éditeur';
        if (role === 'VIEWER') return 'Lecteur';
        return role;
    };

    return (
        <>
            {/* Bouton Hamburger (visible uniquement sur mobile) */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-white rounded-lg shadow-md border border-gray-200 text-dark hover:bg-cream transition-colors"
                aria-label="Ouvrir le menu"
            >
                <Menu size={20} />
            </button>

            {/* Overlay sombre (mobile uniquement) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-dark text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header de la sidebar avec bouton fermer (mobile) */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                        <Image
                            src="/logo-clair.png"
                            alt="Logo"
                            width={120}
                            height={0}
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Fermer le menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {/* Tableau de bord */}
                    <Link
                        href="/admin/dashboard"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            isActive('/admin/dashboard')
                                ? 'bg-lime text-dark'
                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <LayoutDashboard size={20} />
                        Tableau de bord
                    </Link>

                    {/* Catégories de navigation avec FILTRAGE par rôle */}
                    {navCategories.map((category) => {
                        // ✅ On filtre les éléments de la catégorie en fonction du rôle de l'utilisateur
                        const allowedItems = category.items.filter((item) => item.roles.includes(userRole));

                        // ✅ Si aucun élément n'est autorisé dans cette catégorie, on ne l'affiche pas du tout
                        if (allowedItems.length === 0) return null;

                        return (
                            <div key={category.label}>
                                <div className="flex items-center gap-2 px-4 mb-2 text-[0.65rem] font-bold text-white/40 uppercase tracking-wider">
                                    <ChevronDown size={12} />
                                    {category.label}
                                </div>
                                <div className="space-y-1">
                                    {allowedItems.map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.href);
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                                                    active
                                                        ? 'bg-lime text-dark'
                                                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                <Icon size={18} />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Profil & Déconnexion */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-full bg-lime/20 flex items-center justify-center text-lime font-bold text-sm flex-shrink-0">
                            {userInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{userEmail}</p>
                            {/* ✅ Affichage du rôle formaté */}
                            <p className="text-xs text-lime font-medium truncate">{formatRole(userRole)}</p>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>
        </>
    );
}