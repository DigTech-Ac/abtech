// src/actions/settings.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Récupérer tous les paramètres sous forme d'objet simple { key: "value" }
export async function getSettings() {
  try {
    const settingsList = await prisma.setting.findMany();
    
    // On ajoute les types stricts ici pour corriger l'erreur TS
    const settingsMap = settingsList.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    return { success: true, settings: settingsMap };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Mettre à jour plusieurs paramètres d'un coup
export async function updateSettings(data: Record<string, string>) {
  try {
    // Utilisation d'une transaction pour tout mettre à jour de manière sécurisée
    await prisma.$transaction(
      Object.entries(data).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Erreur updateSettings:", error);
    return { success: false, error: "Impossible de sauvegarder les paramètres." };
  }
}