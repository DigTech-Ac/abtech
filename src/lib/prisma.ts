import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  var prisma: PrismaClient | undefined;
}

let prismaInstance: PrismaClient;

try {
  let connectionString: string;
  
  if (process.env.DATABASE_URL) {
    connectionString = process.env.DATABASE_URL;
  } else if (process.env.DIRECT_URL) {
    connectionString = process.env.DIRECT_URL;
  } else {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  const pool = new Pool({ 
    connectionString,
    max: 5,
    allowExitOnIdle: true,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);

  prismaInstance = global.prisma || new PrismaClient({ adapter });
  
  if (process.env.NODE_ENV !== 'production') global.prisma = prismaInstance;
} catch (error) {
  console.warn('PrismaClient initialization failed:', error);
  prismaInstance = {} as PrismaClient;
}

export const prisma = prismaInstance;