"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  FileText,
  Edit3,
  BookOpen,
  Globe,
  Shield,
  Bell,
  Building2,
  Loader2,
  ShoppingCart,
  History
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import Toast from "@/components/Toast";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Articles", href: "/admin/posts", icon: FileText },
  { name: "Produits", href: "/admin/products", icon: Package },
  { name: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { name: "Formations en ligne", href: "/admin/courses", icon: BookOpen },
  { name: "Formations présentielles", href: "/admin/presentiel", icon: Building2 },
  { name: "Utilisateurs", href: "/admin/users", icon: Users },
  { name: "Contenu", href: "/admin/content", icon: Edit3 },
  { name: "Audit Logs", href: "/admin/logs", icon: History },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin' && user.role !== 'moderator') {
        router.push('/dashboard-etudiant');
      }
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'moderator': return 'Modérateur';
      default: return 'Utilisateur';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast />
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-[#001f5f] to-[#001540] transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-3 h-16 px-6 border-b border-white/10">
          <div className="w-10 h-10 bg-gradient-to-r from-[#ff5f00] to-[#ff8c00] rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">Admin</span>
            <p className="text-xs text-orange-300">AbTech-Digital</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            if (item.name === "Audit Logs" && user?.role?.toUpperCase() !== "ADMIN") {
              return null;
            }
            const isExact = pathname === item.href;
            const isSubPath = item.href !== "/admin" && pathname.startsWith(item.href + "/");
            const isActive = isExact || isSubPath;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive 
                    ? "bg-gradient-to-r from-[#ff5f00] to-[#ff8c00] text-white shadow-lg shadow-orange-500/25" 
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors mb-2"
          >
            <Globe className="w-5 h-5" />
            Voir le site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 lg:flex-none">
            <h1 className="text-lg font-semibold text-slate-900">
              {navigation.find(n => {
                const isExact = pathname === n.href;
                const isSubPath = n.href !== "/admin" && pathname.startsWith(n.href + "/");
                return isExact || isSubPath;
              })?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] rounded-full flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-slate-500">{getRoleLabel(user?.role || 'user')}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
