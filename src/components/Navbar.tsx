import React, { useState } from "react";
import {
  BookOpen,
  Flame,
  Award,
  LayoutDashboard,
  Play,
  User,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useLearning } from "../context/LearningContext";

interface NavbarProps {
  currentView:
    | "catalog"
    | "course-detail"
    | "player"
    | "dashboard"
    | "certificate";
  setCurrentView: (
    view: "catalog" | "course-detail" | "player" | "dashboard" | "certificate",
  ) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
}) => {
  const {
    userProgress,
    activeCourse,
    activeLesson,
    courses,
    navigateToLesson,
    updateLearnerName,
    resetAllProgress,
  } = useLearning();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempName, setTempName] = useState(userProgress.learnerName);
  const [tempTitle, setTempTitle] = useState(userProgress.learnerTitle);

  const lastWatched = userProgress.lastWatched;
  const lastCourse = lastWatched
    ? courses.find((c) => c.id === lastWatched.courseId)
    : null;
  let lastLessonTitle = "";
  if (lastCourse && lastWatched) {
    for (const m of lastCourse.modules) {
      const l = m.lessons.find((item) => item.id === lastWatched.lessonId);
      if (l) {
        lastLessonTitle = l.title;
        break;
      }
    }
  }

  const handleResume = () => {
    if (lastWatched) {
      navigateToLesson(lastWatched.courseId, lastWatched.lessonId);
      setCurrentView("player");
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateLearnerName(tempName, tempTitle);
    setShowProfileModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => setCurrentView("catalog")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent leading-none">
                glynac
              </span>
              <span className="text-[11px] uppercase tracking-widest font-bold text-indigo-400 leading-tight mt-0.5">
                e-learn
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView("catalog")}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === "catalog" || currentView === "course-detail"
                  ? "bg-slate-800/80 text-white shadow-sm border border-slate-700/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Browse Catalog
            </button>

            {activeLesson && (
              <button
                onClick={() => setCurrentView("player")}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  currentView === "player"
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                Active Lesson
              </button>
            )}

            <button
              onClick={() => setCurrentView("dashboard")}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentView === "dashboard"
                  ? "bg-slate-800/80 text-white shadow-sm border border-slate-700/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              My Progress
            </button>

            <button
              onClick={() => setCurrentView("certificate")}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentView === "certificate"
                  ? "bg-slate-800/80 text-white shadow-sm border border-slate-700/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              Certificates
              {userProgress.certificates.length > 0 && (
                <span className="w-4 h-4 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40">
                  {userProgress.certificates.length}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Quick Resume Pill (if not on player already) */}
            {lastWatched && currentView !== "player" && (
              <button
                onClick={handleResume}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/70 border border-indigo-800/60 hover:border-indigo-600 text-xs text-indigo-200 transition-all hover:bg-indigo-900/80 shadow-sm"
                title={`Resume: ${lastLessonTitle}`}
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span className="truncate max-w-[120px] font-medium">
                  Resume: {lastLessonTitle || "Lesson"}
                </span>
              </button>
            )}

            {/* Streak Counter */}
            <div
              onClick={() => setCurrentView("dashboard")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold cursor-pointer hover:bg-amber-500/20 transition-all"
              title={`${userProgress.streak.currentStreak} Day Learning Streak! Best: ${userProgress.streak.maxStreak} days`}
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
              <span>{userProgress.streak.currentStreak}d Streak</span>
            </div>

            {/* Learner Profile trigger */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all"
            >
              <span className="hidden sm:inline font-medium text-slate-200">
                {userProgress.learnerName}
              </span>
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-inner">
                {userProgress.learnerName.charAt(0)}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="flex md:hidden border-t border-slate-800/80 px-4 py-2 gap-2 overflow-x-auto no-scrollbar bg-slate-950">
          <button
            onClick={() => setCurrentView("catalog")}
            className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
              currentView === "catalog" || currentView === "course-detail"
                ? "bg-indigo-600 text-white"
                : "text-slate-400"
            }`}
          >
            Catalog
          </button>
          {activeLesson && (
            <button
              onClick={() => setCurrentView("player")}
              className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                currentView === "player"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400"
              }`}
            >
              Video Player
            </button>
          )}
          <button
            onClick={() => setCurrentView("dashboard")}
            className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
              currentView === "dashboard"
                ? "bg-indigo-600 text-white"
                : "text-slate-400"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView("certificate")}
            className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
              currentView === "certificate"
                ? "bg-indigo-600 text-white"
                : "text-slate-400"
            }`}
          >
            Certificates
          </button>
        </div>
      </header>

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Learner Identity
                  </h3>
                  <p className="text-xs text-slate-400">
                    Used on official verifiable certificates
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded-md hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Legal Name (as shown on Certificates)
                </label>
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Professional Title / Goal
                </label>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        "Reset learning progress back to default demo state?",
                      )
                    ) {
                      resetAllProgress();
                      setShowProfileModal(false);
                    }
                  }}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 py-2 px-2.5 rounded hover:bg-red-950/30 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Progress
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
