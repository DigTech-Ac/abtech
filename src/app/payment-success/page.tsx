// src/app/payment-success/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, BookOpen, LayoutDashboard } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Logo from "@/components/Logo";
import { verifyPayment } from "@/actions/payment.actions";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("ref");
  const paymentId = searchParams.get("paymentId"); // NOUVEAU : Fourni par Moneroo

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [courseName, setCourseName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const validateTransaction = async () => {
      if (!reference || !paymentId) {
        setStatus("error");
        setErrorMsg("Informations de paiement manquantes ou paiement annulé.");
        return;
      }

      // On passe l'ID de paiement à notre backend
      const result = await verifyPayment(reference, paymentId);

      if (result.success) {
        setStatus("success");
        setCourseName(result.courseTitle || "");
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Erreur inconnue");
      }
    };

    validateTransaction();
  }, [reference, paymentId]);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex-1 min-w-0 flex justify-start">
            <Logo className="w-[700px] max-w-full h-auto" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center">
          
          {status === "loading" && (
            <div className="py-8">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#001f5f] border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#001f5f] animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification du paiement...</h2>
              <p className="text-gray-500">Veuillez ne pas fermer cette page.</p>
            </div>
          )}

          {status === "success" && (
            <div className="py-4 animate-slide-in">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Paiement Réussi !</h2>
              <p className="text-gray-600 mb-8">
                Félicitations, vous êtes maintenant inscrit(e) à la formation : <br/>
                <span className="font-semibold text-[#001f5f] block mt-2">{courseName}</span>
              </p>
              
              <div className="space-y-3">
                <Link 
                  href="/dashboard-etudiant"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Aller à mon tableau de bord
                </Link>
                <Link 
                  href="/cours-en-ligne"
                  className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  Voir d'autres formations
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="py-4 animate-slide-in">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Paiement Échoué</h2>
              <p className="text-gray-600 mb-8">
                {errorMsg}
              </p>
              
              <button 
                onClick={() => router.push('/cours-en-ligne')}
                className="w-full bg-[#001f5f] text-white py-4 rounded-xl font-semibold hover:bg-[#001a4d] transition-colors"
              >
                Retourner aux formations
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}