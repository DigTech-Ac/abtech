// src/actions/coupon.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function validateCoupon(code: string) {
  try {
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    
    if (!coupon) return { success: false, error: "Code promo introuvable." };
    if (!coupon.isActive) return { success: false, error: "Ce code promo est désactivé." };
    if (coupon.expiresAt && new Date() > coupon.expiresAt) return { success: false, error: "Ce code promo a expiré." };
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { success: false, error: "Ce code promo a atteint sa limite d'utilisation." };

    return { success: true, coupon };
  } catch (error: any) {
    return { success: false, error: "Erreur lors de la vérification du code." };
  }
}

export async function incrementCouponUsage(id: string) {
  await prisma.coupon.update({
    where: { id },
    data: { usedCount: { increment: 1 } }
  });
}

export async function getAdminCoupons() {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return { success: true, coupons };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCoupon(data: any) {
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: parseInt(data.discountValue),
        maxUses: data.maxUses ? parseInt(data.maxUses) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      }
    });
    revalidatePath("/admin/coupons");
    return { success: true, coupon };
  } catch (error: any) {
    return { success: false, error: "Ce code existe probablement déjà." };
  }
}

export async function deleteCoupon(id: string) {
  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
  try {
    await prisma.coupon.update({
      where: { id },
      data: { isActive }
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


