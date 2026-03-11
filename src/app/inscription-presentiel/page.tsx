// src/app/inscription-presentiel/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { 
  GraduationCap,
  ArrowLeft,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Building,
  Loader2
} from "lucide-react";
import { getPublicPresentielCourses } from "@/actions/presentiel.actions";

function InscriptionForm() {
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get("course");

  const[courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    cours: courseIdParam || "",
    message: ""
  });
  
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await getPublicPresentielCourses();
      if (result.success && result.courses) {
        setCourses(result.courses);
        // On vérifie que l'ID passé dans l'URL correspond bien à un cours existant
        if (courseIdParam && result.courses.some(c => c.id === courseIdParam)) {
          setFormData(prev => ({ ...prev, cours: courseIdParam }));
        }
      }
      setIsLoading(false);
    };
    fetchCourses();
  }, [courseIdParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, plus tard, on pourra connecter une Server Action pour envoyer un email 
    // ou sauvegarder la demande dans la base de données.
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Inscription envoyée !</h2>
            <p className="text-gray-600 text-lg mb-8">
              Merci pour votre inscription. Notre équipe va vous contacter dans les plus brefs délais pour finaliser votre inscription et vous donner les informations sur le démarrage de votre formation en présentiel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-8 py-3 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/25">
                Retour à l'accueil
              </Link>
              <Link href="/formations" className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                Voir les formations
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/formations" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#001f5f] mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Retour aux formations
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#001f5f] to-[#ff5f00] px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Inscription - Cours en Présentiel</h1>
            <p className="text-orange-100 mt-2">Remplissez le formulaire ci-dessous pour vous inscrire à nos formations en présentiel</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nom *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-orange-200 outline-none transition"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Prénom *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-orange-200 outline-none transition"
                    placeholder="Votre prénom"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-orange-200 outline-none transition"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Téléphone *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="telephone"
                    required
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-orange-200 outline-none transition"
                    placeholder="+228 90 56 50 86"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Formation souhaitée *</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="cours"
                  required
                  value={formData.cours}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-orange-200 outline-none transition appearance-none bg-white"
                >
                  <option value="">Sélectionnez une formation</option>
                  {isLoading ? (
                    <option value="" disabled>Chargement des formations...</option>
                  ) : (
                    courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} - {course.price.toLocaleString()} CFA ({course.duration})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-2">Message (optionnel)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#001f5f] focus:ring-2 focus:ring-orange-200 outline-none transition"
                placeholder="Des questions ou commentaires ?"
              />
            </div>

            {/* Affiche dynamiquement les infos du cours sélectionné s'il existe */}
            {formData.cours && courses.find(c => c.id === formData.cours) && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#001f5f]" />
                  Informations pratiques
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#001f5f]" />
                    <span>Lieu: {courses.find(c => c.id === formData.cours)?.location || "Nous consulter"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#001f5f]" />
                    <span>Horaires: {courses.find(c => c.id === formData.cours)?.schedule || "Nous consulter"}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#001f5f] to-[#ff5f00] hover:from-[#ff5f00] hover:to-[#001f5f] text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-orange-500/25"
            >
              Envoyer ma demande d'inscription
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              En soumettant ce formulaire, vous acceptez que nous vous contactions pour votre inscription.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function InscriptionPresentiel() {
  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50 w-full h-20 flex items-center">
        <div className="w-full flex items-center justify-between">
          <div className="flex-shrink-0">
            <Logo className="w-[700px] h-auto" />
          </div>
        </div>
      </header>

      {/* 
        On wrap le formulaire dans un Suspense car on utilise useSearchParams
        qui est une API côté client et qui bloque le rendu statique de la page sans Suspense 
      */}
      <Suspense fallback={
        <div className="pt-32 pb-16 px-4 flex justify-center items-center h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" />
        </div>
      }>
        <InscriptionForm />
      </Suspense>
    </div>
  );
}