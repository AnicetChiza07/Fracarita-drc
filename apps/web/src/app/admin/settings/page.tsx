import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import SettingsManager from './SettingsManager';

const prisma = new PrismaClient();

export default async function SettingsPage() {
    // Récupérer les paramètres globaux
    let settings = await prisma.globalSettings.findUnique({
        where: { id: 'global_settings_id' },
    });

    // Créer les paramètres par défaut s'ils n'existent pas
    if (!settings) {
        settings = await prisma.globalSettings.create({
            data: {
                id: 'global_settings_id',
                siteName: 'FRACARITA RDC',
                siteDescription: null,
                contactEmail: 'contact@fracarita-rdc.org',
                contactPhone: '+243 000 000 000',
                contactAddress: 'Goma, RDC',
                socialLinks: {},
            },
        });
    }

    // Récupérer l'utilisateur connecté
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/admin/login');
    }

    let currentUser = null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        currentUser = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
    } catch (error) {
        redirect('/admin/login');
    }

    if (!currentUser) {
        redirect('/admin/login');
    }

    return (
        <SettingsManager
            initialSettings={settings}
            currentUser={currentUser}
        />
    );
}