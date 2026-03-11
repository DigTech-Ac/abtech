// src/app/checkout/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { 
  ShoppingCart, ArrowLeft, CreditCard, MapPin, User, Loader2, AlertCircle, Tag, Check, X
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { createOrder } from "@/actions/order.actions";
import { initializePayment } from "@/actions/payment.actions";
import { validateCoupon } from "@/actions/coupon.actions";
import { calculateDiscount } from "@/lib/discount";

export default function Checkout() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Vérifier le type de produits dans le panier
  const hasPhysicalItems = items.some(item => !item.product.isDigital);
  const isOnlyDigital = items.length > 0 && items.every(item => item.product.isDigital);

  const[formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "TOGO",
    paymentMethod: isOnlyDigital ? "mobile" : "mobile",
    notes: ""
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = getTotal();
  const shipping = !hasPhysicalItems ? 0 : (subtotal > 500000 ? 0 : 5000);
  const discount = appliedCoupon ? calculateDiscount(appliedCoupon, subtotal) : 0;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError("");
    
    const result = await validateCoupon(couponCode);
    
    if (result.success && result.coupon) {
      setAppliedCoupon(result.coupon);
    } else {
      setCouponError(result.error || "Code promo invalide");
      setAppliedCoupon(null);
    }
    setApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData,[e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const result = await createOrder(formData, items, appliedCoupon?.code);

    if (!result.success || !result.order) {
      setErrorMsg(result.error || "Une erreur est survenue lors de la commande.");
      setIsSubmitting(false);
      return;
    }

    const orderReference = `ORD-${result.order.id}`;

    if (formData.paymentMethod === "mobile") {
      const paymentResult = await initializePayment({
        amount: total,
        email: formData.email,
        reference: orderReference,
        description: `Commande Boutique AbTech (${items.length} articles)`,
        redirectUrl: `/order-success?ref=${orderReference}&method=mobile`
      });

      if (!paymentResult.success) {
        setErrorMsg(paymentResult.error || "Erreur de la plateforme de paiement.");
        setIsSubmitting(false);
        return;
      }
      window.location.href = paymentResult.paymentUrl!;
    } else {
      router.push(`/order-success?ref=${orderReference}&method=cash`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
          <Link href="/boutique" className="text-[#001f5f] hover:underline">Retour à la boutique</Link>
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
          <Link href="/boutique" className="flex items-center gap-2 text-gray-600 hover:text-[#001f5f] font-medium flex-shrink-0">
            <ArrowLeft className="w-4 h-4" /> Retour au panier
          </Link>
          </div>
        </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {errorMsg}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations Client */}
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#001f5f]" /> Informations personnelles
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none" />
                  </div>
                </div>
              </div>

              {/* Adresse de Livraison */}
              {hasPhysicalItems && (
                <div className="bg-white rounded-2xl border p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#001f5f]" /> Adresse de livraison
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète</label>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} required={hasPhysicalItems} className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} required={hasPhysicalItems} className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                        <select name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none">
                          <option>TOGO</option><option>Côte d'Ivoire</option><option>Bénin</option><option>Sénégal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode de paiement */}
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#001f5f]" /> Mode de paiement
                </h2>
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${formData.paymentMethod === 'mobile' ? 'border-[#001f5f] bg-blue-50' : 'hover:border-[#001f5f]'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="paymentMethod" value="mobile" checked={formData.paymentMethod === "mobile"} onChange={handleChange} className="w-5 h-5 text-[#001f5f]" />
                      <div><p className="font-medium text-gray-900">Mobile Money / Carte</p><p className="text-sm text-gray-500">Tmoney, Flooz, Visa, Mastercard</p></div>
                    </div>
                  </label>
                  
                  {/* S'il y a des produits physiques, on propose le paiement à la livraison */}
                  {hasPhysicalItems && (
                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${formData.paymentMethod === 'cash' ? 'border-[#001f5f] bg-blue-50' : 'hover:border-[#001f5f]'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === "cash"} onChange={handleChange} className="w-5 h-5 text-[#001f5f]" />
                        <div><p className="font-medium text-gray-900">Paiement à la livraison</p><p className="text-sm text-gray-500">Payez en espèces lorsque vous recevez le colis</p></div>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg disabled:opacity-50 flex justify-center items-center gap-2">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirmer la commande"}
              </button>
            </form>
          </div>

          {/* Panier résumé */}
          <div>
            <div className="bg-white rounded-2xl border p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Récapitulatif</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img src={item.product.image || "/logo.png"} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.product.price.toLocaleString()} CFA x {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#001f5f]">{(item.product.price * item.quantity).toLocaleString()} CFA</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Sous-total</span><span className="font-medium">{subtotal.toLocaleString()} CFA</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Livraison</span><span className="font-medium">{shipping === 0 ? "Gratuite" : `${shipping.toLocaleString()} CFA`}</span></div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Réduction</span>
                    <span className="font-medium">-{discount.toLocaleString()} CFA</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t"><span>Total</span><span className="text-[#001f5f]">{total.toLocaleString()} CFA</span></div>
              </div>
              
              {/* Code Promo */}
              <div className="mt-4 pt-4 border-t">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-700">{appliedCoupon.code}</span>
                      <span className="text-sm text-green-600">
                        ({appliedCoupon.discountType === "PERCENTAGE" ? `-${appliedCoupon.discountValue}%` : `-${appliedCoupon.discountValue} CFA`})
                      </span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-green-700 hover:bg-green-100 p-1 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code promo</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Entrez votre code"
                          className="w-full pl-10 pr-4 py-2 border rounded-xl focus:border-[#001f5f] outline-none text-sm"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-[#001f5f] text-white rounded-xl text-sm font-medium hover:bg-[#001a4d] disabled:opacity-50"
                      >
                        {applyingCoupon ? "..." : "Appliquer"}
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}