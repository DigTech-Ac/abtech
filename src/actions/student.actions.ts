// src/actions/student.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { revalidatePath } from "next/cache";

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) throw new Error("Non autorisé");
  
  const payload = await verifyToken(token);
  if (!payload || !payload.id) throw new Error("Token invalide");
  
  return payload.id;
}

// Récupérer les données du tableau de bord (inscriptions et progression)
export async function getStudentDashboardData() {
  try {
    const userId = await getCurrentUserId();

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            lessons: { orderBy: { order: 'asc' } } // On inclut les leçons triées
          }
        }
      }
    });

    const progress = await prisma.lessonProgress.findMany({
      where: { userId },
      select: { lessonId: true, isCompleted: true }
    });

    return { success: true, enrollments, progress };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Marquer une leçon comme terminée et mettre à jour le pourcentage du cours
export async function markLessonAsCompleted(courseId: string, lessonId: string) {
  try {
    const userId = await getCurrentUserId();

    // 1. Ajouter la leçon aux leçons terminées
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { isCompleted: true },
      create: { userId, lessonId, isCompleted: true }
    });

    // 2. Calculer le nouveau pourcentage de progression
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { _count: { select: { lessons: true } } }
    });

    const completedCount = await prisma.lessonProgress.count({
      where: { 
        userId, 
        lesson: { courseId } 
      }
    });

    const totalLessons = course?._count.lessons || 1;
    const progressPercentage = Math.round((completedCount / totalLessons) * 100);

    // 3. Mettre à jour l'inscription (Enrollment)
    await prisma.enrollment.update({
      where: { userId_courseId: { userId, courseId } },
      data: { progress: progressPercentage }
    });

revalidatePath('/dashboard-etudiant');
    return { success: true, progressPercentage };
  } catch (error: any) {
    console.error("Erreur markLessonAsCompleted:", error);
    return { success: false, error: error.message };
  }
}

// Récupérer les produits digitaux achetés par l'utilisateur
export async function getUserPurchases() {
  try {
    const userId = await getCurrentUserId();

    const orders = await prisma.order.findMany({
      where: { 
        userId,
        status: 'PAID' 
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                isDigital: true,
                fileUrl: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const digitalProducts: any[] =[];
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product.isDigital && item.product.fileUrl) {
          if (!digitalProducts.find(p => p.id === item.product.id)) {
            digitalProducts.push({
              ...item.product,
              orderDate: order.createdAt
            });
          }
        }
      });
    });

    return { success: true, purchases: digitalProducts };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserPaidCourseIds() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return [];

    const payload = await verifyToken(token);
    if (!payload || !payload.id) return [];

    const enrollments = await prisma.enrollment.findMany({
      where: { 
        userId: payload.id,
        isPaid: true 
      },
      select: { courseId: true }
    });

    return enrollments.map(e => e.courseId);
  } catch (error) {
    return [];
  }
}