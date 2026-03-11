// src/app/admin/presentiel/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, Image as ImageIcon, MapPin, Calendar, Clock, 
  Loader2, Plus, Trash2, X, Upload
} from "lucide-react";
import { getPresentielCourseById, updatePresentielCourse } from "@/actions/presentiel.actions";
import RichTextEditor from "@/components/RichTextEditor";

export default function EditPresentielCourse() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [course, setCourse] = useState({
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
    location: "",
    startDate: "",
    schedule: "",
    maxStudents: 20,
  });

  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [objectives, setObjectives] = useState<string[]>([]);
  const[included, setIncluded] = useState<string[]>([]);

  const categories =["Programmation", "Marketing", "Design", "Bureautique", "Réseau informatique"];
  const levels =["Débutant", "Intermédiaire", "Avancé"];

  useEffect(() => {
    const fetchCourse = async () => {
      const result = await getPresentielCourseById(courseId);
      if (result.success && result.course) {
        const c = result.course;
        setCourse({
          title: c.title,
          slug: c.slug,
          description: c.description,
          shortDescription: c.shortDescription,
          category: c.category,
          level: c.levelFrontend,
          duration: c.duration,
          price: c.price,
          isFree: c.isFree,
          image: c.image || "",
          location: c.location || "",
          // Formatage de la date pour l'input type="date" (YYYY-MM-DD)
          startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : "",
          schedule: c.schedule || "",
          maxStudents: c.maxStudents || 20,
        });
        setPrerequisites(c.prerequisites);
        setObjectives(c.objectives);
        setIncluded(c.included);
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

    const payload = {
      ...course,
      prerequisites: prerequisites.filter(p => p.trim() !== ""),
      objectives: objectives.filter(o => o.trim() !== ""),
      included: included.filter(i => i.trim() !== "")
    };

    const result = await updatePresentielCourse(courseId, payload);

    setSaving(false);

    if (result.success) {
      alert("Formation modifiée avec succès !");
      router.push("/admin/presentiel");
    } else {
      alert("Erreur lors de la modification : " + result.error);
    }
  };

  const addPrerequisite = () => setPrerequisites([...prerequisites, ""]);
  const removePrerequisite = (index: number) => setPrerequisites(prerequisites.filter((_, i) => i !== index));
  const updatePrerequisite = (index: number, value: string) => {
    const updated = [...prerequisites];
    updated[index] = value;
    setPrerequisites(updated);
  };

  const addObjective = () => setObjectives([...objectives, ""]);
  const removeObjective = (index: number) => setObjectives(objectives.filter((_, i) => i !== index));
  const updateObjective = (index: number, value: string) => {
    const updated =[...objectives];
    updated[index] = value;
    setObjectives(updated);
  };

  const addIncluded = () => setIncluded([...included, ""]);
  const removeIncluded = (index: number) => setIncluded(included.filter((_, i) => i !== index));
  const updateIncluded = (index: number, value: string) => {
    const updated = [...included];
    updated[index] = value;
    setIncluded(updated);
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
        <Link href="/admin/presentiel" className="text-[#001f5f] hover:underline mt-2 inline-block">Retour à la liste</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/presentiel"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Modifier la Formation</h1>
            <p className="text-slate-600">Mettez à jour les informations de la formation en présentiel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Informations générales</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Titre de la formation</label>
              <input
                type="text"
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description courte</label>
              <input
                type="text"
                value={course.shortDescription}
                onChange={(e) => setCourse({ ...course, shortDescription: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
              />
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
                <select
                  value={course.category}
                  onChange={(e) => setCourse({ ...course, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Niveau</label>
                <select
                  value={course.level}
                  onChange={(e) => setCourse({ ...course, level: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Durée</label>
                <input
                  type="text"
                  value={course.duration}
                  onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prix (CFA)</label>
                <input
                  type="number"
                  value={course.price}
                  onChange={(e) => setCourse({ ...course, price: Number(e.target.value), isFree: Number(e.target.value) === 0 })}
                  disabled={course.isFree}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Places max</label>
                <input
                  type="number"
                  value={course.maxStudents}
                  onChange={(e) => setCourse({ ...course, maxStudents: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Informations pratiques</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" /> Lieu
              </label>
              <input
                type="text"
                value={course.location}
                onChange={(e) => setCourse({ ...course, location: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" /> Date de début
                </label>
                <input
                  type="date"
                  value={course.startDate}
                  onChange={(e) => setCourse({ ...course, startDate: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" /> Horaires
                </label>
                <input
                  type="text"
                  value={course.schedule}
                  onChange={(e) => setCourse({ ...course, schedule: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Prérequis</h2>
            {prerequisites.map((prereq, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={prereq}
                  onChange={(e) => updatePrerequisite(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#001f5f]"
                />
                <button onClick={() => removePrerequisite(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={addPrerequisite} className="flex items-center gap-2 text-[#001f5f] hover:underline font-medium text-sm">
              <Plus className="w-4 h-4" /> Ajouter un prérequis
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Objectifs</h2>
            {objectives.map((obj, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#001f5f]"
                />
                <button onClick={() => removeObjective(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={addObjective} className="flex items-center gap-2 text-[#001f5f] hover:underline font-medium text-sm">
              <Plus className="w-4 h-4" /> Ajouter un objectif
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Inclus dans la formation</h2>
            {included.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateIncluded(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#001f5f]"
                />
                <button onClick={() => removeIncluded(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={addIncluded} className="flex items-center gap-2 text-[#001f5f] hover:underline font-medium text-sm">
              <Plus className="w-4 h-4" /> Ajouter un élément
            </button>
          </div>
        </div>

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
              <input
                type="checkbox"
                id="isFree"
                checked={course.isFree}
                onChange={(e) => setCourse({ ...course, isFree: e.target.checked, price: e.target.checked ? 0 : course.price })}
                className="w-5 h-5 text-[#001f5f] rounded"
              />
              <label htmlFor="isFree" className="font-medium text-slate-700">Formation totalement gratuite</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}