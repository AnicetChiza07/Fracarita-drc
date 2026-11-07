import { randomBytes } from 'crypto';

export function generateRandomPassword(length = 12): string {
    // Génère une chaîne aléatoire sûre
    return randomBytes(length).toString('base64').slice(0, length);
}