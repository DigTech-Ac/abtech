// src/app/order-success/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, ShoppingBag, Truck, XCircle, Download } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Logo from "@/components/Logo";
import { verifyOrderPayment } from "@/actions/order.actions";
import { useCartStore } from "@/store/cart";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref");
  const method = searchParams.get("method"); 
  const paymentId = searchParams.get("paymentId"); // NOUVEAU : Récupéré via Moneroo
  const clearCart = useCartStore((state) => state.clearCart);

  const[status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [downloads, setDownloads] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const processOrder = async () => {
      if (!reference) {
        setStatus("error");
        setErrorMsg("Référence manquante.");
        return;
      }

      if (method === "mobile") {
        if (!paymentId) {
          setStatus("error");
          setErrorMsg("Paiement non finalisé ou annulé.");
          return;
        }

        const result = await verifyOrderPayment(reference, paymentId, false);
        if (result.success) {
          setStatus("success");
          if (result.downloads) setDownloads(result.downloads);
          clearCart();
        } else {
          setStatus("error");
          setErrorMsg("Le paiement n'a pas pu être validé par notre fournisseur.");
        }
      } else {
        // Paiement à la livraison (Cash)
        const result = await verifyOrderPayment(reference, undefined, true); 
        if (result.success) {
          setStatus("success");
          if (result.downloads) setDownloads(result.downloads);
          clearCart();
        } else {
          setStatus("error");
          setErrorMsg("Erreur lors de la validation de la commande.");
        }
      }
    };

    processOrder();
  },[reference, method, paymentId, clearCart]);
  
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
              <Loader2 className="w-12 h-12 text-[#001f5f] animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification...</h2>
              <p className="text-gray-500">Traitement de votre commande en cours.</p>
            </div>
          )}

          {status === "success" && (
            <div className="py-4 animate-slide-in">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
              
              {method === "cash" ? (
                <p className="text-gray-600 mb-6">
                  Merci pour votre commande. Préparez la somme en espèces, nous vous contacterons très bientôt pour la livraison.
                </p>
              ) : (
                <p className="text-gray-600 mb-6">
                  Paiement reçu avec succès. Votre commande est en cours de préparation.
                </p>
              )}

              {downloads.length > 0 && (
                <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl text-left">
                  <h3 className="font-bold text-[#001f5f] mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Vos produits digitaux
                  </h3>
                  <div className="space-y-3">
                    {downloads.map((file: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-blue-100">
                        <span className="font-medium text-gray-900 text-sm truncate pr-4">{file.name}</span>
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-[#001f5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ff5f00] transition-colors whitespace-nowrap"
                        >
                          Télécharger
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {downloads.length === 0 && (
                <div className="p-4 bg-gray-50 rounded-xl mb-8 flex items-center gap-3 text-left">
                  <Truck className="w-8 h-8 text-[#001f5f]" />
                  <div>
                    <p className="font-semibold text-gray-900">Numéro de suivi</p>
                    <p className="text-sm text-gray-500">{reference}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Link href="/boutique" className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all">
                  <ShoppingBag className="w-5 h-5" />
                  Continuer mes achats
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="py-4 animate-slide-in">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Un problème est survenu</h2>
              <p className="text-gray-600 mb-8">Nous n'avons pas pu valider cette commande.</p>
              <Link href="/boutique" className="w-full bg-[#001f5f] text-white py-4 rounded-xl font-semibold inline-block">
                Retour à la boutique
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}