import { PrismaClient } from '@prisma/client';
import SectorsManager from './SectorsManager';

const prisma = new PrismaClient();

export default async function SectorsPage() {
    const sectorsFromDb = await prisma.sector.findMany({
        orderBy: { name: 'asc' },
    });

    const sectors = sectorsFromDb.map((s) => ({
        ...s,
        stats: (s.stats as Array<{ value: string; label: string }>) || [],
    }));

    return <SectorsManager initialSectors={sectors} />;
}