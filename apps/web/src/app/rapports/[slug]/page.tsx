import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import ReportDetailClient from './ReportDetailClient';

const prisma = new PrismaClient();

const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default async function ReportDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // 1. Récupérer tous les rapports publiés (le nombre est faible, c'est très performant)
    const allReports = await prisma.report.findMany({
        where: { isPublished: true },
        include: { category: true },
        orderBy: { year: 'desc' },
    }).catch(() => []);

    // 2. Trouver le rapport correspondant au slug généré
    const targetReport = allReports.find((report) => {
        const generatedSlug = report.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') + '-' + report.id;
        return generatedSlug === slug;
    });

    if (!targetReport) {
        notFound();
    }

    // 3. Récupérer 3 AUTRES rapports pour la sidebar
    const otherReports = allReports
        .filter((r) => r.id !== targetReport.id)
        .slice(0, 3);

    // 4. Mapping des données avec typage strict
    const mappedReport = {
        id: targetReport.id,
        slug: slug,
        year: targetReport.year,
        type: targetReport.category?.name || 'Document',
        title: targetReport.title,
        fileSize: targetReport.pdfSize || 'N/A',
        date: formatDate(targetReport.createdAt),
        coverImage: targetReport.coverImage || null,
        description: targetReport.description || 'Aucune description disponible pour ce rapport.',
        pdfUrl: targetReport.pdfUrl || null,
        pdfName: targetReport.pdfName || 'document.pdf',
    };

    const mappedOthers = otherReports.map((r) => ({
        id: r.id,
        slug: r.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + r.id,
        year: r.year,
        type: r.category?.name || 'Document',
        title: r.title,
        fileSize: r.pdfSize || 'N/A',
        image: r.coverImage || null,
    }));

    return <ReportDetailClient report={mappedReport} otherReports={mappedOthers} />;
}