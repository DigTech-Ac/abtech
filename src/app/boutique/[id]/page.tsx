// src/app/boutique/[id]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductClient from "./ProductClient";
import { getProductById } from "@/actions/product.actions";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getProductById(id);
  
  if (!result.success || !result.product) {
    return { title: "Produit non trouvé | AbTech Boutique" };
  }
  
  return {
    title: `${result.product.name} | AbTech Boutique`,
    description: result.product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  
  const result = await getProductById(id);
  const product = result.success ? result.product : null;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Produit introuvable</h2>
            <Link href="/boutique" className="text-[#001f5f] hover:underline font-medium text-lg">Retour à la boutique</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Navbar />
      
      <div className="bg-white border-b pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/boutique" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#001f5f] font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à la boutique
          </Link>
        </div>
      </div>

      <main className="flex-1">
        <ProductClient product={product} />
      </main>
      
      <Footer />
    </div>
  );
}
