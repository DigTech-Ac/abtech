"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, BookOpen, Clock, DollarSign, CheckCircle, Loader2 } from "lucide-react";
import { getAdminCourses, deleteCourse } from "@/actions/course.actions";
import { useToastStore } from "@/store/toast";
import ConfirmModal from "@/components/ConfirmModal";

const categories =["Tous", "Programmation", "Marketing", "Design", "Tutoriel", "Bureautique", "Réseau informatique"];

export default function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    fetchCourses();
  },[]);

  const fetchCourses = async () => {
    setIsLoading(true);
    const result = await getAdminCourses();
    if (result.success && result.courses) {
      setCourses(result.courses);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    const result = await deleteCourse(courseToDelete);
    if (result.success) {
      setCourses(courses.filter(c => c.id !== courseToDelete));
      showToast("Formation supprimée avec succès !", "success");
    } else {
      showToast("Erreur: " + result.error, "error");
    }
    setCourseToDelete(null);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Formations en Ligne</h1>
          <p className="text-slate-600">Gérez vos formations vidéos</p>
        </div>
        <Link href="/admin/courses/new" className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" />
          Nouvelle Formation
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  selectedCategory === category ? "bg-[#001f5f] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#001f5f]" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 bg-gray-100">
                {course.image && <img src={course.image} alt={course.title} className="w-full h-full object-cover" />}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-[#001f5f] text-white px-2 py-1 rounded text-xs font-medium">{course.category}</span>
                  {course.isFree && <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">Gratuit</span>}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.shortDescription}</p>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{course._count?.lessons || 0} leçons</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className={`text-lg font-bold ${course.isFree ? 'text-green-600' : 'text-[#001f5f]'}`}>
                    {course.isFree ? "Gratuit" : `${course.price.toLocaleString()} CFA`}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link href={`/formations/${course.id}`} className="p-2 text-slate-600 hover:text-[#001f5f] hover:bg-blue-50 rounded-lg">
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link href={`/admin/courses/${course.id}`} className="p-2 text-slate-600 hover:text-[#001f5f] hover:bg-blue-50 rounded-lg">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => setCourseToDelete(course.id)} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucune formation trouvée</p>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible."
        confirmText="Supprimer"
        type="danger"
      />
    </div>
  );
}