"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Save,
  Trash2,
  Eye,
  User,
  Mail,
  Shield
} from "lucide-react";

const sampleUsers: Record<string, any> = {
  "1": { id: "1", name: "Admin Principal", email: "admin@abtech.com", role: "admin", avatar: null, createdAt: "2025-01-01", status: "active" },
  "2": { id: "2", name: "Jean Kouadio", email: "jean@abtech.com", role: "instructor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", createdAt: "2025-01-15", status: "active" },
  "3": { id: "3", name: "Marie Touré", email: "marie@abtech.com", role: "instructor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", createdAt: "2025-02-01", status: "active" },
  "4": { id: "4", name: "Sophie Martin", email: "sophie@abtech.com", role: "student", avatar: null, createdAt: "2025-03-10", status: "active" },
  "5": { id: "5", name: "Patrick Konan", email: "patrick@abtech.com", role: "student", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", createdAt: "2025-03-15", status: "inactive" },
  "6": { id: "6", name: "Aminata Diallo", email: "aminata@abtech.com", role: "student", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop", createdAt: "2025-04-01", status: "active" },
  "7": { id: "7", name: "Michel Yao", email: "michel@abtech.com", role: "user", avatar: null, createdAt: "2025-04-10", status: "active" },
};

const roles = [
  { value: "admin", label: "Administrateur" },
  { value: "instructor", label: "Formateur" },
  { value: "student", label: "Étudiant" },
  { value: "user", label: "Utilisateur" }
];

export default function EditUser() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active"
  });

  useEffect(() => {
    setTimeout(() => {
      const userData = sampleUsers[userId];
      if (userData) {
        setUser({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: userData.status
        });
      }
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Utilisateur modifié avec succès !");
      router.push("/admin/users");
    }, 1000);
  };

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      alert("Utilisateur supprimé avec succès !");
      router.push("/admin/users");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#001f5f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!sampleUsers[userId]) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Utilisateur non trouvé</p>
        <Link href="/admin/users" className="text-[#001f5f] hover:underline mt-2 inline-block">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Modifier l'utilisateur</h1>
            <p className="text-slate-600">Modifiez les informations de l'utilisateur</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Supprimer
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Informations personnelles</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nom complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Paramètres</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Shield className="w-4 h-4 inline mr-2" />
                Rôle
              </label>
              <select
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
              <select
                value={user.status}
                onChange={(e) => setUser({ ...user, status: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
