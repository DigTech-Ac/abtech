"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Users, Shield, CheckCircle, Mail, Loader2, User as UserIcon } from "lucide-react";
import { getAdminUsers, createUser, deleteUser } from "@/actions/user.actions";

const roles =["Tous", "ADMIN", "MODERATOR", "INSTRUCTOR", "STUDENT", "USER"];

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700",
  MODERATOR: "bg-orange-100 text-orange-700",
  INSTRUCTOR: "bg-blue-100 text-blue-700",
  STUDENT: "bg-green-100 text-green-700",
  USER: "bg-slate-100 text-slate-700"
};

const roleLabels: Record<string, string> = {
  ADMIN: "Administrateur",
  MODERATOR: "Modérateur",
  INSTRUCTOR: "Formateur",
  STUDENT: "Étudiant",
  USER: "Utilisateur"
};

export default function AdminUsers() {
  const[searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tous");
  const[users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const[isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "USER" });

  useEffect(() => {
    fetchUsers();
  },[]);

  const fetchUsers = async () => {
    setIsLoading(true);
    const result = await getAdminUsers();
    if (result.success && result.users) {
      setUsers(result.users);
    }
    setIsLoading(false);
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) return alert("Veuillez remplir tous les champs");
    setIsSubmitting(true);
    
    const result = await createUser(newUser);
    if (result.success) {
      setUsers([result.user, ...users]);
      setShowModal(false);
      setNewUser({ name: "", email: "", role: "USER" });
      alert("Utilisateur ajouté ! Mot de passe par défaut : passer123");
    } else {
      alert("Erreur: " + result.error);
    }
    setIsSubmitting(false);
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "Tous" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Utilisateurs</h1>
          <p className="text-slate-600">Gérez les utilisateurs de la plateforme</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" /> Nouvel Utilisateur
        </button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div>
          <div><p className="text-2xl font-bold text-slate-900">{users.length}</p><p className="text-sm text-slate-500">Total utilisateurs</p></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><Shield className="w-6 h-6 text-green-600" /></div>
          <div><p className="text-2xl font-bold text-slate-900">{users.filter(u => u.role === 'ADMIN').length}</p><p className="text-sm text-slate-500">Administrateurs</p></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {roles.map((role) => (
              <button key={role} onClick={() => setSelectedRole(role)} className={`px-4 py-2 rounded-xl font-medium transition-colors ${selectedRole === role ? "bg-[#001f5f] text-white" : "bg-slate-100 text-slate-700"}`}>
                {role === "Tous" ? "Tous" : roleLabels[role]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#001f5f]" /></div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-4">Utilisateur</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-4">Rôle</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-4">Inscrit le</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center"><UserIcon className="w-5 h-5 text-slate-600" /></div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <div className="flex items-center gap-1 text-sm text-slate-500"><Mail className="w-3 h-3" />{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>{roleLabels[user.role]}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Nouvel Utilisateur</h3>
            <div className="space-y-4">
              <div><label className="block text-sm mb-2">Nom complet</label><input type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full px-4 py-3 border rounded-xl" /></div>
              <div><label className="block text-sm mb-2">Email</label><input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full px-4 py-3 border rounded-xl" /></div>
              <div><label className="block text-sm mb-2">Rôle</label><select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full px-4 py-3 border rounded-xl"><option value="USER">Utilisateur</option><option value="STUDENT">Étudiant</option><option value="INSTRUCTOR">Formateur</option><option value="ADMIN">Administrateur</option></select></div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 border rounded-xl">Annuler</button>
              <button onClick={handleAddUser} disabled={isSubmitting} className="flex-1 bg-[#001f5f] text-white rounded-xl">{isSubmitting ? "..." : "Ajouter"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}