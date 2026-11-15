import React from "react";
import {
  Flame,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  Play,
  Sparkles,
  TrendingUp,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useLearning } from "../context/LearningContext";
import { INITIAL_ACHIEVEMENTS } from "../data/coursesData";

interface DashboardViewProps {
  onSelectCourse: (courseId: string) => void;
  onResumeLesson: (courseId: string, lessonId: string) => void;
  onViewCertificates: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectCourse,
  onResumeLesson,
  onViewCertificates,
}) => {
  const { courses, userProgress, getCourseProgress } = useLearning();

  // Aggregate stats
  let totalLessonsWatched = Object.keys(userProgress.completedLessons).length;
  let totalSecondsLearned = Object.values(userProgress.lessonWatchTime).reduce(
    (a, b) => a + b,
    0,
  );
  let totalHoursLearned = (totalSecondsLearned / 3600).toFixed(1);

  // Total possible lessons across all courses
  let allTotalLessons = 0;
  courses.forEach((c) =>
    c.modules.forEach((m) => {
      allTotalLessons += m.lessons.length;
    }),
  );
  const overallPercentage =
    allTotalLessons > 0
      ? Math.min(100, Math.round((totalLessonsWatched / allTotalLessons) * 100))
      : 0;

  // Last watched course/lesson
  const lastWatched = userProgress.lastWatched;
  let lastCourse = lastWatched
    ? courses.find((c) => c.id === lastWatched.courseId)
    : courses[0];
  let lastLesson = null;
  if (lastCourse && lastWatched) {
    for (const m of lastCourse.modules) {
      const found = m.lessons.find((l) => l.id === lastWatched.lessonId);
      if (found) {
        lastLesson = found;
        break;
      }
    }
  }
  if (!lastLesson && lastCourse) {
    lastLesson = lastCourse.modules[0]?.lessons[0] || null;
  }

  // Generate 28-day streak activity calendar
  const today = new Date();
  const pastDays = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (27 - i));
    const iso = d.toISOString().split("T")[0];
    const isCompleted = (userProgress.streak.activeDates || []).includes(iso);
    const dayLetter = d.toLocaleDateString("en-US", { weekday: "narrow" });
    const dayNumber = d.getDate();
    return { iso, isCompleted, dayLetter, dayNumber, date: d };
  });

  // Calculate SVG Circle circumference for completion ring
  const circleRadius = 54;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circumference - (overallPercentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header Banner */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-indigo-950/30 to-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                Learner Dashboard
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Synced with Local Storage
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                {userProgress.learnerName}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {userProgress.learnerTitle} • Track your learning hours, streak
              cadence, quiz masteries, and earned credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewCertificates}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Award className="w-4 h-4 text-slate-950" />
              View Certificates ({userProgress.certificates.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Metric Cards + Circular Completion Ring */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Circular Progress Ring */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-5">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r={circleRadius}
                  className="stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={circleRadius}
                  className="stroke-indigo-500 transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-white">
                  {overallPercentage}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">
                  Total
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-medium">
                Curriculum Completion
              </p>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {totalLessonsWatched} of {allTotalLessons}
              </h3>
              <p className="text-[11px] text-indigo-400 mt-1 font-medium">
                Across all enrolled domains
              </p>
            </div>
          </div>

          {/* Card 2: Learning Hours */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Time Invested
              </p>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {totalHoursLearned} Hours
              </h3>
              <p className="text-[11px] text-cyan-400 mt-1">
                High-focus video streaming
              </p>
            </div>
          </div>

          {/* Card 3: Active Streak */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 fill-current animate-bounce" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Current Streak
              </p>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {userProgress.streak.currentStreak} Days
              </h3>
              <p className="text-[11px] text-amber-400 mt-1">
                Best record: {userProgress.streak.maxStreak} days
              </p>
            </div>
          </div>

          {/* Card 4: Verified Certificates */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Credentials Claimed
              </p>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {userProgress.certificates.length} Official
              </h3>
              <p className="text-[11px] text-emerald-400 mt-1">
                Printable & verifiable
              </p>
            </div>
          </div>
        </div>

        {/* Continue Learning Row */}
        {lastCourse && lastLesson && (
          <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 hidden sm:block">
                  <img
                    src={lastCourse.thumbnail}
                    alt={lastCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-current" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Continue Learning</span>
                    <span>•</span>
                    <span className="text-slate-400">{lastCourse.title}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                    {lastLesson.title}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xl line-clamp-1">
                    {lastLesson.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-slate-400">Position</span>
                  <p className="text-xs font-mono font-bold text-indigo-300">
                    {lastWatched?.timestamp
                      ? `${Math.floor(lastWatched.timestamp / 60)}m ${lastWatched.timestamp % 60}s`
                      : "Ready to begin"}
                  </p>
                </div>

                <button
                  onClick={() => onResumeLesson(lastCourse!.id, lastLesson!.id)}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Resume Lesson
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Streak Calendar & Habit Tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Daily Consistency Matrix (28-Day Window)
                  <Flame className="w-4 h-4 text-amber-400 fill-current" />
                </h3>
                <p className="text-xs text-slate-400">
                  Every day you watch a lesson, take a quiz, or write a note
                  advances your active streak.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
              <span>Active Study Day</span>
              <span className="w-3 h-3 rounded-sm bg-slate-800 inline-block ml-3" />
              <span className="text-slate-500">Rest Day</span>
            </div>
          </div>

          {/* Calendar Grid of 28 Days */}
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
            {pastDays.map((day, idx) => (
              <div
                key={day.iso}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  day.isCompleted
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm"
                    : "bg-slate-950/60 border-slate-800 text-slate-500"
                }`}
                title={`${day.iso}: ${day.isCompleted ? "Studied" : "No activity logged"}`}
              >
                <span className="text-[10px] font-semibold uppercase">
                  {day.dayLetter}
                </span>
                <span className="text-sm font-bold mt-0.5 text-white">
                  {day.dayNumber}
                </span>
                <div className="mt-1">
                  {day.isCompleted ? (
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrolled Courses Progress Matrix */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Your Enrolled Curricula
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const progress = getCourseProgress(course.id);
              const totalHours = (course.totalDurationSeconds / 3600).toFixed(
                1,
              );

              return (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course.id)}
                  className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300">
                        {course.category}
                      </span>
                      <span className="font-mono text-[11px]">
                        {totalHours} hrs
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-2 mb-3">
                      {course.title}
                    </h4>

                    {/* Progress Bar */}
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-indigo-400 font-bold">
                          {progress.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            progress.isCourseCompleted
                              ? "bg-emerald-500"
                              : "bg-indigo-500"
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {progress.completedLessonsCount} /{" "}
                        {progress.totalLessonsCount} lessons finished
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {progress.isCourseCompleted
                        ? "✅ Certified"
                        : "In Progress"}
                    </span>
                    <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:underline">
                      Open Course <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements & Milestones Showcase */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Engineering Badges & Milestones
              </h3>
              <p className="text-xs text-slate-400">
                Earn badges by building study streaks and mastering technical
                quizzes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {INITIAL_ACHIEVEMENTS.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border text-center transition-all ${
                  ach.unlockedAt
                    ? "bg-slate-950/80 border-indigo-500/40 shadow-md"
                    : "bg-slate-950/30 border-slate-800 opacity-60"
                }`}
              >
                <div className="text-3xl mb-2">{ach.icon}</div>
                <h4 className="text-xs font-bold text-white mb-1">
                  {ach.title}
                </h4>
                <p className="text-[10px] text-slate-400 leading-snug mb-2">
                  {ach.description}
                </p>
                {ach.unlockedAt ? (
                  <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold uppercase">
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[9px] font-bold">
                    {ach.progress}% progress
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
