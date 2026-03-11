// src/actions/checkout.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validateCoupon, incrementCouponUsage } from "./coupon.actions";
import { calculateDiscount } from "@/lib/discount";
export async function processCourseCheckout(data: {
  courseId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  amount: number;
  couponCode?: string;
}) {
  let discount = 0;
  let appliedCoupon = null;

  if (data.couponCode) {
    const couponResult = await validateCoupon(data.couponCode);
    if (couponResult.success && couponResult.coupon) {
      appliedCoupon = couponResult.coupon;
      discount = calculateDiscount(appliedCoupon, data.amount);
    }
  }

  try {
    // 1. Chercher si l'utilisateur existe déjà
    let user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    // 2. S'il n'existe pas, on lui crée un compte automatiquement
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const defaultPassword = await bcrypt.hash("passer123", salt);
      
      user = await prisma.user.create({
        data: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: defaultPassword,
          role: "STUDENT"
        }
      });
    }

    // 3. Vérifier s'il est déjà inscrit à ce cours
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: data.courseId
        }
      }
    });

    if (existingEnrollment) {
      return { success: false, error: "Vous êtes déjà inscrit à cette formation." };
    }

    const finalAmount = data.amount - discount;

    // 4. Créer l'inscription avec statut "Non payé" (isPaid: false)
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: data.courseId,
        isPaid: false, // Sera mis à true une fois le paiement validé
        amountPaid: finalAmount,
        couponCode: data.couponCode || null,
      }
    });

    return { 
      success: true, 
      reference: `ENR-${enrollment.id}`, 
      user: { name: user.name, email: user.email },
      discount,
      couponCode: data.couponCode || null,
      finalAmount
    };

  } catch (error: any) {
    console.error("Erreur processCourseCheckout:", error);
    return { success: false, error: "Erreur lors du traitement de l'inscription dans la base de données." };
  }
}