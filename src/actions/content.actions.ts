// src/actions/content.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Récupère tout le contenu du site
 * (On utilise le modèle Setting avec un préfixe "content_" pour les différencier des paramètres système)
 */
export async function getSiteContent() {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { startsWith: 'content_' } }
    });

    // On transforme le tableau en un objet structuré et on parse le JSON
    const content: Record<string, any> = {};
    
    settings.forEach(setting => {
      const sectionKey = setting.key.replace('content_', ''); // ex: "content_hero" devient "hero"
      try {
        content[sectionKey] = JSON.parse(setting.value);
      } catch {
        content[sectionKey] = setting.value; // Au cas où ce n'est pas du JSON valide
      }
    });

    return { success: true, content };
  } catch (error: any) {
    console.error("Erreur getSiteContent:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Met à jour une section spécifique du contenu (ex: 'hero', 'about', 'contact')
 */
export async function updateSiteContentSection(section: string, data: any) {
  try {
    const key = `content_${section}`;
    const value = JSON.stringify(data); // On sauvegarde sous forme de texte JSON

    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    // On force Next.js à recharger les pages publiques pour afficher le nouveau contenu
    revalidatePath("/");
    revalidatePath("/a-propos");
    revalidatePath("/admin/content");

    return { success: true };
  } catch (error: any) {
    console.error(`Erreur updateSiteContentSection (${section}):`, error);
    return { success: false, error: "Impossible de sauvegarder le contenu." };
  }
}