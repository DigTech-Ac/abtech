import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublishedPosts } from "@/actions/post.actions";
import BlogClient from "./BlogClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Blog | AbTech-Digital",
  description: "Découvrez les derniers articles, tutoriels et conseils d'AbTech-Digital pour votre réussite dans le digital. Programmation, marketing, carrière et bien plus.",
};

export default async function BlogPage() {
  const result = await getPublishedPosts();
  const posts = result.success && result.posts ? result.posts : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <BlogClient initialPosts={posts} />
      </main>
      <Footer />
    </div>
  );
}
