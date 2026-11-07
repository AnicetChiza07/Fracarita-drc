import { PrismaClient } from '@prisma/client';
import RealisationsManager from './RealisationsManager';

const prisma = new PrismaClient();

export default async function RealisationsPage() {
    const realisationsFromDb = await prisma.realisation.findMany({
        include: {
            category: true,
        },
        orderBy: { eventDate: 'desc' },
    });

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
    });

    const realisations = realisationsFromDb.map((r) => ({
        ...r,
        description: r.description || null,
        imageUrl: r.imageUrl || null,
    }));

    return (
        <RealisationsManager
            initialRealisations={realisations}
            initialCategories={categories}
        />
    );
}