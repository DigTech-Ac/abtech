// src/app/admin/courses/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, Trash2, Image as ImageIcon, Video, FileText, 
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Loader2, Plus, X, Upload
} from "lucide-react";
import { getCourseById, updateCourse, deleteCourse } from "@/actions/course.actions";
import RichTextEditor from "@/components/RichTextEditor";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  isFree: boolean;
  videoUrl: string;
  content: string;
}

const categories =["Programmation", "Marketing", "Design", "Tutoriel", "Bureautique", "Réseau informatique"];
const levels =["Débutant", "Intermédiaire", "Avancé"];

export default function EditCourse() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const[course, setCourse] = useState({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    category: "Programmation",
    level: "Débutant",
    duration: "",
    price: 0,
    isFree: false,
    image: "",
  });

  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      const result = await getCourseById(courseId);
      if (result.success && result.course) {
        const c = result.course;
        setCourse({
          title: c.title,
          slug: c.slug,
          description: c.description,
          shortDescription: c.shortDescription || "",
          category: c.category,
          level: c.level === "BEGINNER" ? "Débutant" : c.level === "INTERMEDIATE" ? "Intermédiaire" : "Avancé",
          duration: c.duration,
          price: c.price,
          isFree: c.isFree,
          image: c.image || "",
        });
        
        const formattedLessons = (c.lessons || []).map((l: any) => ({
          id: l.id || String(Math.random()),
          title: l.title || "",
          duration: l.duration || "",
          isFree: l.isFree || false,
          videoUrl: l.videoUrl || "",
          content: l.content || ""
        }));
        
        setLessons(formattedLessons);
      }
      setLoading(false);
    };
    fetchCourse();
  }, [courseId]);

  const handleSave = async () => {
    if (!course.title || !course.description) {
      alert("Le titre et la description sont requis.");
      return;
    }
    setSaving(true);

    const result = await updateCourse(courseId, course, lessons);
    
    setSaving(false);
    
    if (result.success) {
      alert("Formation modifiée avec succès !");
      router.push("/admin/courses");
    } else {
      alert("Erreur: " + result.error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      await deleteCourse(courseId);
      alert("Formation supprimée !");
      router.push("/admin/courses");
    }
  };

  const addLesson = () => {
    setLessons([...lessons, { 
      id: String(Date.now()), 
      title: "", 
      duration: "10 min", 
      isFree: false,
      videoUrl: "",
      content: ""
    }]);
  };

  const removeLesson = (id: string) => {
    setLessons(lessons.filter(l => l.id !== id));
  };

  const updateLesson = (id: string, field: string, value: any) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("L'image est trop grande (Max 2 Mo).");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (data.success) {
        setCourse({ ...course, image: data.url });
      } else {
        alert("Erreur d'upload : " + data.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Échec de la connexion lors de l'upload.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" />
      </div>
    );
  }

  if (!course.title) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Formation non trouvée</p>
        <Link href="/admin/courses" className="text-[#001f5f] hover:underline mt-2 inline-block">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Modifier la Formation</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleDelete} className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors">
            <Trash2 className="w-5 h-5" /> Supprimer
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Enregistrer
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Formulaire Général */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Informations générales</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Titre</label>
              <input type="text" value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description courte</label>
              <input type="text" value={course.shortDescription} onChange={(e) => setCourse({ ...course, shortDescription: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description complète</label>
              <RichTextEditor 
                value={course.description} 
                onChange={(content) => setCourse({ ...course, description: content })} 
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                <select value={course.category} onChange={(e) => setCourse({ ...course, category: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none">
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Niveau</label>
                <select value={course.level} onChange={(e) => setCourse({ ...course, level: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none">
                  {levels.map((level) => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Durée</label>
                <input type="text" value={course.duration} onChange={(e) => setCourse({ ...course, duration: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prix (en FCFA)</label>
                <input type="number" value={course.price} onChange={(e) => setCourse({ ...course, price: Number(e.target.value), isFree: Number(e.target.value) === 0 })} disabled={course.isFree} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none disabled:bg-slate-100" />
              </div>
            </div>
          </div>

          {/* Formulaire Leçons */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Leçons ({lessons.length})</h2>
              <button onClick={addLesson} className="flex items-center gap-2 px-4 py-2 bg-[#001f5f] text-white rounded-lg text-sm font-medium hover:bg-[#001a4d]">
                <Plus className="w-4 h-4" /> Ajouter une leçon
              </button>
            </div>
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="p-4 bg-slate-50 rounded-xl space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-[#001f5f] text-white rounded-lg flex items-center justify-center text-sm font-medium">{index + 1}</span>
                    <input type="text" value={lesson.title} onChange={(e) => updateLesson(lesson.id, "title", e.target.value)} placeholder="Titre de la leçon" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    <input type="text" value={lesson.duration} onChange={(e) => updateLesson(lesson.id, "duration", e.target.value)} placeholder="Durée" className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={lesson.isFree} onChange={(e) => updateLesson(lesson.id, "isFree", e.target.checked)} className="w-4 h-4 text-[#001f5f] rounded" /> Gratuit
                    </label>
                    <button onClick={() => removeLesson(lesson.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-4 ml-12">
                    <Video className="w-4 h-4 text-slate-400" />
                    <input type="url" value={lesson.videoUrl || ""} onChange={(e) => updateLesson(lesson.id, "videoUrl", e.target.value)} placeholder="URL de la vidéo" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulaire Image & Options */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="mb-6 border-b pb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Image de couverture</label>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input 
                  type="url" 
                  value={course.image} 
                  onChange={(e) => setCourse({ ...course, image: e.target.value })} 
                  placeholder="URL de l'image (https://...)" 
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none" 
                />
                <div className="relative flex-1">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <div className="flex items-center justify-center gap-2 h-full px-4 py-3 border-2 border-dashed border-[#001f5f] text-[#001f5f] rounded-xl hover:bg-blue-50 transition-colors">
                    <Upload className="w-5 h-5" /> Importer du PC
                  </div>
                </div>
              </div>
              {course.image && (
                <div className="relative inline-block">
                  <img src={course.image} alt="Preview" className="w-32 h-32 object-cover rounded-xl border shadow-sm" />
                  <button 
                    type="button" 
                    onClick={() => setCourse({ ...course, image: "" })} 
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <input type="checkbox" id="isFree" checked={course.isFree} onChange={(e) => setCourse({ ...course, isFree: e.target.checked, price: e.target.checked ? 0 : course.price })} className="w-5 h-5 text-[#001f5f] rounded" />
              <label htmlFor="isFree" className="font-medium text-slate-700">Formation gratuite</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}