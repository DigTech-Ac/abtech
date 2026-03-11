// src/actions/payment.actions.ts
"use server";

import { prisma } from "@/lib/prisma";

const MONEROO_SECRET_KEY = process.env.MONEROO_SECRET_KEY || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function initializePayment(data: { amount: number; email: string; reference: string; description: string; redirectUrl?: string }) {
  try {
    // 1. Récupérer les infos du client
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    const nameParts = user?.name.split(" ") || ["Client", "AbTech"];
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "AbTech";

    // 2. Construire l'URL de retour
    const returnPath = data.redirectUrl || `/payment-success?ref=${data.reference}`;
    const returnUrl = `${APP_URL}${returnPath}`;

    // 3. Adapter le montant (Ton frontend stocke en centimes, Moneroo veut la valeur réelle)
    const realAmount = data.amount;

    // 4. Payload selon la documentation Moneroo
    const payload = {
      amount: realAmount,
      currency: "XOF", // Franc CFA par défaut (change si besoin)
      description: data.description,
      customer: {
        email: data.email,
        first_name: firstName,
        last_name: lastName
      },
      return_url: returnUrl,
      metadata: {
        reference: data.reference
      }
    };

    // 5. Appel à l'API Moneroo
    const response = await fetch("https://api.moneroo.io/v1/payments/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${MONEROO_SECRET_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.data?.checkout_url) {
      console.error("Moneroo Init Error:", result);
      throw new Error(result.message || "Erreur de connexion avec Moneroo");
    }

    return { 
      success: true, 
      paymentUrl: result.data.checkout_url 
    };

  } catch (error: any) {
    console.error("Payment API Error:", error);
    return { success: false, error: "Impossible d'initialiser le paiement avec le fournisseur." };
  }
}

// Fonction pour vérifier le paiement d'une Formation
export async function verifyPayment(reference: string, paymentId: string) {
  try {
    // 1. Appel API Moneroo pour vérifier l'état réel de la transaction
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

    // 2. Extraire l'ID de l'inscription
    const enrollmentId = reference.replace('ENR-', '');

    // 3. Mettre à jour l'inscription dans la base de données
    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { isPaid: true },
      include: { 
        course: { select: { title: true } } 
      }
    });

    return { success: true, courseTitle: enrollment.course.title };

  } catch (error: any) {
    console.error("Erreur verifyPayment:", error);
    return { success: false, error: "Impossible de vérifier et de valider ce paiement." };
  }
}