import React, { useState } from "react";
import { LearningProvider, useLearning } from "./context/LearningContext";
import { Navbar } from "./components/Navbar";
import { Quiz } from "./types";
import { BookOpen, ShieldCheck, Heart, Sparkles, Terminal } from "lucide-react";

type AppView =
  | "catalog"
  | "course-detail"
  | "player"
  | "dashboard"
  | "certificate";

function MainApp() {
  const {
    selectedCourseId,
    navigateToCourse,
    navigateToLesson,
    activeQuiz,
    openQuiz,
    closeQuiz,
  } = useLearning();

  const [currentView, setCurrentView] = useState<AppView>("catalog");
  const [detailCourseId, setDetailCourseId] = useState<string>(
    selectedCourseId || "course-react-fullstack",
  );

  // Handle selecting a course from catalog
  const handleSelectCourse = (courseId: string) => {
    setDetailCourseId(courseId);
    navigateToCourse(courseId);
    setCurrentView("course-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle starting a lesson from detail page
  const handleStartLesson = (courseId: string, lessonId: string) => {
    navigateToLesson(courseId, lessonId);
    setCurrentView("player");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle viewing certificate
  const handleViewCertificate = (courseId: string) => {
    setDetailCourseId(courseId);
    setCurrentView("certificate");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Primary Navigation */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main View Switcher */}
      <main className="flex-1">
        {currentView === "catalog" && (
          <div className="max-w-3xl mx-auto p-16 text-center text-slate-400">
            🚧 Catalog view
          </div>
        )}

        {currentView === "course-detail" && (
          <div className="max-w-3xl mx-auto p-16 text-center text-slate-400">
            🚧 Course detail view
          </div>
        )}

        {currentView === "player" && (
          <div className="max-w-3xl mx-auto p-16 text-center text-slate-400">
            🚧 Lesson player
          </div>
        )}

        {currentView === "dashboard" && (
          <div className="max-w-3xl mx-auto p-16 text-center text-slate-400">
            🚧 Dashboard view
          </div>
        )}

        {currentView === "certificate" && (
          <div className="max-w-3xl mx-auto p-16 text-center text-slate-400">
            🚧 Certificate view
          </div>
        )}
      </main>

      {/* Global Interactive Quiz Modal */}

      {/* Footer (Hidden when printing certificates) */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              g
            </div>
            <span className="font-bold text-white tracking-tight">
              glynac e-learn
            </span>
            <span className="text-slate-600">|</span>
            <span>Engineering Mastery & Interactive Learning Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Offline Persistent Progress
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Accredited Verifications
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LearningProvider>
      <MainApp />
    </LearningProvider>
  );
}
