"use client";

import { useEffect, useState } from "react";
import { getActivityLogs } from "@/actions/activity.actions";
import { useAuthStore } from "@/store/auth";
import { Loader2, History, User, Tag, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role.toUpperCase() !== "ADMIN") {
      router.push("/admin");
      return;
    }

    const fetchLogs = async () => {
      const data = await getActivityLogs();
      setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, [user, router]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Journal d'Audit</h1>
        <p className="text-slate-600">Historique complet des actions effectuées sur la plateforme.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  log.action === 'DELETE' ? 'bg-red-100 text-red-600' : 
                  log.action === 'CREATE' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    <span className="font-bold text-[#001f5f]">{log.user?.name}</span> {log.details}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3"/> {log.user?.role}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3"/> {log.target}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(log.createdAt).toLocaleString("fr-FR")}</span>
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                log.action === 'DELETE' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {log.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
