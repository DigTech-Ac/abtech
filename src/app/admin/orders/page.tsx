// src/app/admin/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, Eye, MapPin, Package, Phone, X } from "lucide-react";
import { getAdminOrders, updateOrderStatus } from "@/actions/order.actions";

// Les différents statuts avec leurs couleurs et labels en français
const STATUSES = {
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Payé", color: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "Expédié", color: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Livré", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Annulé", color: "bg-red-100 text-red-700" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  },[]);

  const fetchOrders = async () => {
    setIsLoading(true);
    const result = await getAdminOrders();
    if (result.success && result.orders) {
      setOrders(result.orders);
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus as any);
    if (result.success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const filteredOrders = orders.filter(o => 
    o.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gestion des Commandes</h1>
        <p className="text-slate-600">Suivez et mettez à jour le statut des commandes de la boutique.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un client ou un N° de commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#001f5f]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-4">Commande</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-4">Client</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-4">Date</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-4">Montant</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-4">Statut</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase px-6 py-4">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-[#001f5f]">ORD-{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{order.user.name}</p>
                      <p className="text-xs text-slate-500">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {order.totalAmount.toLocaleString()} CFA
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border-0 cursor-pointer outline-none ${STATUSES[order.status as keyof typeof STATUSES].color}`}
                      >
                        {Object.entries(STATUSES).map(([key, val]) => (
                          <option key={key} value={key} className="bg-white text-slate-900">{val.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-slate-600 hover:text-[#001f5f] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-slate-500">Aucune commande trouvée.</div>
            )}
          </div>
        )}
      </div>

      {/* Modal des détails de la commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">
                Commande ORD-{selectedOrder.id.slice(-6).toUpperCase()}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-[#001f5f]" /> Adresse de livraison
                  </h3>
                  <p className="text-sm text-slate-600">{selectedOrder.shippingAddress}</p>
                  <p className="text-sm text-slate-600">{selectedOrder.city}, {selectedOrder.country}</p>
                  <p className="text-sm text-slate-600 mt-2 flex items-center gap-2"><Phone className="w-3 h-3"/> {selectedOrder.phone}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-[#001f5f]" /> Informations
                  </h3>
                  <p className="text-sm text-slate-600"><strong>Méthode:</strong> {selectedOrder.paymentMethod === 'cash' ? 'À la livraison' : 'Mobile Money'}</p>
                  <p className="text-sm text-slate-600 mt-1"><strong>Statut actuel:</strong> {STATUSES[selectedOrder.status as keyof typeof STATUSES].label}</p>
                  {selectedOrder.notes && (
                    <p className="text-sm text-slate-600 mt-2"><strong>Note:</strong> {selectedOrder.notes}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3 border-b pb-2">Articles commandés ({selectedOrder.items.length})</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img src={item.product.image || "/logo.png"} alt={item.product.name} className="w-12 h-12 rounded object-cover border" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-slate-900">{item.product.name}</p>
                        <p className="text-xs text-slate-500">{item.price.toLocaleString()} CFA x {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm text-[#001f5f]">{(item.price * item.quantity).toLocaleString()} CFA</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center text-lg font-bold">
                  <span>Total Payé</span>
                  <span className="text-[#ff5f00]">{selectedOrder.totalAmount.toLocaleString()} CFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}