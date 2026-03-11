"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

async function getActorId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.id || null;
}

export async function logActivity(action: string, target: string, details: string) {
  try {
    const userId = await getActorId();
    if (!userId) return;

    await prisma.activityLog.create({
      data: { userId, action, target, details }
    });
  } catch (error) {
    console.error("Erreur LogActivity:", error);
  }
}

export async function getActivityLogs() {
  try {
    return await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: { select: { name: true, role: true } }
      }
    });
  } catch (error) {
    return [];
  }
}
