// src/app/boutique/[id]/ProductClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Truck, Shield, RotateCcw, Check, Minus, Plus, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function ProductClient({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const { addItem } = useCartStore();

  const productImages = product.images ? JSON.parse(product.images) : (product.image ? [product.image] : []);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      {showToast && (
        <div className="fixed top-24 right-6 z-50 animate-slide-in">
          <div className="bg-white rounded-xl shadow-2xl border border-green-100 overflow-hidden max-w-sm">
            <div className="bg-green-500 px-4 py-2 flex items-center gap-2">
              <Check className="w-5 h-5 text-white" />
              <span className="font-semibold text-white">Succès</span>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Produit ajouté au panier</p>
                <p className="text-sm text-gray-500">{quantity} article(s) ajouté(s)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img src={productImages[selectedImage] || "/logo.png"} alt={product.name} className="w-full h-full object-cover" />
              {product.isNew && <span className="absolute top-4 left-4 bg-green-500 px-4 py-1 rounded-full text-sm font-semibold text-white">Nouveau</span>}
              {product.isHot && <span className="absolute top-4 right-4 bg-orange-500 px-4 py-1 rounded-full text-sm font-semibold text-white">Populaire</span>}
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img: string, index: number) => (
                  <button key={index} onClick={() => setSelectedImage(index)} className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? "border-[#001f5f] shadow-md" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{product.category}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6 text-lg">{product.description}</p>
            
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-[#001f5f]">{product.price.toLocaleString()} CFA</span>
              {product.oldPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">{product.oldPrice.toLocaleString()} CFA</span>
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              {product.inStock ? (
                <><Check className="w-5 h-5 text-green-500" /><span className="text-green-600 font-medium">En stock, prêt à être livré</span></>
              ) : (
                <span className="text-red-500 font-medium">Rupture de stock momentanée</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <div className="flex items-center border rounded-xl bg-white shadow-sm w-full sm:w-auto">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:bg-gray-50 text-gray-600 transition-colors"><Minus className="w-5 h-5" /></button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-4 hover:bg-gray-50 text-gray-600 transition-colors"><Plus className="w-5 h-5" /></button>
              </div>
              <button onClick={handleAddToCart} disabled={!product.inStock} className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50">
                <ShoppingCart className="w-6 h-6" /> Ajouter au panier
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-gray-100">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl"><Truck className="w-6 h-6 text-[#001f5f]" /><div><p className="text-sm font-bold text-gray-900">Livraison</p><p className="text-xs text-gray-500">24-48h max</p></div></div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl"><Shield className="w-6 h-6 text-[#001f5f]" /><div><p className="text-sm font-bold text-gray-900">Garantie</p><p className="text-xs text-gray-500">Qualité certifiée</p></div></div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl"><RotateCcw className="w-6 h-6 text-[#001f5f]" /><div><p className="text-sm font-bold text-gray-900">Support</p><p className="text-xs text-gray-500">Assistance 7j/7</p></div></div>
            </div>
          </div>
        </div>

        {(product.longDescription || product.description) && (
          <div className="mt-16 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b">Description complète</h2>
            <div 
              className="prose prose-lg max-w-none text-gray-600 prose-headings:text-[#001f5f] prose-a:text-[#ff5f00] editor-content"
              dangerouslySetInnerHTML={{ __html: product.longDescription || product.description }}
            />
          </div>
        )}
      </div>
    </>
  );
}
