import { PrismaClient } from '@prisma/client';
import RapportsClient from './RapportsClient';

const prisma = new PrismaClient();

type MappedReport = {
    id: string;
    slug: string;
    year: number;
    type: string;
    title: string;
    excerpt: string;
    fileSize: string;
    image: string | null;
    pdfUrl: string | null;
    pdfName: string | null;
};

export default async function RapportsPage() {
    const allReports = await prisma.report.findMany({
        where: { isPublished: true },
        orderBy: [
            { year: 'desc' },
            { createdAt: 'desc' }
        ],
        include: {
            category: true,
        },
    }).catch(() => []);

    const mappedReports: MappedReport[] = allReports.map((report) => {
        const reportType = report.category?.name || 'Document';
        
        // ✅ Génération d'un slug unique et propre à partir du titre et de l'ID
        // (Ex: "rapport-annuel-2026-cld123456789")
        const generatedSlug = report.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') + '-' + report.id;

        return {
            id: report.id,
            slug: generatedSlug,
            year: report.year,
            type: reportType,
            title: report.title,
            excerpt: report.description || 'Aucun résumé disponible pour ce rapport.',
            fileSize: report.pdfSize || 'N/A',
            image: report.coverImage || null,
            pdfUrl: report.pdfUrl || null,
            pdfName: report.pdfName || null,
        };
    });

    return <RapportsClient initialReports={mappedReports} />;
}