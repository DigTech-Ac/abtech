import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogShare from "@/components/BlogShare";
import { ArrowLeft, Calendar, User, Eye } from "lucide-react";
import { getPostBySlug } from "@/actions/post.actions";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostBySlug(slug);
  
  if (!result.success || !result.post) {
    return { title: "Article non trouvé | AbTech-Digital" };
  }

  return {
    title: `${result.post.title} | Blog AbTech`,
    description: result.post.excerpt || "Lisez cet article sur le blog AbTech-Digital.",
    openGraph: {
      title: result.post.title,
      description: result.post.excerpt || "",
      images: result.post.image ? [result.post.image] : [],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const result = await getPostBySlug(slug);
  const post = result.success ? result.post : null;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
            <Link href="/blog" className="text-[#001f5f] hover:underline">Retour au blog</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1">
        <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#001f5f] to-[#ff5f00]">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour au blog
            </Link>
            <br/>
            <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium">{post.author?.name || "Admin"}</p>
                  <p className="text-sm text-white/60">Auteur</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views} vues</span>
              </div>
            </div>
          </div>
        </section>

        {post.image && (
          <section className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto -mt-8">
              <img src={post.image} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-xl bg-white" />
            </div>
          </section>
        )}

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-8 italic border-l-4 border-[#001f5f] pl-4">
                  {post.excerpt}
                </p>
              )}
              
              <div 
                className="prose prose-lg max-w-none prose-headings:text-[#001f5f] prose-a:text-[#ff5f00] editor-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <BlogShare title={post.title} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
