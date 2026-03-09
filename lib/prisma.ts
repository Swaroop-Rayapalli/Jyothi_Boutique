import { PrismaClient, Prisma } from '@prisma/client';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Next.js serverless functions (like on Vercel) can lose track of where
// the relative `file:./dev.db` path points. We explicitly resolve it.
let prismaConfig: Prisma.PrismaClientOptions = {
    log: ['query', 'error', 'warn'],
};

if (process.env.NODE_ENV === 'production') {
    prismaConfig = {
        ...prismaConfig,
        datasources: {
            db: {
                url: `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`
            }
        }
    };
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaConfig);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
