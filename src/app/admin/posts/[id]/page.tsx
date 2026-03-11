"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, Eye, Loader2, X } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { getPostById, updatePost } from "@/actions/post.actions";

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  const [post, setPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Programmation",
    image: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
  });

  const categories =["Programmation", "Marketing", "Design", "Tutoriel", "Bureautique", "Carrière"];

  useEffect(() => {
    const fetchPost = async () => {
      const result = await getPostById(postId);
      if (result.success && result.post) {
        setPost({
          title: result.post.title,
          slug: result.post.slug,
          excerpt: result.post.excerpt || "",
          content: result.post.content,
          category: result.post.category,
          image: result.post.image || "",
          status: result.post.status,
        });
      }
      setLoading(false);
    };
    fetchPost();
  }, [postId]);

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    if (!post.title || !post.content) {
      alert("Le titre et le contenu sont requis.");
      return;
    }
    setSaving(true);
    
    const result = await updatePost(postId, { ...post, status });
    
    setSaving(false);
    if (result.success) {
      alert(status === "PUBLISHED" ? "Article mis à jour et publié !" : "Brouillon enregistré !");
      router.push("/admin/posts");
    } else {
      alert("Erreur: " + result.error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("L'image est trop grande (Max 2 Mo).");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (data.success) {
        setPost({ ...post, image: data.url });
      } else {
        alert("Erreur d'upload : " + data.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Échec de la connexion lors de l'upload.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" />
      </div>
    );
  }

  if (!post.title) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Article non trouvé</h2>
        <Link href="/admin/posts" className="text-[#001f5f] hover:underline">
          Retour aux articles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Modifier l'article</h1>
            <p className="text-slate-600">Éditez les informations de l'article</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setPreview(!preview)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
            <Eye className="w-5 h-5" /> Aperçu
          </button>
          <button onClick={() => handleSave("DRAFT")} disabled={saving} className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">
            <Save className="w-5 h-5" /> {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button onClick={() => handleSave("PUBLISHED")} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50">
            <Upload className="w-5 h-5" /> Publier
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Titre de l'article</label>
              <input type="text" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Slug (URL)</label>
              <input type="text" value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Excerpt (Résumé)</label>
              <textarea rows={3} value={post.excerpt} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contenu</label>
              <RichTextEditor value={post.content} onChange={(content) => setPost({ ...post, content })} placeholder="Écrivez votre article ici..." />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
              <select value={post.category} onChange={(e) => setPost({ ...post, category: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Image de couverture</label>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input 
                  type="url" 
                  value={post.image} 
                  onChange={(e) => setPost({ ...post, image: e.target.value })} 
                  placeholder="URL de l'image" 
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" 
                />
                <div className="relative flex-1">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <div className="flex items-center justify-center gap-2 h-full px-4 py-3 border-2 border-dashed border-[#001f5f] text-[#001f5f] rounded-xl hover:bg-blue-50 transition-colors">
                    <Upload className="w-5 h-5" /> Importer du PC
                  </div>
                </div>
              </div>
              {post.image && (
                <div className="relative inline-block">
                  <img src={post.image} alt="Preview" className="w-full h-40 object-cover rounded-xl border shadow-sm" />
                  <button 
                    type="button" 
                    onClick={() => setPost({ ...post, image: "" })} 
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Statut Actuel</label>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {post.status === "PUBLISHED" ? "Publié" : "Brouillon"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}