import { PrismaClient } from '@prisma/client';
import MessagesManager from './MessagesManager';

const prisma = new PrismaClient();

export default async function MessagesPage() {
    const messages = await prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return <MessagesManager initialMessages={messages} />;
}