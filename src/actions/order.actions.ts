// src/actions/order.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { validateCoupon, incrementCouponUsage } from "./coupon.actions";
import { calculateDiscount } from "@/lib/discount";

export async function createOrder(orderData: any, cartItems: any[], couponCode?: string) {
  let discount = 0;
  let appliedCoupon = null;
  
  if (couponCode) {
    const couponResult = await validateCoupon(couponCode);
    if (couponResult.success) {
      appliedCoupon = couponResult.coupon;
    }
  }
  try {
    let user = await prisma.user.findUnique({ where: { email: orderData.email } });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const defaultPassword = await bcrypt.hash("passer123", salt);
      user = await prisma.user.create({
        data: {
          name: `${orderData.firstName} ${orderData.lastName}`,
          email: orderData.email,
          password: defaultPassword,
          role: "USER"
        }
      });
    }

    const productIds = cartItems.map((item: any) => item.product.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    let subtotal = 0;
    const itemsToCreate =[];

    for (const item of cartItems) {
      const dbProduct = dbProducts.find(p => p.id === item.product.id);
      if (dbProduct) {
        subtotal += (dbProduct.price * item.quantity);
        itemsToCreate.push({
          productId: dbProduct.id,
          quantity: item.quantity,
          price: dbProduct.price
        });
      }
    }

    const shipping = subtotal > 500000 ? 0 : 5000;
    
    if (appliedCoupon) {
      discount = calculateDiscount(appliedCoupon, subtotal);
    }
    
    const totalAmount = subtotal + shipping - discount;

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: totalAmount,
        paymentMethod: orderData.paymentMethod,
        shippingAddress: orderData.address,
        city: orderData.city,
        country: orderData.country,
        phone: orderData.phone,
        notes: orderData.notes,
        couponCode: couponCode || null,
        status: "PENDING",
        items: { create: itemsToCreate }
      }
    });

    return { success: true, order, user, discount, couponCode: couponCode || null };
  } catch (error: any) {
    return { success: false, error: "Impossible de créer la commande." };
  }
}

export async function verifyOrderPayment(reference: string, paymentId?: string, isCash: boolean = false) {
  try {
    const orderId = reference.replace('ORD-', '');
    
    // Si c'est un paiement en ligne, on vérifie chez Moneroo
    if (!isCash) {
      if (!paymentId) throw new Error("ID de paiement manquant.");
      const MONEROO_SECRET_KEY = process.env.MONEROO_SECRET_KEY || "";
      const response = await fetch(`https://api.moneroo.io/v1/payments/${paymentId}/verify`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${MONEROO_SECRET_KEY}`
        }
      });

      const result = await response.json();

      if (!response.ok || result.data?.status !== "success") {
        throw new Error("Paiement non validé par le fournisseur");
      }

      // Le paiement est vérifié, on passe la commande en PAID
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" }
      });
    }

    // Récupérer la commande pour donner les liens de téléchargement si nécessaire
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    // Si un coupon a été utilisé, incrementer son compteur
    if (order && order.couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: order.couponCode } });
      if (coupon) {
        await incrementCouponUsage(coupon.id);
      }
    }

    const orderWithItems = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: { select: { name: true, isDigital: true, fileUrl: true } }
          }
        }
      }
    });

    const downloads = (orderWithItems?.items ||[])
      .filter((item: any) => item.product.isDigital && item.product.fileUrl)
      .map((item: any) => ({
        name: item.product.name,
        url: item.product.fileUrl
      }));

    return { success: true, order, downloads };
  } catch (error: any) {
    console.error("Erreur verifyOrderPayment:", error);
    return { success: false, error: "Impossible de vérifier le paiement de cette commande." };
  }
}

export async function getAdminOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true, image: true } } } }
      }
    });
    return { success: true, orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    revalidatePath("/admin/orders");
    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}