// src/app/cours-en-ligne/page.tsx
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoursEnLigneClient from "./CoursEnLigneClient";
import { getPublicCourses } from "@/actions/course.actions";
import { getUserPaidCourseIds } from "@/actions/student.actions";

export const metadata: Metadata = {
  title: "Cours en Ligne | AbTech-Digital",
  description: "Formez-vous aux métiers du numérique avec nos cours en ligne certifiants (Développement web, Design, Marketing...).",
};

export default async function CoursEnLignePage() {
  const [result, paidIds] = await Promise.all([
    getPublicCourses(),
    getUserPaidCourseIds()
  ]);
  
  const courses = result.success && result.courses ? result.courses : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CoursEnLigneClient initialCourses={courses} paidCourseIds={paidIds} />
      </main>
      <Footer />
    </div>
  );
}
