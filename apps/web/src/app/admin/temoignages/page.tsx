import { PrismaClient } from '@prisma/client';
import TestimonialsManager from './TestimonialsManager';

const prisma = new PrismaClient();

export default async function TestimonialsPage() {
    const testimonialsFromDb = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
    });

    const testimonials = testimonialsFromDb.map((t) => ({
        ...t,
        quote: t.quote || '',
        authorName: t.authorName || '',
        role: t.role || '',
        location: t.location || '',
        initials: t.initials || '',
    }));

    return <TestimonialsManager initialTestimonials={testimonials} />;
}