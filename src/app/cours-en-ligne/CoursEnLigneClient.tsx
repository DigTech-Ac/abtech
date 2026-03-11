// src/app/cours-en-ligne/CoursEnLigneClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, Play, Clock, 
  Monitor, Palette, Globe, TrendingUp, 
  Wifi, BookOpen, Laptop
} from "lucide-react";

const categoryIcons: Record<string, any> = {
  "Programmation": Monitor,
  "Marketing": TrendingUp,
  "Design": Palette,
  "Bureautique": Laptop,
  "Tutoriel": BookOpen,
  "Réseau informatique": Wifi,
  "default": Play
};

const categories = ["Tous", "Programmation", "Marketing", "Design", "Bureautique", "Réseau informatique"];

export default function CoursEnLigneClient({ 
  initialCourses, 
  paidCourseIds = [] 
}: { 
  initialCourses: any[], 
  paidCourseIds?: string[] 
}) {
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredCourses = initialCourses.filter(course => {
    return selectedCategory === "Tous" || course.category === selectedCategory;
  });

  return (
    <>
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-[#001f5f]">
        <div className="max-w-7xl mx-auto">
          <Link href="/#cours" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour aux cours
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cours en Ligne</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Apprenez à votre rythme où que vous soyez. Accédez à nos formations certifiantes depuis chez vous.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[500px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">Aucune formation disponible dans cette catégorie.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => {
                const Icon = categoryIcons[course.category] || categoryIcons["default"];
                const hasPaid = paidCourseIds.includes(course.id);
                
                return (
                  <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img src={course.image || "/logo.png"} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-[#001f5f]">
                        {course.level}
                      </div>
                      {course.isFree ? (
                        <div className="absolute top-4 left-4 bg-green-500 px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                          <Play className="w-3 h-3" /> Gratuit
                        </div>
                      ) : (
                        <div className="absolute top-4 left-4 bg-blue-600 px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                          <Play className="w-3 h-3" /> EN LIGNE
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#001f5f]" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-3">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{course.shortDescription || course.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{course._count?.lessons || 0} leçons</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          {course.isFree ? (
                            <span className="text-2xl font-bold text-green-600">Gratuit</span>
                          ) : (
                            <span className="text-2xl font-bold text-[#001f5f]">{course.price.toLocaleString()} CFA</span>
                          )}
                        </div>

                        {hasPaid ? (
                          <Link 
                            href={`/formations/${course.id}`} 
                            className="bg-green-600 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-green-700 transition-all"
                          >
                            Suivre <Play className="w-4 h-4 fill-current" />
                          </Link>
                        ) : (
                          <Link 
                            href={`/checkout-formation?course=${course.id}`} 
                            className="bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2"
                          >
                            Acheter <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
