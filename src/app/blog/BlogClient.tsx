// src/app/blog/BlogClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Calendar } from "lucide-react";

export default function BlogClient({ initialPosts }: { initialPosts: any[] }) {
  const[selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const categories =[
    { name: "Tous", count: initialPosts.length },
    { name: "Programmation", count: initialPosts.filter(p => p.category === "Programmation").length },
    { name: "Tutoriel", count: initialPosts.filter(p => p.category === "Tutoriel").length },
    { name: "Carrière", count: initialPosts.filter(p => p.category === "Carrière").length },
    { name: "Marketing", count: initialPosts.filter(p => p.category === "Marketing").length },
  ];

  const filteredPosts = initialPosts.filter(post => {
    const matchesCategory = selectedCategory === "Tous" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#001f5f] to-[#ff5f00]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog AbTech</h1>
          <p className="text-xl text-orange-100 max-w-2xl">Actualités, tutoriels et conseils pour votre réussite dans le digital</p>
          <div className="mt-8 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un article..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-0 focus:ring-2 focus:ring-orange-300 outline-none" 
            />
          </div>
        </div>
      </section>

      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
          {categories.map((category, index) => (
            <button 
              key={index} onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedCategory === category.name ? "bg-[#001f5f] text-white" : "bg-gray-100 text-gray-700 hover:bg-[#001f5f] hover:text-white"}`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[400px]">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">Aucun article trouvé.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img src={post.image || "/logo.png"} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-[#001f5f] px-3 py-1 rounded-full text-xs font-semibold text-white">{post.category}</div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#001f5f] to-[#ff5f00] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {post.author?.name?.charAt(0) || "A"}
                        </div>
                        <span className="text-sm text-gray-600">{post.author?.name || "Admin"}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="text-[#001f5f] font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                        Lire <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}