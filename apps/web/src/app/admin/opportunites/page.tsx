import { PrismaClient } from '@prisma/client';
import OpportunitesManager from './OpportunitesManager';
import { JSONContent } from '@tiptap/react';

const prisma = new PrismaClient();

export default async function OpportunitesPage() {
    const opportunitesFromDb = await prisma.opportunity.findMany({
        include: {
            category: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
    });

    const opportunites = opportunitesFromDb.map((opp) => ({
        ...opp,
        description: (opp.description as JSONContent) || null,
        pdfName: opp.pdfName || null,
        pdfUrl: opp.pdfUrl || null,
        pdfSize: opp.pdfSize || null,
    }));

    return (
        <OpportunitesManager
            initialOpportunites={opportunites}
            initialCategories={categories}
        />
    );
}