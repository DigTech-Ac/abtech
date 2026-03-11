// src/actions/profile.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function updateProfile(data: { name?: string; email?: string; password?: string; avatar?: string }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    
    if (!token) throw new Error("Vous n'êtes pas connecté.");
    
    const payload = await verifyToken(token);
    if (!payload || !payload.id) throw new Error("Session invalide.");

    // On prépare les données à mettre à jour
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;

    // Si l'utilisateur veut changer de mot de passe, on le hache
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(data.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.id },
      data: updateData,
    });

    // On retourne l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    return { 
      success: true, 
      user: { ...userWithoutPassword, role: updatedUser.role.toLowerCase() } 
    };
  } catch (error: any) {
    console.error("Erreur updateProfile:", error);
    return { success: false, error: error.message };
  }
}