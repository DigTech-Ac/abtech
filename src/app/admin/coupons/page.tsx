// src/app/admin/coupons/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Trash2, Loader2, Tag, Percent, DollarSign, 
  Calendar, Users, Edit2, X, Check
} from "lucide-react";
import { getAdminCoupons, createCoupon, deleteCoupon, toggleCouponStatus } from "@/actions/coupon.actions";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    maxUses: "",
    expiresAt: ""
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const result = await getAdminCoupons();
    if (result.success) {
      setCoupons(result.coupons || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) {
      alert("Le code et la valeur de la réduction sont requis.");
      return;
    }

    setSaving(true);
    const result = await createCoupon(formData);
    setSaving(false);

    if (result.success) {
      alert("Coupon créé avec succès !");
      setShowModal(false);
      setFormData({ code: "", discountType: "PERCENTAGE", discountValue: "", maxUses: "", expiresAt: "" });
      fetchCoupons();
    } else {
      alert("Erreur : " + result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce coupon ?")) {
      await deleteCoupon(id);
      fetchCoupons();
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await toggleCouponStatus(id, !currentStatus);
    fetchCoupons();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Codes Promo</h1>
          <p className="text-slate-600">Gérez vos codes de réduction</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouveau Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Code</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Type</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Valeur</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Utilisation</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Expiration</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Statut</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#001f5f]" />
                    <span className="font-semibold text-slate-900">{coupon.code}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    coupon.discountType === "PERCENTAGE" 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {coupon.discountType === "PERCENTAGE" ? "Pourcentage" : "Montant fixe"}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {coupon.discountType === "PERCENTAGE" 
                    ? `${coupon.discountValue}%` 
                    : `${coupon.discountValue.toLocaleString()} CFA`}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{coupon.usedCount} / {coupon.maxUses || "∞"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {coupon.expiresAt 
                    ? new Date(coupon.expiresAt).toLocaleDateString("fr-FR")
                    : <span className="text-slate-400">Pas d'expiration</span>}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(coupon.id, coupon.isActive)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      coupon.isActive 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {coupon.isActive ? "Actif" : "Inactif"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {coupons.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Aucun coupon pour le moment.</p>
          </div>
        )}
      </div>

      {/* Modal de création */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Nouveau Coupon</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Code Promo</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="EXEMPLE20"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type de réduction</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none"
                  >
                    <option value="PERCENTAGE">Pourcentage (%)</option>
                    <option value="FIXED">Montant fixe (CFA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Valeur</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === "PERCENTAGE" ? "20" : "5000"}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Utilisation max</label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    placeholder="100 (laisser vide pour illimité)"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expiration</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Créer le coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
