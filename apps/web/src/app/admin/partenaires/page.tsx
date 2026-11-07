import { PrismaClient } from '@prisma/client';
import PartnersManager from './PartnersManager';

const prisma = new PrismaClient();

export default async function PartnersPage() {
    const partnersFromDb = await prisma.partner.findMany({
        orderBy: { order: 'asc' },
    });

    const partners = partnersFromDb.map((p) => ({
        ...p,
        logoUrl: p.logoUrl || '',
    }));

    return <PartnersManager initialPartners={partners} />;
}