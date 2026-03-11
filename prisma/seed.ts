import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

// Prisma 7 : Configuration via l'adaptateur PG
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("⏳ Début du seeding des utilisateurs...");

  // Hachage sécurisé des mots de passe
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const modPassword = await bcrypt.hash('mod123', salt);
  const userPassword = await bcrypt.hash('user123', salt);

  // Création ou mise à jour de l'Administrateur
  const admin = await prisma.user.upsert({
    where: { email: 'admin@abtech.com' },
    update: { password: adminPassword, role: 'ADMIN' },
    create: { email: 'admin@abtech.com', password: adminPassword, name: 'Administrateur', role: 'ADMIN' },
  });

  // Création ou mise à jour du Modérateur
  const moderator = await prisma.user.upsert({
    where: { email: 'mod@abtech.com' },
    update: { password: modPassword, role: 'MODERATOR' },
    create: { email: 'mod@abtech.com', password: modPassword, name: 'Modérateur', role: 'MODERATOR' },
  });

  // Création ou mise à jour d'un Utilisateur simple
  const user = await prisma.user.upsert({
    where: { email: 'user@abtech.com' },
    update: { password: userPassword, role: 'USER' },
    create: { email: 'user@abtech.com', password: userPassword, name: 'Utilisateur', role: 'USER' },
  });

  console.log("✅ Seeding terminé avec succès !");
  console.log(`Comptes prêts : ${admin.email}, ${moderator.email}, ${user.email}`);

  // On ferme la connexion Prisma et le Pool PG pour que le script s'arrête proprement
  await prisma.$disconnect();
  await pool.end();
}

main().catch(async (e) => {
  console.error("❌ Erreur lors du seeding :", e);
  await prisma.$disconnect();
  await pool.end();
  process.exit(1);
});