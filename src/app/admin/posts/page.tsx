"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, FileText, Calendar, User, Loader2 } from "lucide-react";
import { getAdminPosts, deletePost } from "@/actions/post.actions";

const categories =["Tous", "Programmation", "Tutoriel", "Carrière", "Marketing", "Design", "Bureautique"];

export default function AdminBlog() {
  const[searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  },[]);

  const fetchPosts = async () => {
    setIsLoading(true);
    const result = await getAdminPosts();
    if (result.success && result.posts) {
      setPosts(result.posts);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      const result = await deletePost(id);
      if (result.success) {
        setPosts(posts.filter(p => p.id !== id));
      } else {
        alert("Erreur lors de la suppression : " + result.error);
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Articles</h1>
          <p className="text-slate-600">Gérez vos articles de blog</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouvel Article
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#001f5f] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#001f5f]" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Article</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Catégorie</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Auteur</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Date</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Statut</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={post.image || "/logo.png"} alt={post.title} className="w-16 h-12 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <p className="font-medium text-slate-900 line-clamp-1">{post.title}</p>
                        <p className="text-sm text-slate-500 line-clamp-1">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-sm text-slate-700">{post.author?.name || "Admin"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.status === "PUBLISHED" 
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {post.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-slate-600 hover:text-[#001f5f] hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link href={`/admin/posts/${post.id}`} className="p-2 text-slate-600 hover:text-[#001f5f] hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Aucun article trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}