import { PrismaClient } from '@prisma/client';
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Sectors from "@/components/sections/Sectors";
import Realisations from "@/components/sections/Realisations";
import Articles from "@/components/sections/Articles";
import Testimonials from "@/components/sections/Testimonials";
import Partners from "@/components/sections/Partners";

// ✅ CETTE LIGNE DIT À NEXT.JS DE TOUJOURS ALLER CHERCHER LES DONNÉES LES PLUS RÉCENTES
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function Home() {
    // 1. Récupération des secteurs
    const sectorsData = await prisma.sector.findMany({
        orderBy: { createdAt: 'asc' },
    }).catch(() => []); 

    // 2. Récupération des réalisations (les 6 plus récentes)
    const realisationsData = await prisma.realisation.findMany({
        orderBy: { eventDate: 'desc' }, 
        take: 6,
        include: { category: true }, 
    }).catch(() => []);

    // 3. Récupération des 3 derniers articles publiés
    const articlesData = await prisma.article.findMany({
        where: { isPublished: true }, 
        orderBy: { publishedAt: 'desc' },
        take: 3,
        include: { 
            category: true,
            author: true 
        },
    }).catch(() => []);

    // 4. Récupération des témoignages
    const testimonialsData = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
    }).catch(() => []);

    // 5. Récupération des partenaires triés par leur ordre d'affichage
    const partnersData = await prisma.partner.findMany({
        orderBy: { order: 'asc' },
    }).catch(() => []);

    return (
        <main className="min-h-screen bg-cream">
            <Hero />
            <Stats />
            <About />
            <Sectors initialSectors={sectorsData || []} />
            <Realisations initialRealisations={realisationsData || []} />
            <Articles initialArticles={articlesData || []} />
            <Testimonials initialTestimonials={testimonialsData || []} />
            <Partners initialPartners={partnersData || []} />
        </main>
    );
}