// src/app/cours-presentiel/CoursPresentielClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, Clock, Users, Award, Monitor, Palette, TrendingUp, Smartphone, Shield, Wifi, Star, Laptop } from "lucide-react";

const categoryIcons: Record<string, any> = {
  "Programmation": Monitor,
  "Marketing": TrendingUp,
  "Design": Palette,
  "Bureautique": Laptop,
  "Réseau informatique": Wifi,
  "default": Award
};

const testimonials = [
  { name: "Kouadio Jean", role: "Développeur Web", content: "Excellent parcours de formation ! J'ai pu créer ma propre entreprise après la formation en Web Design.", rating: 5 },
  { name: "Aminata Touré", role: "Graphiste Freelance", content: "La formation en Design Graphique m'a donné toutes les compétences nécessaires pour travailler en freelance.", rating: 5 },
  { name: "Konan Patrick", role: "Technicien Réseau", content: "Formation complète en Mikrotik. Je gère maintenant le réseau de mon entreprise.", rating: 5 },
  { name: "Fatou Diallo", role: "Community Manager", content: "Le marketing digital m'a ouvert les portes du monde professionnel. Recommandée à 100%!", rating: 5 },
];

const videoTestimonials = [
  { name: "Témoignage de Mohamed - Formation Web Design", videoId: "dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop" },
  { name: "Témoignage de Sarah - Formation Design Graphique", videoId: "dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop" },
  { name: "Témoignage de Luc - Formation Réseau Mikrotik", videoId: "dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=250&fit=crop" },
  { name: "Témoignage de Marie - Formation Marketing Digital", videoId: "dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=250&fit=crop" },
];

export default function CoursPresentielClient({ initialCourses }: { initialCourses: any[] }) {
  const courses = initialCourses || [];

  return (
    <>
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#001f5f] to-[#ff5f00]">
        <div className="max-w-7xl mx-auto">
          <Link href="/#cours" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour aux cours
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cours en Présentiel</h1>
          <p className="text-xl text-orange-100 max-w-2xl">
            Formez-vous dans nos locaux avec des formateurs expérimentés. Une approche pratique pour acquérir des compétences concrètes.
          </p>
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2 text-white"><Clock className="w-5 h-5" /><span>Accompagnement physique</span></div>
            <div className="flex items-center gap-2 text-white"><Users className="w-5 h-5" /><span>Formateurs experts</span></div>
            <div className="flex items-center gap-2 text-white"><Award className="w-5 h-5" /><span>Certification de fin</span></div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[500px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Formations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Des formations pratiques et adaptées au marché de l'emploi</p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] mx-auto mt-4"></div>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Aucune formation en présentiel disponible pour le moment.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => {
                const Icon = categoryIcons[course.category] || categoryIcons["default"];
                return (
                  <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      {course.image && <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-[#001f5f]">{course.levelFrontend}</div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-[#001f5f]" /></div>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{course.shortDescription || course.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.maxStudents ? `${course.maxStudents} max` : "Illimité"}</span>
                      </div>
                      <div className="pt-4 border-t flex flex-col gap-3 mt-auto">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm font-medium">Frais d'inscription:</span>
                          {course.isFree ? <span className="text-lg font-bold text-green-600">Gratuit</span> : <span className="text-lg font-bold text-[#001f5f]">{course.price.toLocaleString()} CFA</span>}
                        </div>
                        <Link href={`/inscription-presentiel?course=${course.id}`} className="w-full bg-gradient-to-r from-[#001f5f] to-[#ff5f00] hover:from-[#ff5f00] hover:to-[#001f5f] text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2">
                          S'inscrire maintenant <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Témoignages</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Ce que disent nos apprenants</p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />))}
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#001f5f] to-[#ff5f00] rounded-full flex items-center justify-center text-white font-bold text-sm">{testimonial.name.charAt(0)}</div>
                  <div><h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4><p className="text-gray-500 text-xs">{testimonial.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Écouter Nos Apprenants</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Découvrez en vidéo les témoignages de nos anciens apprenants</p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {videoTestimonials.map((video, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-64 bg-gray-200">
                  <img src={video.thumbnail} alt={video.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"><Play className="w-8 h-8 text-[#001f5f] ml-1" /></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-semibold">{video.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#001f5f] to-[#ff5f00]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à commencer votre formation ?</h2>
          <p className="text-orange-100 text-lg mb-8">Inscrivez-vous dès maintenant et lancez-vous dans une carrière prometteuse.</p>
          <Link href="/formations" className="inline-flex items-center gap-2 bg-white text-[#001f5f] px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-xl">
            Voir le catalogue complet <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
