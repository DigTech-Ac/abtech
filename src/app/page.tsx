// src/app/page.tsx
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeClient from "./HomeClient";
import { getSiteContent } from "@/actions/content.actions";
import { getPublicCourses } from "@/actions/course.actions";
import { getUserPaidCourseIds } from "@/actions/student.actions";

export const metadata: Metadata = {
  title: "AbTech-Digital - Agence Informatique & Services Digitaux",
  description: "Nous aidons les particuliers et entreprises à créer des solutions numériques modernes et efficaces en Afrique.",
};

export default async function HomePage() {
  const [contentResult, coursesResult, paidIds] = await Promise.all([
    getSiteContent(),
    getPublicCourses(),
    getUserPaidCourseIds()
  ]);

  const content = contentResult.success ? contentResult.content : null;
  const recentCourses = coursesResult.success && coursesResult.courses 
    ? coursesResult.courses.slice(0, 4) 
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HomeClient initialContent={content} initialRecentCourses={recentCourses} paidCourseIds={paidIds} />
      </main>
      <Footer />
    </div>
  );
}
