import { PrismaClient } from '@prisma/client';
import PageHero from '@/components/layout/PageHero';
import AboutIntro from '@/components/sections/AboutIntro';
import AboutTimeline from '@/components/sections/AboutTimeline';
import AboutMvv from '@/components/sections/AboutMvv';
import AboutRegions from '@/components/sections/AboutRegions';
import AboutVolunteer from '@/components/sections/AboutVolunteer';
import Partners from '@/components/sections/Partners';

const prisma = new PrismaClient();

export default async function AboutPage() {
    // ✅ Récupération sécurisée des partenaires
    const partnersData = await prisma.partner.findMany({
        orderBy: { order: 'asc' },
    }).catch(() => []); // En cas d'erreur, on renvoie un tableau vide

    return (
        <main className="bg-white">
            {/* 1. Hero */}
            <PageHero
                titleBefore="Une mission de"
                highlight="fraternité"
                titleAfter="au service des communautés."
                description="Depuis 2015, FRACARITA RDC œuvre aux côtés des familles vulnérables pour bâtir un avenir plus digne à travers l'éducation, la santé et l'autonomisation."
                breadcrumbCurrent="À Propos"
                bgImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80"
            />

            {/* 2. Sections modulaires */}
            <AboutIntro />
            <AboutTimeline />
            <AboutMvv />
            <AboutRegions />
            <AboutVolunteer />

            {/* 3. Partenaires (avec les données de la DB, ou [] par sécurité) */}
            <Partners initialPartners={partnersData || []} />
        </main>
    );
}