// src/app/admin/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Image as ImageIcon, Loader2, Plus, X, Upload } from "lucide-react";
import { getProductById, updateProduct, deleteProduct } from "@/actions/product.actions";
import RichTextEditor from "@/components/RichTextEditor";

const categories =["Ordinateurs", "Téléphones", "Réseau", "TV & Multimédia", "Accessoires", "Gaming", "Produits Digitaux"];

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const[formData, setFormData] = useState({
    name: "",
    description: "",
    longDescription: "",
    price: "",
    oldPrice: "",
    image: "",
    images: [] as string[],
    category: "Ordinateurs",
    inStock: true,
    isNew: false,
    isHot: false,
    isDigital: false,
    fileUrl: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const result = await getProductById(productId);
      if (result.success && result.product) {
        setFormData({
          name: result.product.name,
          description: result.product.description,
          longDescription: result.product.longDescription || "",
          price: result.product.price.toString(),
          oldPrice: result.product.oldPrice?.toString() || "",
          image: result.product.image || "",
          images: result.product.images ? JSON.parse(result.product.images) :[],
          category: result.product.category,
          inStock: result.product.inStock,
          isNew: result.product.isNew,
          isHot: result.product.isHot,
          isDigital: result.product.isDigital || false,
          fileUrl: result.product.fileUrl || ""
        });
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await updateProduct(productId, formData);
    setIsSubmitting(false);

    if (result.success) {
      alert("Produit modifié avec succès !");
      router.push("/admin/products");
    } else {
      alert("Erreur: " + result.error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      await deleteProduct(productId);
      router.push("/admin/products");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
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
        if (index === undefined) {
          setFormData((prev) => ({ ...prev, image: data.url }));
        } else {
          setFormData((prev) => {
            const newImages = [...(prev.images || [])];
            newImages[index] = data.url;
            return { ...prev, images: newImages };
          });
        }
      } else {
        alert("Erreur d'upload : " + data.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Échec de la connexion lors de l'upload.");
    }
  };

  const addExtraImage = () => setFormData({ ...formData, images: [...formData.images, ""] });
  const removeExtraImage = (index: number) => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  const updateExtraImageStr = (index: number, val: string) => {
    const newImages = [...formData.images];
    newImages[index] = val;
    setFormData({ ...formData, images: newImages });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-slate-600" /></Link>
          <h1 className="text-2xl font-bold text-slate-900">Modifier le produit</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={handleDelete} className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50"><Trash2 className="w-5 h-5" /> Supprimer</button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Enregistrer
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Informations générales</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-2">Nom du produit *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none" /></div>
              <div><label className="block text-sm font-medium mb-2">Description courte *</label><textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-4 py-3 border rounded-xl focus:border-[#001f5f] outline-none" /></div>
              <div><label className="block text-sm font-medium mb-2">Description longue</label>
                <RichTextEditor 
                  value={formData.longDescription} 
                  onChange={(content) => setFormData({ ...formData, longDescription: content })} 
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Images du produit</h2>
            <div className="mb-6 border-b pb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Image principale</label>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="URL de l'image" className="flex-1 px-4 py-3 border rounded-xl outline-none" />
                <div className="relative flex-1">
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="flex items-center justify-center gap-2 h-full px-4 py-3 border-2 border-dashed border-[#001f5f] text-[#001f5f] rounded-xl"><Upload className="w-5 h-5" /> Importer du PC</div>
                </div>
              </div>
              {formData.image && <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-xl border" />}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-bold text-slate-700">Images supplémentaires</label>
                <button type="button" onClick={addExtraImage} className="flex items-center gap-1 text-sm text-[#001f5f] font-medium"><Plus className="w-4 h-4" /> Ajouter une image</button>
              </div>
              <div className="space-y-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="p-4 bg-slate-50 border rounded-xl">
                    <div className="flex gap-4 mb-3">
                      <input type="url" value={img} onChange={(e) => updateExtraImageStr(index, e.target.value)} className="flex-1 px-4 py-2 border rounded-lg outline-none" />
                      <div className="relative"><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, index)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /><div className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"><Upload className="w-4 h-4" /></div></div>
                      <button type="button" onClick={() => removeExtraImage(index)} className="px-3 text-red-500 hover:bg-red-50 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                    {img && <img src={img} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Prix et stock</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-2">Prix (CFA) *</label><input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl outline-none" /></div>
              <div><label className="block text-sm font-medium mb-2">Ancien prix (CFA)</label><input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl outline-none" /></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="text-lg font-semibold mb-6">Catégorie</h2>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl outline-none">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="text-lg font-semibold mb-6">Statut</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border rounded-xl cursor-pointer"><span>En stock</span><input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-5 h-5 text-[#001f5f] rounded" /></label>
              <label className="flex items-center justify-between p-3 border rounded-xl cursor-pointer"><span>Nouveau</span><input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="w-5 h-5 text-[#001f5f] rounded" /></label>
              <label className="flex items-center justify-between p-3 border rounded-xl cursor-pointer"><span>Populaire</span><input type="checkbox" name="isHot" checked={formData.isHot} onChange={handleChange} className="w-5 h-5 text-[#001f5f] rounded" /></label>
              <label className="flex items-center justify-between p-3 border rounded-xl cursor-pointer"><span>Produit Digital</span><input type="checkbox" name="isDigital" checked={formData.isDigital} onChange={handleChange} className="w-5 h-5 text-[#001f5f] rounded" /></label>
              {formData.isDigital && (
                <div className="pt-3 border-t mt-2">
                  <label className="block text-sm font-medium mb-2">Lien du fichier</label>
                  <input type="url" name="fileUrl" value={formData.fileUrl} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none" />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
