// src/app/formations/FormationsClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Calendar, ArrowRight, Search, GraduationCap } from "lucide-react";

const categories =["Tous", "Programmation", "Marketing", "Design", "Tutoriel", "Bureautique", "Réseau informatique"];

export default function FormationsClient({ initialCourses }: { initialCourses: any[] }) {
  const[selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = initialCourses.filter(course => {
    const matchesCategory = selectedCategory === "Tous" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.shortDescription && course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#001f5f] to-[#ff5f00]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Toutes nos Formations
          </h1>
          <p className="text-xl text-orange-100 max-w-2xl">
            Développez vos compétences avec nos formations. Accompagnement sur-mesure pour exceller dans le digital.
          </p>
          
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher une formation..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border-0 focus:ring-2 focus:ring-orange-300 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
          {categories.map((category) => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category ? "bg-[#001f5f] text-white" : "bg-gray-100 text-gray-700 hover:bg-[#001f5f] hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[500px]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col">
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  <img src={course.image || "/logo.png"} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#001f5f] px-3 py-1 rounded-full text-xs font-semibold text-white">{course.category}</span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{course.shortDescription}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{course.location?.split(',')[0] || 'En ligne / Présentiel'}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t mt-auto">
                    <div>
                      {course.isFree ? (
                        <span className="text-2xl font-bold text-green-600">Gratuit</span>
                      ) : (
                        <span className="text-2xl font-bold text-[#001f5f]">{course.price.toLocaleString()} CFA</span>
                      )}
                    </div>
                    <Link 
                      href={course.isPresentiel ? `/inscription-presentiel?course=${course.id}` : `/checkout-formation?course=${course.id}`}
                      className="bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                      S'inscrire
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune formation trouvée</h3>
              <p className="text-gray-600">Essayez avec d'autres critères de recherche.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
