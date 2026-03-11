// src/app/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { updateProfile } from "@/actions/profile.actions";
import { getSettings, updateSettings } from "@/actions/settings.actions";
import { 
  Save, Settings, User, Bell, Shield, Image as ImageIcon, Loader2 
} from "lucide-react";

const tabs =[
  { id: "general", name: "Général", icon: Settings },
  { id: "profile", name: "Profil", icon: User },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "security", name: "Sécurité", icon: Shield },
];

export default function AdminSettings() {
  const { user, checkAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // States pour les paramètres du site (Table Setting)
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "AbTech-Digital",
    siteDescription: "Agence informatique et services digitaux",
    siteUrl: "https://abtech-digital.com",
    language: "fr",
    timezone: "Africa/Abidjan",
    logoUrl: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewUser: "true",
    emailNewOrder: "true",
    emailNewsletter: "false",
  });

  // States pour le profil admin (Table User)
  const [profileSettings, setProfileSettings] = useState({
    name: "",
    email: "",
    avatar: ""
  });

  const [securitySettings, setSecuritySettings] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      // 1. Initialiser le profil utilisateur
      if (user) {
        setProfileSettings({
          name: user.name || "",
          email: user.email || "",
          avatar: user.avatar || ""
        });
      }

      // 2. Récupérer les paramètres du site
      const result = await getSettings();
      if (result.success && result.settings) {
        const s = result.settings;
        setGeneralSettings({
          siteName: s.siteName || "AbTech-Digital",
          siteDescription: s.siteDescription || "Agence informatique et services digitaux",
          siteUrl: s.siteUrl || "https://abtech-digital.com",
          language: s.language || "fr",
          timezone: s.timezone || "Africa/Abidjan",
          logoUrl: s.logoUrl || ""
        });
        setNotificationSettings({
          emailNewUser: s.emailNewUser || "true",
          emailNewOrder: s.emailNewOrder || "true",
          emailNewsletter: s.emailNewsletter || "false",
        });
      }
      setIsLoading(false);
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // SAUVEGARDE DU SITE (Si onglets Général ou Notifications)
      if (activeTab === "general" || activeTab === "notifications") {
        await updateSettings({
          ...generalSettings,
          ...notificationSettings
        });
        alert("Paramètres du site mis à jour !");
      } 
      // SAUVEGARDE DU PROFIL ADMIN (Si onglets Profil ou Sécurité)
      else if (activeTab === "profile" || activeTab === "security") {
        if (activeTab === "security" && securitySettings.newPassword !== securitySettings.confirmPassword) {
          alert("Les mots de passe ne correspondent pas !");
          setSaving(false);
          return;
        }

        const dataToUpdate: any = { ...profileSettings };
        if (securitySettings.newPassword) {
          dataToUpdate.password = securitySettings.newPassword;
        }

        const res = await updateProfile(dataToUpdate);
        if (res.success) {
          alert("Profil mis à jour avec succès !");
          setSecuritySettings({ newPassword: "", confirmPassword: "" });
          await checkAuth(); // Mettre à jour l'état global
        } else {
          alert("Erreur: " + res.error);
        }
      }
    } catch (error) {
      alert("Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
          <p className="text-slate-600">Gérez les paramètres du site et de votre compte admin</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Enregistrer
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#001f5f] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          
          {/* TAB: GENERAL */}
          {activeTab === "general" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Settings className="w-6 h-6 text-[#001f5f]" />
                <h2 className="text-xl font-semibold text-slate-900">Paramètres généraux</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nom du site</label>
                  <input type="text" value={generalSettings.siteName} onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">URL du site</label>
                  <input type="url" value={generalSettings.siteUrl} onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea rows={3} value={generalSettings.siteDescription} onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Langue</label>
                  <select value={generalSettings.language} onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fuseau horaire</label>
                  <select value={generalSettings.timezone} onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none">
                    <option value="Africa/Abidjan">Africa/Abidjan (GMT)</option>
                    <option value="Europe/Paris">Europe/Paris (CET)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-slate-700 mb-2">URL du Logo (optionnel)</label>
                <input type="url" value={generalSettings.logoUrl} onChange={(e) => setGeneralSettings({...generalSettings, logoUrl: e.target.value})} placeholder="https://..." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
              </div>
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <User className="w-6 h-6 text-[#001f5f]" />
                <h2 className="text-xl font-semibold text-slate-900">Profil administrateur</h2>
              </div>
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  {profileSettings.avatar ? (
                    <img src={profileSettings.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow" />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {profileSettings.name ? profileSettings.name.charAt(0).toUpperCase() : "A"}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">URL de l'Avatar</label>
                  <input type="url" value={profileSettings.avatar} onChange={(e) => setProfileSettings({...profileSettings, avatar: e.target.value})} placeholder="https://..." className="w-full max-w-sm px-4 py-2 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nom complet</label>
                  <input type="text" value={profileSettings.name} onChange={(e) => setProfileSettings({...profileSettings, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input type="email" value={profileSettings.email} onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Bell className="w-6 h-6 text-[#001f5f]" />
                <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-slate-900">Nouveau compte utilisateur</p>
                    <p className="text-sm text-slate-500">Recevoir un email quand un membre s'inscrit</p>
                  </div>
                  <input type="checkbox" checked={notificationSettings.emailNewUser === "true"} onChange={(e) => setNotificationSettings({...notificationSettings, emailNewUser: String(e.target.checked)})} className="w-5 h-5 text-[#001f5f] rounded" />
                </label>
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-slate-900">Nouvelle commande</p>
                    <p className="text-sm text-slate-500">Recevoir un email pour chaque commande validée</p>
                  </div>
                  <input type="checkbox" checked={notificationSettings.emailNewOrder === "true"} onChange={(e) => setNotificationSettings({...notificationSettings, emailNewOrder: String(e.target.checked)})} className="w-5 h-5 text-[#001f5f] rounded" />
                </label>
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium text-slate-900">Rapport hebdomadaire</p>
                    <p className="text-sm text-slate-500">Recevoir les statistiques de la plateforme</p>
                  </div>
                  <input type="checkbox" checked={notificationSettings.emailNewsletter === "true"} onChange={(e) => setNotificationSettings({...notificationSettings, emailNewsletter: String(e.target.checked)})} className="w-5 h-5 text-[#001f5f] rounded" />
                </label>
              </div>
            </div>
          )}

          {/* TAB: SECURITY */}
          {activeTab === "security" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Shield className="w-6 h-6 text-[#001f5f]" />
                <h2 className="text-xl font-semibold text-slate-900">Sécurité</h2>
              </div>
              <div className="space-y-4 max-w-md">
                <p className="text-sm text-slate-500 mb-4">Laissez ces champs vides si vous ne souhaitez pas modifier votre mot de passe.</p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nouveau mot de passe</label>
                  <input type="password" value={securitySettings.newPassword} onChange={(e) => setSecuritySettings({...securitySettings, newPassword: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirmer le mot de passe</label>
                  <input type="password" value={securitySettings.confirmPassword} onChange={(e) => setSecuritySettings({...securitySettings, confirmPassword: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}