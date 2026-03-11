"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function getAdminUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, users };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createUser(data: any) {
  try {
    const salt = await bcrypt.genSalt(10);
    // On donne un mot de passe par défaut "passer123" si l'admin n'en a pas défini
    const hashedPassword = await bcrypt.hash(data.password || "passer123", salt);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role.toUpperCase() as Role,
      }
    });
    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}