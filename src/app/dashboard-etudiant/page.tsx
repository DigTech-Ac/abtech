// src/app/dashboard-etudiant/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { 
  GraduationCap, Clock, Play, CheckCircle, Circle, ArrowLeft, ArrowRight, 
  Menu, X, BookOpen, TrendingUp, Award, Loader2, Download, Package, ShoppingBag
} from "lucide-react";
import AuthButtons from "@/components/AuthButtons";
import { getStudentDashboardData, markLessonAsCompleted, getUserPurchases } from "@/actions/student.actions";

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const[isLoading, setIsLoading] = useState(true);
  
  // Données provenant de la BDD
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  
  // États de navigation
  const [activeTab, setActiveTab] = useState<"formations" | "achats">("formations");
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      const [studentResult, purchasesResult] = await Promise.all([
        getStudentDashboardData(),
        getUserPurchases()
      ]);

      if (studentResult.success && studentResult.enrollments) {
        setEnrollments(studentResult.enrollments);
        setCompletedLessonIds(studentResult.progress.map((p: any) => p.lessonId));
      }

      if (purchasesResult.success && purchasesResult.purchases) {
        setPurchases(purchasesResult.purchases);
      }

      setIsLoading(false);
    };
    fetchDashboardData();
  },[]);

  const totalProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
    : 0;

  const totalLessonsCompleted = completedLessonIds.length;

  const openCourse = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course.id === courseId);
    if (enrollment && enrollment.course) {
      setCurrentCourse(enrollment.course);
      
      // Trouver la première leçon non terminée, ou sinon la première leçon
      const firstUncompleted = enrollment.course.lessons.find(
        (l: any) => !completedLessonIds.includes(l.id)
      );
      
      setCurrentLesson(firstUncompleted || enrollment.course.lessons[0]);
    }
  };

  const markComplete = async () => {
    if (!currentCourse || !currentLesson) return;
    
    // Mise à jour optimiste (UI)
    setCompletedLessonIds(prev =>[...prev, currentLesson.id]);
    
    // Appel BDD
    const result = await markLessonAsCompleted(currentCourse.id, currentLesson.id);
    if (result.success) {
      // Mettre à jour la progression de l'inscription localement
      setEnrollments(enrollments.map(e => 
        e.courseId === currentCourse.id 
          ? { ...e, progress: result.progressPercentage } 
          : e
      ));
    }

    // Passer à la leçon suivante
    const lessonIndex = currentCourse.lessons.findIndex((l: any) => l.id === currentLesson.id);
    if (lessonIndex < currentCourse.lessons.length - 1) {
      setCurrentLesson(currentCourse.lessons[lessonIndex + 1]);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessonIds.includes(lessonId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2 h-20 px-6 border-b bg-white">
          <div className="flex-1 min-w-0 flex justify-start">
            <Logo className="w-[700px] max-w-full h-auto" />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
            <X className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Mes formations</h3>
          <div className="space-y-2">
            {enrollments.map((enrollment) => (
              <button
                key={enrollment.course.id}
                onClick={() => { openCourse(enrollment.course.id); setSidebarOpen(false); }}
                className={`w-full text-left p-3 rounded-xl transition-all ${currentCourse?.id === enrollment.course.id ? "bg-[#001f5f] text-white" : "hover:bg-gray-100"}`}
              >
                <div className="flex items-center gap-3">
                  <img src={enrollment.course.image || "/logo.png"} alt={enrollment.course.title} className="w-12 h-12 rounded-lg object-cover bg-white" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${currentCourse?.id === enrollment.course.id ? 'text-white' : 'text-gray-900'}`}>{enrollment.course.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${currentCourse?.id === enrollment.course.id ? 'bg-orange-400' : 'bg-[#ff5f00]'}`} style={{ width: `${enrollment.progress}%` }} />
                      </div>
                      <span className={`text-xs ${currentCourse?.id === enrollment.course.id ? 'text-orange-200' : 'text-gray-500'}`}>{enrollment.progress}%</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <Link href="/cours-en-ligne" className="flex items-center gap-2 text-gray-600 hover:text-[#001f5f] transition-colors">
            <GraduationCap className="w-5 h-5" /><span>Nouvelle formation</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-72 w-full">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 bg-white border-b flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            {currentCourse && (
              <button onClick={() => {setCurrentCourse(null); setCurrentLesson(null);}} className="hidden md:flex items-center gap-2 text-gray-500 hover:text-[#001f5f]">
                <ArrowLeft className="w-4 h-4" /> Retour à l'aperçu
              </button>
            )}
          </div>
          <AuthButtons />
        </header>

        {/* LECTEUR DE COURS */}
        {currentCourse && currentLesson ? (
          <div className="flex flex-col xl:flex-row h-[calc(100vh-80px)]">
            {/* Zone Vidéo/Contenu */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
              <div className="bg-black rounded-2xl aspect-video flex items-center justify-center mb-6 relative overflow-hidden">
                {currentLesson.videoUrl ? (
                  <iframe src={`${currentLesson.videoUrl}?autoplay=1`} title={currentLesson.title} className="w-full h-full" allowFullScreen></iframe>
                ) : (
                  <div className="text-center text-white p-8">
                    <Play className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                    <p className="opacity-80">Aucune vidéo. Lisez le contenu textuel ci-dessous.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentLesson.title}</h1>
                  <p className="text-gray-600">{currentCourse.title}</p>
                </div>
                <button
                  onClick={markComplete}
                  disabled={isLessonCompleted(currentLesson.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                    isLessonCompleted(currentLesson.id) ? "bg-green-500 text-white cursor-default" : "bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white hover:shadow-lg"
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  {isLessonCompleted(currentLesson.id) ? "Terminé" : "Marquer comme terminé"}
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">À propos de cette leçon</h3>
                <div 
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content || "Aucun contenu textuel additionnel fourni." }}
                />
              </div>

              <div className="flex items-center justify-between mt-6 pb-8">
                {currentCourse.lessons.findIndex((l: any) => l.id === currentLesson.id) > 0 ? (
                  <button
                    onClick={() => setCurrentLesson(currentCourse.lessons[currentCourse.lessons.findIndex((l: any) => l.id === currentLesson.id) - 1])}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#001f5f] transition-colors font-medium"
                  >
                    <ArrowLeft className="w-5 h-5" /> Leçon précédente
                  </button>
                ) : <div></div>}
                
                {currentCourse.lessons.findIndex((l: any) => l.id === currentLesson.id) < currentCourse.lessons.length - 1 && (
                  <button
                    onClick={() => setCurrentLesson(currentCourse.lessons[currentCourse.lessons.findIndex((l: any) => l.id === currentLesson.id) + 1])}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-[#001f5f] transition-colors"
                  >
                    Leçon suivante <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar Liste des Leçons */}
            <div className="w-full xl:w-96 bg-white border-l overflow-y-auto">
              <div className="p-6 sticky top-0 bg-white border-b z-10">
                <h3 className="font-semibold text-gray-900">Contenu de la formation</h3>
                <p className="text-sm text-gray-500 mt-1">{currentCourse.lessons.length} leçons</p>
              </div>
              <div className="p-4 space-y-2">
                {currentCourse.lessons.map((lesson: any, index: number) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-3 border ${
                      currentLesson.id === lesson.id ? "bg-[#001f5f] border-[#001f5f] text-white shadow-md" : "bg-white hover:bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div className={`mt-0.5 ${isLessonCompleted(lesson.id) ? "text-green-500" : currentLesson.id === lesson.id ? "text-orange-400" : "text-gray-300"}`}>
                      {isLessonCompleted(lesson.id) ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-snug ${currentLesson.id === lesson.id ? "text-white" : "text-gray-900"}`}>
                        {index + 1}. {lesson.title}
                      </p>
                      <p className={`text-xs mt-1 ${currentLesson.id === lesson.id ? "text-orange-100" : "text-gray-500"}`}>
                        <Clock className="w-3 h-3 inline mr-1" /> {lesson.duration}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* APERÇU DASHBOARD (Quand on n'est pas dans un cours) */
          <div className="p-4 lg:p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Espace Client</h1>
            
            {/* Statistiques rapides */}
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center"><BookOpen className="w-7 h-7 text-[#ff5f00]" /></div>
                <div><p className="text-3xl font-bold text-gray-900">{enrollments.length}</p><p className="text-sm text-gray-500 font-medium">Formations actives</p></div>
              </div>
              <div className="bg-white rounded-2xl p-6 border shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center"><TrendingUp className="w-7 h-7 text-blue-600" /></div>
                <div><p className="text-3xl font-bold text-gray-900">{totalProgress}%</p><p className="text-sm text-gray-500 font-medium">Progression globale</p></div>
              </div>
              <div className="bg-white rounded-2xl p-6 border shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center"><Package className="w-7 h-7 text-green-600" /></div>
                <div><p className="text-3xl font-bold text-gray-900">{purchases.length}</p><p className="text-sm text-gray-500 font-medium">Produits digitaux</p></div>
              </div>
            </div>

            {/* Onglets de navigation */}
            <div className="flex items-center gap-4 mb-8 border-b">
              <button 
                onClick={() => setActiveTab("formations")}
                className={`pb-4 px-2 font-semibold text-lg transition-colors border-b-2 ${activeTab === "formations" ? "border-[#001f5f] text-[#001f5f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                Mes Formations
              </button>
              <button 
                onClick={() => setActiveTab("achats")}
                className={`pb-4 px-2 font-semibold text-lg transition-colors border-b-2 ${activeTab === "achats" ? "border-[#001f5f] text-[#001f5f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                Mes Achats
              </button>
            </div>

            {/* CONTENU : FORMATIONS */}
            {activeTab === "formations" && (
              <>
                {enrollments.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune formation en cours</h3>
                    <Link href="/cours-en-ligne" className="text-[#001f5f] hover:underline">Découvrir nos cours</Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {enrollments.map(enrollment => (
                      <div key={enrollment.course.id} className="bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition-shadow flex flex-col">
                        <div className="relative h-48 bg-gray-200">
                          <img src={enrollment.course.image || "/logo.png"} alt={enrollment.course.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <span className="bg-[#ff5f00] text-white px-2 py-1 rounded text-xs font-semibold mb-2 inline-block">{enrollment.course.category}</span>
                            <h3 className="font-bold text-lg text-white line-clamp-1">{enrollment.course.title}</h3>
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 font-medium">Progression</span>
                            <span className="font-bold text-[#001f5f]">{enrollment.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                            <div className="h-full bg-gradient-to-r from-[#001f5f] to-[#ff5f00]" style={{ width: `${enrollment.progress}%` }} />
                          </div>
                          <button
                            onClick={() => openCourse(enrollment.course.id)}
                            className="mt-auto w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-[#001f5f] transition-colors flex items-center justify-center gap-2"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            {enrollment.progress > 0 ? "Continuer la formation" : "Commencer la formation"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* CONTENU : ACHATS (PRODUITS DIGITAUX) */}
            {activeTab === "achats" && (
              <>
                {purchases.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun achat digital</h3>
                    <p className="text-gray-500 mb-4">Vous n'avez pas encore acheté de codes sources ou d'applications.</p>
                    <Link href="/boutique" className="text-[#001f5f] hover:underline font-medium">Visiter la boutique</Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {purchases.map(product => (
                      <div key={product.id} className="bg-white rounded-2xl p-4 border shadow-sm flex flex-col sm:flex-row items-center gap-4">
                        <img src={product.image || "/logo.png"} alt={product.name} className="w-24 h-24 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                          <p className="text-xs text-gray-500 mt-1 mb-3">
                            Acheté le {new Date(product.orderDate).toLocaleDateString("fr-FR")}
                          </p>
                          <a 
                            href={product.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#001f5f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#ff5f00] transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Télécharger
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
}