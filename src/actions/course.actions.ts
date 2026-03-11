"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { CourseLevel } from "@prisma/client";
import { logActivity } from "./activity.actions";

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) throw new Error("Non autorisé");
  
  const payload = await verifyToken(token);
  if (!payload || !payload.id) throw new Error("Token invalide");
  
  return payload.id;
}

const levelMap: Record<string, CourseLevel> = {
  "Débutant": "BEGINNER",
  "Intermédiaire": "INTERMEDIATE",
  "Avancé": "ADVANCED"
};

export async function createCourse(courseData: any, lessonsData: any[]) {
  try {
    const instructorId = await getCurrentUserId();
    
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        shortDescription: courseData.shortDescription,
        image: courseData.image,
        category: courseData.category,
        level: levelMap[courseData.level] || "BEGINNER",
        duration: courseData.duration,
        price: courseData.price,
        isFree: courseData.isFree,
        isPresentiel: false,
        instructorId: instructorId,
        requirements: JSON.stringify([]), 
        objectives: JSON.stringify([]), 
        lessons: {
          create: lessonsData.map((l: any, index: number) => ({
            title: l.title,
            duration: l.duration,
            videoUrl: l.videoUrl,
            content: l.content,
            isFree: l.isFree,
            order: index
          }))
        }
      }
    });

    revalidatePath("/admin/courses");
    revalidatePath("/cours-en-ligne");
    
    await logActivity("CREATE", "COURSE", `A ajouté la formation : ${course.title}`);
    
    return { success: true, course };
  } catch (error: any) {
    console.error("Erreur createCourse:", error);
    return { success: false, error: error.message };
  }
}

export async function getAdminCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPresentiel: false },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { lessons: true } },
        instructor: { select: { name: true } }
      }
    });
    return { success: true, courses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCourse(id: string) {
  try {
    const course = await prisma.course.findUnique({ where: { id } });
    await prisma.course.delete({ where: { id } });
    
    revalidatePath("/admin/courses");
    revalidatePath("/cours-en-ligne");
    
    await logActivity("DELETE", "COURSE", `A supprimé la formation : ${course?.title}`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// NOUVEAU : Récupérer tous les cours pour la page publique
export async function getPublicCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPresentiel: false },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { lessons: true } }
      }
    });
    return { success: true, courses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// NOUVEAU : Récupérer UN cours avec ses leçons pour le lecteur vidéo
export async function getCourseById(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { select: { name: true, avatar: true } },
        lessons: { orderBy: { order: 'asc' } } // On trie les leçons dans le bon ordre
      }
    });
    if (!course) return { success: false, error: "Cours non trouvé" };
    return { success: true, course };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// À ajouter à la fin de src/actions/course.actions.ts

export async function updateCourse(id: string, courseData: any, lessonsData: any[]) {
  try {
    const instructorId = await getCurrentUserId();
    
    const finalSlug = courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const course = await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour les informations du cours
      const updatedCourse = await tx.course.update({
        where: { id },
        data: {
          title: courseData.title,
          slug: finalSlug,
          description: courseData.description,
          shortDescription: courseData.shortDescription,
          image: courseData.image,
          category: courseData.category,
          level: levelMap[courseData.level] || "BEGINNER",
          duration: courseData.duration,
          price: courseData.price,
          isFree: courseData.isFree,
        }
      });

      // 2. Supprimer les anciennes leçons pour éviter les doublons
      await tx.lesson.deleteMany({
        where: { courseId: id }
      });

      // 3. Insérer les nouvelles leçons (avec le bon ordre)
      if (lessonsData && lessonsData.length > 0) {
        await tx.lesson.createMany({
          data: lessonsData.map((l: any, index: number) => ({
            courseId: id,
            title: l.title,
            duration: l.duration,
            videoUrl: l.videoUrl,
            content: l.content,
            isFree: l.isFree,
            order: index
          }))
        });
      }

      return updatedCourse;
    });

    revalidatePath("/admin/courses");
    revalidatePath("/cours-en-ligne");
    revalidatePath(`/formations/${id}`);
    
    await logActivity("UPDATE", "COURSE", `A modifié la formation : ${course.title}`);
    
    return { success: true, course };
  } catch (error: any) {
    console.error("Erreur updateCourse:", error);
    return { success: false, error: error.message };
  }
}