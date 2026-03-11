// src/actions/product.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "./activity.actions";

export async function createProduct(formData: any) {
  try {
    const finalImages = formData.images && formData.images.length > 0 
      ? formData.images 
      : (formData.image ? [formData.image] :[]);

    const product = await prisma.product.create({
      data: {
        name: formData.name,
        description: formData.description,
        longDescription: formData.longDescription || null,
        price: parseInt(formData.price),
        oldPrice: formData.oldPrice ? parseInt(formData.oldPrice) : null,
        image: formData.image,
        images: JSON.stringify(finalImages),
        category: formData.category,
        inStock: formData.inStock,
        isNew: formData.isNew,
        isHot: formData.isHot,
        isDigital: formData.isDigital || false,
        fileUrl: formData.fileUrl || null,
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/boutique");
    
    await logActivity("CREATE", "PRODUCT", `A ajouté le produit : ${product.name}`);

    return { success: true, product };
  } catch (error: any) {
    console.error("Erreur createProduct:", error);
    return { success: false, error: error.message };
  }
}

export async function getAdminProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, products };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });
    if (!product) return { success: false, error: "Produit non trouvé" };
    
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, formData: any) {
  try {
    const finalImages = formData.images && formData.images.length > 0 
      ? formData.images 
      : (formData.image ? [formData.image] :[]);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: formData.name,
        description: formData.description,
        longDescription: formData.longDescription,
        price: parseInt(formData.price),
        oldPrice: formData.oldPrice ? parseInt(formData.oldPrice) : null,
        image: formData.image,
        images: JSON.stringify(finalImages),
        category: formData.category,
        inStock: formData.inStock,
        isNew: formData.isNew,
        isHot: formData.isHot,
        isDigital: formData.isDigital || false,
        fileUrl: formData.fileUrl || null,
      }
    });
    revalidatePath("/admin/products");
    revalidatePath("/boutique");
    revalidatePath(`/boutique/${id}`);
    
    await logActivity("UPDATE", "PRODUCT", `A modifié le produit : ${product.name}`);
    
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return { success: false, error: "Produit introuvable." };

    await prisma.product.delete({
      where: { id }
    });

    revalidatePath("/admin/products");
    revalidatePath("/boutique");
    
    await logActivity("DELETE", "PRODUCT", `A supprimé le produit : ${product?.name}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Erreur suppression produit:", error);
    return { 
      success: false, 
      error: "Impossible de supprimer ce produit car il est lié à des commandes existantes." 
    };
  }
}

export async function getPublicProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const safeProducts = products.map((product) => {
      const { fileUrl, ...safeProduct } = product;
      return safeProduct;
    });

    return { success: true, products: safeProducts };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
