// src/app/profil/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import Logo from "@/components/Logo";
import { User, Mail, Lock, Image as ImageIcon, Loader2, Save, ArrowLeft } from "lucide-react";
import { updateProfile } from "@/actions/profile.actions";
import AuthButtons from "@/components/AuthButtons";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    newPassword: "",
    avatar: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const[message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      checkAuth();
    }
  }, [mounted, isAuthenticated, checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || ""
      }));
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    const dataToUpdate: any = {
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar
    };

    if (formData.newPassword) {
      dataToUpdate.password = formData.newPassword;
    }

    const result = await updateProfile(dataToUpdate);

    if (result.success) {
      setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
      setFormData(prev => ({ ...prev, newPassword: "" }));
      await checkAuth();
    } else {
      setMessage({ type: "error", text: result.error || "Une erreur est survenue." });
    }
    
    setIsSubmitting(false);
  };

  // Permet de retourner au bon dashboard selon le rôle
  const dashboardLink = user.role === 'admin' || user.role === 'moderator' 
    ? '/admin' 
    : '/dashboard-etudiant';

  return (
    <div className="min-h-screen font-sans bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex-1 min-w-0 flex justify-start">
            <Logo className="w-[700px] max-w-full h-auto" />
          </div>
          <nav className="hidden md:flex items-center gap-6 flex-shrink-0 mr-4">
            <Link href="/" className="text-gray-700 hover:text-[#001f5f] font-medium">Accueil</Link>
            <Link href="/formations" className="text-gray-700 hover:text-[#001f5f] font-medium">Formations</Link>
            <Link href="/boutique" className="text-gray-700 hover:text-[#001f5f] font-medium">Boutique</Link>
          </nav>
          <AuthButtons />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <Link href={dashboardLink} className="inline-flex items-center gap-2 text-slate-600 hover:text-[#001f5f] mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Retour à mon espace
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#001f5f] to-[#ff5f00] px-8 py-10 text-center">
            <div className="relative inline-block mb-4">
              {formData.avatar ? (
                <img src={formData.avatar} alt={formData.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white text-[#001f5f] flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-orange-100">{user.role === 'admin' ? 'Administrateur' : user.role === 'student' ? 'Étudiant' : 'Utilisateur'}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {message.text && (
              <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">Informations personnelles</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Avatar (URL de l'image)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">Sécurité</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Laisser vide pour ne pas changer"
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#001f5f] hover:bg-[#001a4d] text-white px-8 py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}