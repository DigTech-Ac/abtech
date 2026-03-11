// src/app/formations/page.tsx
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormationsClient from "./FormationsClient";
import { getPublicPresentielCourses } from "@/actions/presentiel.actions";

export const metadata: Metadata = {
  title: "Toutes nos Formations | AbTech-Digital",
  description: "Découvrez notre catalogue complet de formations pour exceller dans le digital.",
};

export default async function FormationsPage() {
  const result = await getPublicPresentielCourses();
  const courses = result.success && result.courses ? result.courses : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <FormationsClient initialCourses={courses} />
      </main>
      <Footer />
    </div>
  );
}
