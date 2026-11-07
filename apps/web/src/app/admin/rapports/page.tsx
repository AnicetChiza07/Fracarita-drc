import { PrismaClient } from '@prisma/client';
import RapportsManager from './RapportsManager';

const prisma = new PrismaClient();

export default async function RapportsPage() {
    const rapportsFromDb = await prisma.report.findMany({
        include: {
            category: true,
        },
        orderBy: { year: 'desc' },
    });

    const categories = await prisma.reportCategory.findMany({
        orderBy: { name: 'asc' },
    });

    const rapports = rapportsFromDb.map((r) => ({
        ...r,
        pdfName: r.pdfName || null,
        pdfUrl: r.pdfUrl || null,
        pdfSize: r.pdfSize || null,
        coverImage: r.coverImage || null,
        description: r.description || null,
    }));

    return (
        <RapportsManager
            initialRapports={rapports}
            initialCategories={categories}
        />
    );
}