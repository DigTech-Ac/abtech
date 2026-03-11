// src/app/checkout-formation/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { 
  ArrowLeft, CreditCard, Shield, MapPin, Phone, Mail, User, 
  BookOpen, Clock, Users, PlayCircle, Loader2, AlertCircle
} from "lucide-react";
import { getCourseById } from "@/actions/course.actions";
import { processCourseCheckout } from "@/actions/checkout.actions";
import { initializePayment } from "@/actions/payment.actions";

function CheckoutFormationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("course");
  
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const[errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "Togo",
    paymentMethod: "mobile",
    notes: ""
  });

  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        const result = await getCourseById(courseId);
        if (result.success && result.course) {
          setSelectedCourse(result.course);
        }
      }
      setIsLoading(false);
    };
    fetchCourse();
  },[courseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    if (!selectedCourse) return;

    // 1. Sauvegarder l'inscription en Base de données
    const checkoutResult = await processCourseCheckout({
      courseId: selectedCourse.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      amount: selectedCourse.price
    });

    if (!checkoutResult.success) {
      setErrorMsg(checkoutResult.error || "Une erreur est survenue.");
      setIsSubmitting(false);
      return;
    }

    // 2. Initialiser le paiement avec l'API
    const paymentResult = await initializePayment({
      amount: selectedCourse.price,
      email: formData.email,
      reference: checkoutResult.reference!, // Ex: ENR-clqxxx...
      description: `Inscription à la formation: ${selectedCourse.title}`
    });

    if (!paymentResult.success) {
      setErrorMsg(paymentResult.error || "Impossible de contacter l'opérateur de paiement.");
      setIsSubmitting(false);
      return;
    }

    // 3. Rediriger l'utilisateur vers la page de paiement générée
    window.location.href = paymentResult.paymentUrl!;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" />
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucune formation sélectionnée</h2>
          <Link href="/cours-en-ligne" className="text-[#001f5f] hover:underline">
            Voir les formations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex-1 min-w-0 flex justify-start">
            <Logo className="w-[700px] max-w-full h-auto" />
           </div>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-[#001f5f] font-medium flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          </div>
        </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Inscription à la formation</h1>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#001f5f]" /> Informations personnelles
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none" placeholder="Ex: Koffi" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none" placeholder="Ex: Jean" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none" placeholder="jean@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none" placeholder="+228 90 56 50 86" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#001f5f]" /> Mode de paiement
                </h2>
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'mobile' ? 'border-[#001f5f] bg-blue-50' : 'hover:border-[#001f5f]'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="paymentMethod" value="mobile" checked={formData.paymentMethod === "mobile"} onChange={handleChange} className="w-5 h-5 text-[#001f5f]" />
                      <div>
                        <p className="font-medium text-gray-900">Mobile Money / Paiement en ligne</p>
                        <p className="text-sm text-gray-500">Paiement sécurisé via TMoney, Flooz, Wave, etc.</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Procéder au paiement"}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-2xl border p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Formation sélectionnée</h2>
              
              <div className="mb-6">
                <img src={selectedCourse.image || "/logo.png"} alt={selectedCourse.title} className="w-full h-40 object-cover rounded-xl" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedCourse.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{selectedCourse.shortDescription}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-[#001f5f]" />
                  <span>Durée: {selectedCourse.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PlayCircle className="w-4 h-4 text-[#001f5f]" />
                  <span>Format en ligne</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total à payer</span>
                  <span className="text-2xl font-bold text-[#001f5f]">{selectedCourse.price.toLocaleString()} CFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFormation() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" /></div>}>
      <CheckoutFormationContent />
    </Suspense>
  );
}