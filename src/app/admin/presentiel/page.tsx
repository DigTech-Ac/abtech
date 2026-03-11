// src/app/admin/presentiel/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, Search, Edit, Trash2, Eye, Building2, Clock, Users, 
  MapPin, Calendar, DollarSign, CheckCircle, Loader2
} from "lucide-react";
import { getAdminPresentielCourses, deletePresentielCourse } from "@/actions/presentiel.actions";

const categories =["Tous", "Programmation", "Marketing", "Design", "Bureautique", "Réseau informatique"];

export default function AdminPresentiel() {
  const [searchQuery, setSearchQuery] = useState("");
  const[selectedCategory, setSelectedCategory] = useState("Tous");
  
  // Nouveaux states pour la base de données
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchCourses();
  },[]);

  const fetchCourses = async () => {
    setIsLoading(true);
    const result = await getAdminPresentielCourses();
    if (result.success && result.courses) {
      setCourses(result.courses);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      const result = await deletePresentielCourse(id);
      if (result.success) {
        // Mise à jour de l'UI en retirant le cours supprimé
        setCourses(courses.filter(c => c.id !== id));
      } else {
        alert("Erreur lors de la suppression : " + result.error);
      }
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calcul des statistiques
  const totalInscrits = courses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0);
  const totalPayantes = courses.filter(c => !c.isFree).length;
  const totalGratuites = courses.filter(c => c.isFree).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Formations en Présentiel</h1>
          <p className="text-slate-600">Gérez vos formations en présentiel</p>
        </div>
        <Link
          href="/admin/presentiel/new"
          className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Formation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{courses.length}</p>
              <p className="text-sm text-slate-500">Total formations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalInscrits}</p>
              <p className="text-sm text-slate-500">Inscrits</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalPayantes}</p>
              <p className="text-sm text-slate-500">Payantes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalGratuites}</p>
              <p className="text-sm text-slate-500">Gratuites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#001f5f] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#001f5f]" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 bg-gray-100">
                {course.image && (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-[#001f5f] text-white px-2 py-1 rounded text-xs font-medium">
                    {course.category}
                  </span>
                  {course.isFree && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Gratuit
                    </span>
                  )}
                </div>
                {/* Niveau - Adapté depuis le Backend (qui renvoie le vrai nom ex: "BEGINNER") ou transformé dans la vue publique */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                    {course.level === "BEGINNER" ? "Débutant" : course.level === "INTERMEDIATE" ? "Intermédiaire" : "Avancé"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.shortDescription}</p>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {course.location?.split(',')[0] || 'Non spécifié'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  Début: {course.startDate ? new Date(course.startDate).toLocaleDateString("fr-FR") : "À définir"}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className={`text-lg font-bold ${course.isFree ? 'text-green-600' : 'text-[#001f5f]'}`}>
                      {course.isFree ? "Gratuit" : `${course.price.toLocaleString()} CFA`}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      {course._count?.enrollments || 0}/{course.maxStudents || "∞"} places
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/cours-presentiel/${course.id}`} // Lien public
                      className="p-2 text-slate-600 hover:text-[#001f5f] hover:bg-blue-50 rounded-lg transition-colors"
                      target="_blank"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/presentiel/${course.id}`}
                      className="p-2 text-slate-600 hover:text-[#001f5f] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!isLoading && filteredCourses.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucune formation en présentiel trouvée</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}