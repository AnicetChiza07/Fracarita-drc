import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import JobDetailClient from './JobDetailClient';

const prisma = new PrismaClient();

const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatShortDate = (date: Date | string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    // Next.js 15 : params est une promesse
    const { slug } = await params;

    // 1. Récupérer l'opportunité principale
    const job = await prisma.opportunity.findUnique({
        where: { slug, isPublished: true },
        include: { category: true },
    });

    if (!job) {
        notFound();
    }

    // 2. Récupérer 3 opportunités similaires (même catégorie, hors offre actuelle)
    const similarJobs = await prisma.opportunity.findMany({
        where: {
            categoryId: job.categoryId,
            id: { not: job.id },
            isPublished: true,
        },
        take: 3,
        orderBy: { deadline: 'asc' },
        include: { category: true },
    }).catch(() => []);

    // 3. Mapping des données avec typage strict
    const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;
    const mappedType = job.type === 'JOB' ? "Offres d'emploi" : job.type === 'INTERNSHIP' ? 'Stages' : "Appels d'offre";

    const mappedJob = {
        id: job.id,
        slug: job.slug,
        type: mappedType,
        status: (isExpired ? 'expiree' : 'valide') as 'valide' | 'expiree',
        title: job.title,
        location: job.location,
        contract: job.contractType || 'Non spécifié',
        publishedDate: formatShortDate(job.createdAt),
        deadline: formatDate(job.deadline) || 'Non spécifiée',
        description: job.description as unknown, // JSON Tiptap
        pdfUrl: job.pdfUrl,
        pdfName: job.pdfName,
    };

    const mappedSimilar = similarJobs.map((sim) => ({
        id: sim.id,
        slug: sim.slug,
        title: sim.title,
        type: sim.type === 'JOB' ? "Offres d'emploi" : sim.type === 'INTERNSHIP' ? 'Stages' : "Appels d'offre",
        location: sim.location,
        contract: sim.contractType || 'Non spécifié',
        deadline: formatShortDate(sim.deadline) || 'Non spécifiée',
    }));

    return <JobDetailClient job={mappedJob} similarJobs={mappedSimilar} />;
}