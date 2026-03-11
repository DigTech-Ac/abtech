// src/app/boutique/BoutiqueClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Package, Laptop, Smartphone, Wifi, Tv, Headphones, Gamepad2, Code } from "lucide-react";
import { useCartStore } from "@/store/cart";

const categories =[
  { name: "Tous", icon: Package },
  { name: "Ordinateurs", icon: Laptop },
  { name: "Téléphones", icon: Smartphone },
  { name: "Réseau", icon: Wifi },
  { name: "TV & Multimédia", icon: Tv },
  { name: "Accessoires", icon: Headphones },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Produits Digitaux", icon: Code },
];

export default function BoutiqueClient({ initialProducts }: { initialProducts: any[] }) {
  const { addItem } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [showToast, setShowToast] = useState(false);

  const filteredProducts = initialProducts.filter(product => {
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const addToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); 
    addItem(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      {showToast && (
        <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in">
          Produit ajouté au panier !
        </div>
      )}

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#001f5f] to-[#ff5f00]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Notre Boutique</h1>
          <p className="text-xl text-orange-100 max-w-2xl">
            Découvrez notre sélection de produits informatiques et équipements réseau de qualité
          </p>
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher un produit..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border-0 focus:ring-2 focus:ring-orange-300 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <button 
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.name ? "bg-[#001f5f] text-white" : "bg-gray-100 text-gray-700 hover:bg-[#001f5f] hover:text-white"
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[400px]">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/boutique/${product.id}`} className="block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group h-full flex flex-col">
                    <div className="relative h-56 overflow-hidden">
                      <img src={product.image || "/logo.png"} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-gray-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        {product.isNew && <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-semibold text-white">Nouveau</span>}
                        {product.isHot && <span className="bg-orange-500 px-3 py-1 rounded-full text-xs font-semibold text-white">Populaire</span>}
                      </div>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">Rupture de stock</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-xs text-[#001f5f] font-medium">{product.category}</span>
                      <h3 className="font-bold text-gray-900 mt-1 mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">{product.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t mt-auto">
                        <div>
                          <span className="text-xl font-bold text-[#001f5f]">{product.price.toLocaleString()} CFA</span>
                          {product.oldPrice && <span className="text-sm text-gray-400 line-through ml-2">{product.oldPrice.toLocaleString()} CFA</span>}
                        </div>
                        <button onClick={(e) => addToCart(e, product)} disabled={!product.inStock} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white rounded-full text-sm font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                          <ShoppingCart className="w-4 h-4" /> Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
