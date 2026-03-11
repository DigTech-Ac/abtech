"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, Search, Edit, Trash2, Eye, Package, Laptop, Smartphone, 
  Wifi, Tv, Headphones, Gamepad2, Loader2
} from "lucide-react";
import { getAdminProducts, deleteProduct } from "@/actions/product.actions";
import { useToastStore } from "@/store/toast";
import ConfirmModal from "@/components/ConfirmModal";

const categories =["Tous", "Ordinateurs", "Téléphones", "Réseau", "TV & Multimédia", "Accessoires", "Gaming"];

const categoryIcons: Record<string, React.ElementType> = {
  "Ordinateurs": Laptop,
  "Téléphones": Smartphone,
  "Réseau": Wifi,
  "TV & Multimédia": Tv,
  "Accessoires": Headphones,
  "Gaming": Gamepad2,
};

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    fetchProducts();
  },[]);

  const fetchProducts = async () => {
    setIsLoading(true);
    const result = await getAdminProducts();
    if (result.success && result.products) {
      setProducts(result.products);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    const result = await deleteProduct(productToDelete);
    if (result.success) {
      setProducts(products.filter(p => p.id !== productToDelete));
      showToast("Produit supprimé avec succès !", "success");
    } else {
      showToast("Erreur lors de la suppression : " + result.error, "error");
    }
    setProductToDelete(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Produits</h1>
          <p className="text-slate-600">Gérez vos produits de la boutique</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouveau Produit
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => {
              const Icon = categoryIcons[category] || Package;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-[#001f5f] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category !== "Tous" && <Icon className="w-4 h-4" />}
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#001f5f]" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Produit</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Catégorie</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Prix</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Stock</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Statut</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-16 h-12 rounded-lg object-cover bg-gray-100" />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-gray-200 flex items-center justify-center"><Package className="w-6 h-6 text-gray-400"/></div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 line-clamp-1">{product.name}</p>
                        <p className="text-sm text-slate-500 line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-medium text-slate-900">{product.price.toLocaleString()} CFA</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {product.inStock ? "En stock" : "Rupture"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {product.isNew && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Nouveau</span>
                      )}
                      {product.isHot && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Populaire</span>
                      )}
                      {!product.isNew && !product.isHot && (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/boutique/${product.id}`} target="_blank" className="p-2 text-slate-600 hover:text-[#001f5f] hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link href={`/admin/products/${product.id}`} className="p-2 text-slate-600 hover:text-[#001f5f] hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button onClick={() => setProductToDelete(product.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Aucun produit trouvé</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
        confirmText="Supprimer"
        type="danger"
      />
    </div>
  );
}