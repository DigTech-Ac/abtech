// src/app/admin/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  Users,
  GraduationCap,
  Download,
  Loader2
} from "lucide-react";
import { getAnalyticsData, getDashboardStats } from "@/actions/dashboard.actions";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAnalytics() {
  const[data, setData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Appel des deux actions en parallèle
      const[analyticsResult, statsResult] = await Promise.all([
        getAnalyticsData(),
        getDashboardStats()
      ]);

      if (analyticsResult.success) setData(analyticsResult);
      if (statsResult.success) setChartData(statsResult.chartData);
      
      setIsLoading(false);
    };
    fetchData();
  },[]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600">Statistiques détaillées et performances</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#001f5f] text-white rounded-xl text-sm font-medium hover:bg-[#001a4d]">
            <Download className="w-4 h-4" />
            Exporter PDF
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Formations les plus populaires</h2>
            <GraduationCap className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {data?.topCourses?.map((course: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 line-clamp-1">{course.course}</p>
                  <p className="text-sm text-slate-500">{course.students} étudiants inscrits</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#001f5f]">{course.revenue.toLocaleString()} CFA</p>
                </div>
              </div>
            ))}
            {data?.topCourses?.length === 0 && (
              <p className="text-center text-sm text-slate-500">Aucune inscription pour le moment.</p>
            )}
          </div>
        </div>

        {/* Recent Inscriptions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Inscriptions récentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">Étudiant</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">Formation</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">Date</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentInscriptions?.map((inscription: any, index: number) => (
                  <tr key={index}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-slate-600" />
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{inscription.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-600 line-clamp-1">{inscription.course}</td>
                    <td className="py-4 text-sm text-slate-500">{inscription.date}</td>
                    <td className="py-4 text-sm text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`font-semibold ${inscription.amount > 0 ? 'text-[#001f5f]' : 'text-green-600'}`}>
                          {inscription.amount > 0 ? `${inscription.amount.toLocaleString()} CFA` : 'Gratuit'}
                        </span>
                        {!inscription.isPaid && inscription.amount > 0 && (
                          <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                            Non payé
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.recentInscriptions?.length === 0 && (
              <p className="text-center text-sm text-slate-500 mt-4">Aucune inscription récente.</p>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Graphique détaillé des revenus</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDetailedRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff5f00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff5f00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${value}`} />
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`${value.toLocaleString()} CFA`, 'Revenus Globaux']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#ff5f00" strokeWidth={3} fillOpacity={1} fill="url(#colorDetailedRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}