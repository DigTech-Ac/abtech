// src/actions/presentiel.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { CourseLevel } from "@prisma/client";

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

export async function createPresentielCourse(courseData: any) {
  try {
    const instructorId = await getCurrentUserId();
    
    // Génération automatique du slug si non fourni
    const finalSlug = courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

    const course = await prisma.course.create({
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
        
        // Champs spécifiques au présentiel
        isPresentiel: true,
        location: courseData.location,
        startDate: courseData.startDate ? new Date(courseData.startDate) : null,
        schedule: courseData.schedule,
        maxStudents: courseData.maxStudents,
        
        // Stockage des listes sous forme de JSON
        requirements: JSON.stringify(courseData.prerequisites ||[]), 
        objectives: JSON.stringify(courseData.objectives ||[]), 
        included: JSON.stringify(courseData.included ||[]),

        instructorId: instructorId,
      }
    });

    revalidatePath("/admin/presentiel");
    revalidatePath("/cours-presentiel");
    
    return { success: true, course };
  } catch (error: any) {
    console.error("Erreur createPresentielCourse:", error);
    return { success: false, error: error.message };
  }
}

export async function getAdminPresentielCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPresentiel: true },
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: { select: { name: true } },
        _count: { select: { enrollments: true } } // Pour compter les inscrits
      }
    });
    return { success: true, courses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPresentielCourseById(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { select: { name: true, avatar: true } },
        _count: { select: { enrollments: true } }
      }
    });
    
    if (!course) return { success: false, error: "Formation non trouvée" };

    // Formater les données JSON pour le Frontend
    const formattedCourse = {
      ...course,
      prerequisites: JSON.parse(course.requirements || "[]"),
      objectives: JSON.parse(course.objectives || "[]"),
      included: JSON.parse(course.included || "[]"),
      // Convertir le niveau pour correspondre au Frontend
      levelFrontend: Object.keys(levelMap).find(key => levelMap[key] === course.level) || "Débutant"
    };

    return { success: true, course: formattedCourse };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePresentielCourse(id: string, courseData: any) {
  try {
    const finalSlug = courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const course = await prisma.course.update({
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
        
        location: courseData.location,
        startDate: courseData.startDate ? new Date(courseData.startDate) : null,
        schedule: courseData.schedule,
        maxStudents: courseData.maxStudents,
        
        requirements: JSON.stringify(courseData.prerequisites || []), 
        objectives: JSON.stringify(courseData.objectives ||[]), 
        included: JSON.stringify(courseData.included ||[]),
      }
    });

    revalidatePath("/admin/presentiel");
    revalidatePath("/cours-presentiel");
    revalidatePath(`/admin/presentiel/${id}`);
    
    return { success: true, course };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePresentielCourse(id: string) {
  try {
    await prisma.course.delete({ where: { id } });
    revalidatePath("/admin/presentiel");
    revalidatePath("/cours-presentiel");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPublicPresentielCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPresentiel: true },
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: { select: { name: true, avatar: true } },
        _count: { select: { enrollments: true } }
      }
    });

    // Formater le niveau pour le frontend
    const formattedCourses = courses.map(course => ({
      ...course,
      levelFrontend: Object.keys(levelMap).find(key => levelMap[key] === course.level) || "Débutant"
    }));

    return { success: true, courses: formattedCourses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}