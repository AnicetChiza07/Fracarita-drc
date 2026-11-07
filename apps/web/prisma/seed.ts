import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // 1. Tes identifiants (Change le mot de passe par quelque chose de très fort !)
    const adminEmail = 'admin@fracarita-rdc.org';
    const plainPassword = 'Admin@Fracarita2026!'; // ⚠️ CHANGE CE MOT DE PASSE

    // 2. Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log('✅ Le compte Super Admin existe déjà, aucune action requise.');
        return;
    }

    // 3. Hacher le mot de passe de manière sécurisée (12 rounds)
    console.log('Hachage du mot de passe en cours...');
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    // 4. Créer l'utilisateur dans la base de données
    const newAdmin = await prisma.user.create({
        data: {
            email: adminEmail,
            passwordHash: hashedPassword,
            role: 'SUPER_ADMIN',
            isActive: true,
        },
    });

    console.log('🎉 SUCCÈS ! Premier compte Super Admin créé :');
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Rôle: ${newAdmin.role}`);
    console.log(`   (Le mot de passe est sécurisé en base de données)`);
}

main()
    .catch((e) => {
        console.error('❌ Erreur lors de la création du compte :', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });