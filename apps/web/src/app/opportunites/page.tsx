import { PrismaClient } from '@prisma/client';
import OpportunitesClient from './OpportunitesClient';

const prisma = new PrismaClient();

type MappedOpportunity = {
    id: string;
    slug: string;
    title: string;
    type: "Offres d'emploi" | "Stages" | "Appels d'offre";
    status: "valide" | "expiree";
    location: string;
    contract: string;
    experience: string;
    deadline: string;
    coverImage: string | null;
    pdfUrl: string | null;
    pdfName: string | null;
    excerpt: string;
};

function extractPlainText(content: unknown): string {
    if (!content) return '';
    if (typeof content === 'string') return content;
    if (typeof content === 'object' && content !== null) {
        const obj = content as Record<string, unknown>;
        if (Array.isArray(obj.content)) {
            return (obj.content as unknown[])
                .map((node) => extractPlainText(node))
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
        }
        if (typeof obj.text === 'string') return obj.text;
    }
    return '';
}

function truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default async function OpportunitesPage() {
    const allOpportunities = await prisma.opportunity.findMany({
        where: { isPublished: true },
        orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
        include: { category: true },
    }).catch(() => []);

    const typeCounts = allOpportunities.reduce((acc, opp) => {
        const typeName = opp.type === 'JOB' ? "Offres d'emploi" : opp.type === 'INTERNSHIP' ? 'Stages' : "Appels d'offre";
        acc[typeName] = (acc[typeName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const filters = ['Tous', ...Object.keys(typeCounts)];

    const mappedOpportunities: MappedOpportunity[] = allOpportunities.map((opp) => {
        const isExpired = opp.deadline ? new Date(opp.deadline) < new Date() : false;
        const mappedType = (opp.type === 'JOB' ? "Offres d'emploi" : opp.type === 'INTERNSHIP' ? 'Stages' : "Appels d'offre") as "Offres d'emploi" | "Stages" | "Appels d'offre";
        
        const fullText = extractPlainText(opp.description);
        const excerpt = truncateText(fullText, 150);

        return {
            id: opp.id,
            slug: opp.slug,
            title: opp.title,
            type: mappedType,
            status: (isExpired ? 'expiree' : 'valide') as "valide" | "expiree",
            location: opp.location,
            contract: opp.contractType || 'Non spécifié',
            experience: opp.experienceLevel || 'Non spécifié',
            deadline: formatDate(opp.deadline) || 'Non spécifiée',
            coverImage: opp.coverImage,
            pdfUrl: opp.pdfUrl,
            pdfName: opp.pdfName,
            excerpt,
        };
    });

    return <OpportunitesClient initialOpportunities={mappedOpportunities} initialFilters={filters} />;
}