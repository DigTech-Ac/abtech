// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  GraduationCap, Users, FileText, ShoppingCart, DollarSign,
  Loader2, ArrowRight, Store, BookOpen
} from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard.actions";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const quickActions =[
  { name: "Nouvel Article", href: "/admin/posts/new", icon: FileText, color: "blue" },
  { name: "Nouveau Produit", href: "/admin/products/new", icon: ShoppingCart, color: "green" },
  { name: "Nouvelle Formation", href: "/admin/courses/new", icon: GraduationCap, color: "orange" },
];

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getDashboardStats();
      if (result.success) setData(result);
      setIsLoading(false);
    };
    fetchStats();
  },[]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Administrateur</h1>
        <p className="text-slate-600">Vue d'ensemble de votre plateforme AbTech-Digital</p>
      </div>

      {/* Stats Grid - 6 cartes réparties sur 2 lignes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{data?.stats?.users || 0}</p>
          <p className="text-sm text-slate-500">Utilisateurs Inscrits</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100">
              <GraduationCap className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{data?.stats?.courses || 0}</p>
          <p className="text-sm text-slate-500">Formations Actives</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{data?.stats?.orders || 0}</p>
          <p className="text-sm text-slate-500">Commandes Boutique</p>
        </div>

        {/* NOUVEAU : Carte Revenus Formations */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-rose-100">
              <BookOpen className="w-6 h-6 text-rose-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {(data?.stats?.courseRevenue || 0).toLocaleString()} CFA
          </p>
          <p className="text-sm text-slate-500">Revenus Formations</p>
        </div>

        {/* NOUVEAU : Carte Revenus Boutique */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-100">
              <Store className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {(data?.stats?.shopRevenue || 0).toLocaleString()} CFA
          </p>
          <p className="text-sm text-slate-500">Revenus Boutique</p>
        </div>

        {/* Carte Revenus Globaux existante */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {(data?.stats?.revenue || 0).toLocaleString()} CFA
          </p>
          <p className="text-sm text-slate-500">Revenus Globaux</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Évolution des revenus (6 derniers mois)</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#001f5f" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#001f5f" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${value}`} />
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`${value.toLocaleString()} CFA`, 'Revenus']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#001f5f" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Dernières Commandes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Commandes Récentes (Boutique)</h2>
            <Link href="/admin/products" className="text-sm text-[#001f5f] hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-4">
            {data?.recentOrders?.length > 0 ? data.recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900">{order.user?.name || "Client Anonyme"}</p>
                  <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString("fr-FR")} - {order.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#001f5f]">{order.totalAmount.toLocaleString()} CFA</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status === 'PAID' ? 'Payé' : 'En attente'}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500 text-center py-4">Aucune commande pour l'instant.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Raccourcis</h2>
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-[#001f5f] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 group-hover:bg-blue-50`}>
                    <action.icon className="w-5 h-5 text-slate-600 group-hover:text-[#001f5f]" />
                  </div>
                  <h3 className="font-medium text-slate-900">{action.name}</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#001f5f] transform group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}