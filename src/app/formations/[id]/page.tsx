"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCourseById } from "@/actions/course.actions";
import { GraduationCap, ArrowLeft, Play, CheckCircle, Menu, X, SkipForward, SkipBack, BookOpen, Clock, Users, Award, Loader2, Circle } from "lucide-react";

export default function CoursePlayer() {
  const params = useParams();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const[sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      const result = await getCourseById(courseId);
      if (result.success && result.course) {
        setCourse(result.course);
      }
      setIsLoading(false);
    };
    fetchCourse();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Cours non trouvé</h2>
          <Link href="/cours-en-ligne" className="text-[#ff5f00] hover:underline">Retour aux formations</Link>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons && course.lessons.length > 0 ? course.lessons[currentLessonIndex] : null;
  const totalLessons = course.lessons ? course.lessons.length : 0;
  const progress = totalLessons === 0 ? 0 : (completedLessons.length / totalLessons) * 100;

  const handleNextLesson = () => {
    if (currentLessonIndex < totalLessons - 1) setCurrentLessonIndex(currentLessonIndex + 1);
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) setCurrentLessonIndex(currentLessonIndex - 1);
  };

  const handleMarkComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/cours-en-ligne" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour</span>
            </Link>
            <div className="h-6 w-px bg-gray-600"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#001f5f] to-[#ff5f00] rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-sm md:text-base line-clamp-1">{course.title}</h1>
                <p className="text-xs text-gray-400 hidden sm:block">{completedLessons.length}/{totalLessons} leçons complétées</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#001f5f] to-[#ff5f00] transition-all" style={{ width: `${progress}%` }}></div>
              </div>
              <span>{Math.round(progress)}%</span>
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-700 rounded-lg">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className={`flex-1 transition-all ${sidebarOpen ? 'mr-80' : ''} duration-300`}>
          {!currentLesson ? (
            <div className="p-12 text-center text-gray-400">Aucune leçon n'a encore été ajoutée à ce cours.</div>
          ) : (
            <>
              {/* Video Player */}
              <div className="relative bg-black aspect-video">
                {currentLesson.videoUrl ? (
                  <iframe
                    src={`${currentLesson.videoUrl}?autoplay=1`}
                    title={currentLesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-gray-400">
                    <Play className="w-16 h-16 mb-4 opacity-50" />
                    <p>Aucune vidéo fournie pour cette leçon.</p>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="p-4 md:p-6 border-b border-gray-800">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-2">{currentLesson.title}</h2>
                    <div className="text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: currentLesson.content || "Aucun contenu textuel." }} />
                  </div>
                  <div className="flex items-center gap-3">
                    {completedLessons.includes(currentLesson.id) ? (
                      <span className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="w-5 h-5" /> Complété
                      </span>
                    ) : (
                      <button onClick={handleMarkComplete} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
                        <CheckCircle className="w-5 h-5" /> Marquer comme terminé
                      </button>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                  <button onClick={handlePrevLesson} disabled={currentLessonIndex === 0} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentLessonIndex === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}>
                    <SkipBack className="w-5 h-5" /> Précédent
                  </button>
                  <span className="text-gray-400">Leçon {currentLessonIndex + 1} sur {totalLessons}</span>
                  <button onClick={handleNextLesson} disabled={currentLessonIndex === totalLessons - 1} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentLessonIndex === totalLessons - 1 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-700'}`}>
                    Suivant <SkipForward className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Sidebar - Lessons List */}
        <aside className={`fixed right-0 top-[73px] bottom-0 w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto transition-transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Contenu du cours
            </h3>
            <div className="space-y-2">
              {course.lessons?.map((lesson: any, index: number) => (
                <button key={lesson.id} onClick={() => setCurrentLessonIndex(index)} className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3 ${index === currentLessonIndex ? 'bg-[#001f5f] text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                  <div className={`mt-0.5 ${completedLessons.includes(lesson.id) ? 'text-green-500' : 'text-gray-500'}`}>
                    {completedLessons.includes(lesson.id) ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2">{lesson.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{lesson.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}