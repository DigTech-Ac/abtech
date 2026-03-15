import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Le CLI Prisma (migrations, push, studio) utilisera la connexion directe
    url: process.env.DIRECT_URL,
  },
});