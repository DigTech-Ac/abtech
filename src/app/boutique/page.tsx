// src/app/boutique/page.tsx
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BoutiqueClient from "./BoutiqueClient";
import { getPublicProducts } from "@/actions/product.actions";

export const metadata: Metadata = {
  title: "Boutique | AbTech-Digital",
  description: "Découvrez notre sélection d'ordinateurs, équipements réseau, logiciels et accessoires informatiques au Togo.",
};

export default async function BoutiquePage() {
  const result = await getPublicProducts();
  const products = result.success && result.products ? result.products : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <BoutiqueClient initialProducts={products} />
      </main>
      <Footer />
    </div>
  );
}
