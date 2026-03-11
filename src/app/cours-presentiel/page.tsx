// src/app/cours-presentiel/page.tsx
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoursPresentielClient from "./CoursPresentielClient";
import { getPublicPresentielCourses } from "@/actions/presentiel.actions";

export const metadata: Metadata = {
  title: "Formations en Présentiel | AbTech-Digital",
  description: "Formez-vous dans nos locaux avec des formateurs experts et un accompagnement sur-mesure.",
};

export default async function CoursPresentielPage() {
  const result = await getPublicPresentielCourses();
  const courses = result.success && result.courses ? result.courses : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CoursPresentielClient initialCourses={courses} />
      </main>
      <Footer />
    </div>
  );
}
