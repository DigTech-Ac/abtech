"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { PostStatus } from "@prisma/client";

// Fonction utilitaire pour récupérer l'ID de l'utilisateur connecté
async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) throw new Error("Non autorisé");
  
  const payload = await verifyToken(token);
  if (!payload || !payload.id) throw new Error("Token invalide");
  
  return payload.id;
}

export async function createPost(formData: any) {
  try {
    const authorId = await getCurrentUserId();
    
    const post = await prisma.post.create({
      data: {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image,
        category: formData.category,
        status: formData.status as PostStatus,
        authorId: authorId,
      }
    });

    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    
    return { success: true, post };
  } catch (error: any) {
    console.error("Erreur createPost:", error);
    return { success: false, error: error.message };
  }
}

export async function getAdminPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, role: true, avatar: true }
        }
      }
    });
    return { success: true, posts };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (!post) return { success: false, error: "Article non trouvé" };
    return { success: true, post };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePost(id: string, formData: any) {
  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image,
        category: formData.category,
        status: formData.status as PostStatus,
      }
    });
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { success: true, post };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPublishedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, role: true, avatar: true }
        }
      }
    });
    return { success: true, posts };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, role: true, avatar: true }
        }
      }
    });
    
    if (!post) return { success: false, error: "Article non trouvé" };
    
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    return { success: true, post };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}