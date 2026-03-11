// src/app/a-propos/page.tsx
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AProposClient from "./AProposClient";
import { getSiteContent } from "@/actions/content.actions";

export const metadata: Metadata = {
  title: "À Propos | AbTech-Digital",
  description: "Découvrez notre agence, notre mission et notre vision pour la transformation digitale en Afrique.",
};

export default async function AboutPage() {
  const result = await getSiteContent();
  const content = result.success ? result.content : null;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <AProposClient initialContent={content} />
      </main>
      <Footer />
    </div>
  );
}
