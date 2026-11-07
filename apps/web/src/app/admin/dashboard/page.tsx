import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import {
    FileText,
    Briefcase,
    FileBarChart,
    Trophy,
    Users,
    Handshake,
    MessageSquareQuote,
    Mail,
    Clock,
    Archive,
} from 'lucide-react';

const prisma = new PrismaClient();

// Fonctions utilitaires pour le formatage des dates
const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default async function DashboardPage() {
    // 1. Récupération des statistiques en parallèle pour des performances optimales
    const [
        articlesCount,
        opportunitiesCount,
        reportsCount,
        realisationsCount,
        usersCount,
        partnersCount,
        testimonialsCount,
    ] = await Promise.all([
        prisma.article.count(),
        prisma.opportunity.count(),
        prisma.report.count(),
        prisma.realisation.count(),
        prisma.user.count(),
        prisma.partner.count(),
        prisma.testimonial.count(),
    ]);

    const stats = [
        { label: 'Articles', value: articlesCount, icon: FileText, color: 'bg-blue-500' },
        { label: 'Opportunités', value: opportunitiesCount, icon: Briefcase, color: 'bg-lime' },
        { label: 'Rapports', value: reportsCount, icon: FileBarChart, color: 'bg-purple-500' },
        { label: 'Réalisations', value: realisationsCount, icon: Trophy, color: 'bg-orange-500' },
        { label: 'Utilisateurs', value: usersCount, icon: Users, color: 'bg-pink-500' },
        { label: 'Partenaires', value: partnersCount, icon: Handshake, color: 'bg-indigo-500' },
        { label: 'Témoignages', value: testimonialsCount, icon: MessageSquareQuote, color: 'bg-teal-500' },
    ];

    // 2. Récupération des derniers messages (max 4)
    const recentMessages = await prisma.message.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
    });

    // 3. Récupération des derniers articles (max 5) avec leur catégorie
    const recentArticles = await prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
    });

    // 4. Récupération des archives récentes (on utilise les Rapports comme archives)
    const recentArchives = await prisma.report.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-8">
            {/* En-tête */}
            <div>
                <h1 className="text-3xl font-bold text-dark mb-2">
                    {`Vue d'ensemble`}
                </h1>
                <p className="text-text-light">
                    {`Voici ce qui se passe sur votre plateforme aujourd'hui.`}
                </p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center gap-3 hover:shadow-md hover:border-lime/30 transition-all duration-300"
                        >
                            <div className={`w-11 h-11 ${stat.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-text-light font-medium mb-0.5">{stat.label}</p>
                                <p className="text-xl font-bold text-dark">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Grille : Messages + Articles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Derniers messages */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Mail size={20} className="text-lime-dark" />
                            <h3 className="text-lg font-bold text-dark">
                                Derniers messages
                            </h3>
                        </div>
                        <Link
                            href="/admin/messages"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Voir tout
                        </Link>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {recentMessages.length === 0 ? (
                            <p className="text-sm text-text-light py-4 text-center">Aucun message pour le moment.</p>
                        ) : (
                            recentMessages.map((msg) => (
                                <div key={msg.id} className="py-4 flex items-start gap-4 first:pt-0 last:pb-0">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-dark text-sm mb-0.5 truncate">
                                            {msg.name}
                                        </p>
                                        <p className="text-sm text-text-light mb-1.5 truncate">
                                            {msg.subject}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-text-light/70">
                                            <Clock size={12} />
                                            <span>{formatDate(msg.createdAt)}</span>
                                            {!msg.isRead && (
                                                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[0.65rem] font-semibold">
                                                    Non lu
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Derniers articles */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <FileText size={20} className="text-lime-dark" />
                            <h3 className="text-lg font-bold text-dark">
                                Derniers articles
                            </h3>
                        </div>
                        <Link
                            href="/admin/articles"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Voir tout
                        </Link>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {recentArticles.length === 0 ? (
                            <p className="text-sm text-text-light py-4 text-center">Aucun article pour le moment.</p>
                        ) : (
                            recentArticles.map((article) => (
                                <div key={article.id} className="py-4 flex items-start gap-4 first:pt-0 last:pb-0">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                        <FileText size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-dark text-sm mb-1 truncate">
                                            {article.title}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm text-text-light">
                                                {article.category?.name || 'Non catégorisé'}
                                            </span>
                                            <span className="text-xs text-text-light/60">
                                                • {formatDate(article.createdAt)}
                                            </span>
                                            {article.isFeatured && (
                                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[0.65rem] font-semibold">
                                                    À la une
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Archives récentes (Rapports) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Archive size={20} className="text-lime-dark" />
                        <h3 className="text-lg font-bold text-dark">
                            Archives récentes (Rapports)
                        </h3>
                    </div>
                    <Link
                        href="/admin/rapports"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Voir tout
                    </Link>
                </div>

                <div className="divide-y divide-gray-100">
                    {recentArchives.length === 0 ? (
                        <p className="text-sm text-text-light py-4 text-center">Aucune archive pour le moment.</p>
                    ) : (
                        recentArchives.map((archive) => (
                            <div key={archive.id} className="py-4 flex items-start gap-4 first:pt-0 last:pb-0">
                                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0 overflow-hidden border border-gray-200">
                                    {archive.coverImage ? (
                                        <img
                                            src={archive.coverImage}
                                            alt={archive.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Archive size={24} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-dark text-sm mb-1">
                                        {archive.title}
                                    </p>
                                    <p className="text-sm text-text-light mb-1.5 line-clamp-1">
                                        {archive.description || 'Aucune description'}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-text-light/70">
                                        <Clock size={12} />
                                        <span>{formatDateTime(archive.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}