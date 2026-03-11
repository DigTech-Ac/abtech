"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { LogOut, User as UserIcon, LayoutDashboard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuthButtons() {
  const { user, isAuthenticated, logout, isLoading } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().checkAuth();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  if (!mounted) {
    return <div className="w-24 h-8 bg-gray-100 animate-pulse rounded-full"></div>;
  }

  if (isLoading && !user) {
    return <Loader2 className="w-6 h-6 animate-spin text-[#001f5f]" />;
  }

  if (isAuthenticated && user) {
    // On force la comparaison en majuscules pour éviter les erreurs de saisie en BDD
    const role = user.role.toUpperCase();
    const dashboardLink = (role === 'ADMIN' || role === 'MODERATOR') 
      ? '/admin' 
      : '/dashboard-etudiant';

    return (
      <div className="flex items-center gap-3">
        {/* Lien Dashboard */}
        <Link 
          href={dashboardLink} 
          className="flex items-center gap-2 bg-[#001f5f]/10 text-[#001f5f] px-4 py-2 rounded-full font-semibold hover:bg-[#001f5f] hover:text-white transition-all text-sm"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Mon espace</span>
        </Link>
        
        {/* Lien Profil */}
        <Link 
          href="/profil"
          className="p-2 text-gray-600 hover:text-[#001f5f] bg-gray-100 rounded-full transition-colors"
          title="Mon Profil"
        >
          <UserIcon className="w-5 h-5" />
        </Link>

        {/* Bouton Déconnexion */}
        <button 
          onClick={handleLogout}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all"
          title="Se déconnecter"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Si l'utilisateur n'est PAS connecté
  return (
    <div className="flex items-center gap-3">
      <Link href="/login" className="text-[#001f5f] hover:text-[#ff5f00] font-semibold transition-colors text-sm">
        Connexion
      </Link>
      <Link href="/register" className="bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg transition-all">
        Commencer
      </Link>
    </div>
  );
}