import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  var prisma: PrismaClient | undefined;
}

let prismaInstance: PrismaClient;

try {
  // Prisma 7 : Configuration via l'adaptateur PG
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  prismaInstance = global.prisma || new PrismaClient({ adapter });
  
  if (process.env.NODE_ENV !== 'production') global.prisma = prismaInstance;
} catch (error) {
  console.warn('PrismaClient initialization failed:', error);
  prismaInstance = {} as PrismaClient;
}

export const prisma = prismaInstance;