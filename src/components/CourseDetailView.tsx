import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Clock, 
  Star, 
  Users, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Course, Lesson, Quiz } from '../types';
import { useLearning } from '../context/LearningContext';

interface CourseDetailViewProps {
  courseId: string;
  onBack: () => void;
  onStartLesson: (courseId: string, lessonId: string) => void;
  onOpenQuiz: (quiz: Quiz) => void;
  onViewCertificate: (courseId: string) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  courseId,
  onBack,
  onStartLesson,
  onOpenQuiz,
  onViewCertificate
}) => {
  const { courses, userProgress, getCourseProgress, getLessonProgress } = useLearning();
  const course = courses.find(c => c.id === courseId);

  // Accordion state (open all modules by default)
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    if (course) {
      course.modules.forEach(m => { init[m.id] = true; });
    }
    return init;
  });

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <p className="text-slate-400 mb-4">Course not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const toggleModule = (modId: string) => {
    setOpenModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const courseProgress = getCourseProgress(course.id);
  const totalHours = (course.totalDurationSeconds / 3600).toFixed(1);

  // Find next uncompleted lesson or first lesson
  let firstActionLessonId = course.modules[0]?.lessons[0]?.id;
  for (const m of course.modules) {
    for (const l of m.lessons) {
      if (!userProgress.completedLessons[l.id]) {
        firstActionLessonId = l.id;
        break;
      }
    }
    if (firstActionLessonId && !userProgress.completedLessons[firstActionLessonId]) break;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Breadcrumb & Hero */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-indigo-950/30 to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Course Catalog
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Course Overview */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {course.category}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  course.level === 'Beginner'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : course.level === 'Intermediate'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {course.level} Level
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-white">{course.rating}</span>
                  <span className="text-slate-400">({course.reviewsCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {course.fullDescription}
              </p>

              {/* Course Meta Info */}
              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{totalHours} Total Hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>{course.studentsEnrolled.toLocaleString()} Active Learners</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Verifiable Certificate on Completion</span>
                </div>
              </div>
            </div>

            {/* Right Col: Course Card & Quick Action */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <button
                    onClick={() => firstActionLessonId && onStartLesson(course.id, firstActionLessonId)}
                    className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/50 hover:scale-105 transition-all"
                  >
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </button>
                </div>
              </div>

              {/* Progress Bar & Status */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">Your Course Progress</span>
                  <span className="text-indigo-400 font-bold">{courseProgress.percentage}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      courseProgress.isCourseCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${courseProgress.percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {courseProgress.completedLessonsCount} of {courseProgress.totalLessonsCount} lessons finished
                </p>
              </div>

              {/* Primary Action Button */}
              {courseProgress.isCourseCompleted ? (
                <button
                  onClick={() => onViewCertificate(course.id)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  View & Print Official Certificate
                </button>
              ) : (
                <button
                  onClick={() => firstActionLessonId && onStartLesson(course.id, firstActionLessonId)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {courseProgress.percentage > 0 ? 'Resume Course Lesson' : 'Start Course Now'}
                </button>
              )}

              <div className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Lifetime Access & Instant Offline Progress Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Interactive Real-Time Transcript & Code Notes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body: Syllabus & Instructor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Syllabus Accordion & Learning Outcomes */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Learning Outcomes */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                What You Will Master
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Syllabus Accordion */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  Comprehensive Syllabus
                </h2>
                <span className="text-xs text-slate-400">
                  {course.modules.length} Modules • {courseProgress.totalLessonsCount} Lessons
                </span>
              </div>

              <div className="space-y-4">
                {course.modules.map((mod, modIdx) => {
                  const isOpen = !!openModules[mod.id];
                  const completedInMod = mod.lessons.filter(l => userProgress.completedLessons[l.id]).length;
                  const quizAttempt = mod.quiz ? userProgress.quizAttempts[mod.quiz.id]?.[0] : null;

                  return (
                    <div
                      key={mod.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-md"
                    >
                      {/* Accordion Module Header */}
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
                            <span>Module {modIdx + 1}</span>
                            <span>•</span>
                            <span className="text-slate-400">
                              {completedInMod}/{mod.lessons.length} Lessons Finished
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-white">{mod.title}</h3>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{mod.description}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {completedInMod === mod.lessons.length && mod.lessons.length > 0 && (
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                              ✓
                            </span>
                          )}
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Accordion Body: Lessons & Quiz */}
                      {isOpen && (
                        <div className="border-t border-slate-800/80 divide-y divide-slate-800/60 bg-slate-950/40">
                          {mod.lessons.map((lesson) => {
                            const isCompleted = !!userProgress.completedLessons[lesson.id];
                            const watchProgress = getLessonProgress(lesson.id, lesson.duration);
                            const mins = Math.floor(lesson.duration / 60);

                            return (
                              <div
                                key={lesson.id}
                                onClick={() => onStartLesson(course.id, lesson.id)}
                                className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors group"
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                    isCompleted
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-slate-800 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
                                  }`}>
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-4 h-4" />
                                    ) : (
                                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                    )}
                                  </div>
                                  <div className="truncate">
                                    <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                                      {lesson.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 truncate">{lesson.summary}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400 ml-3">
                                  <span className="flex items-center gap-1 font-mono text-[11px]">
                                    <Clock className="w-3 h-3 text-slate-500" />
                                    {mins}m
                                  </span>
                                  {watchProgress.percentage > 0 && !isCompleted && (
                                    <span className="text-[10px] text-indigo-400 font-medium hidden sm:inline">
                                      {watchProgress.percentage}% watched
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Module Quiz Card */}
                          {mod.quiz && (
                            <div className="px-5 py-3.5 bg-indigo-950/20 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
                                  <HelpCircle className="w-4 h-4" />
                                </div>
                                <div className="truncate">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                                      {mod.quiz.title}
                                    </h4>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold uppercase">
                                      Assessment
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {mod.quiz.questions.length} Questions (MCQ, Multi-Select & Reorder) • Pass requirement: {mod.quiz.passingScorePercent}%
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => onOpenQuiz(mod.quiz!)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                  quizAttempt?.passed
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                                }`}
                              >
                                {quizAttempt?.passed ? `Passed (${quizAttempt.scorePercent}%)` : 'Start Quiz'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-3">Course Prerequisites</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                {course.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Col: Instructor Profile */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-20">
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">Your Instructor</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
                />
                <div>
                  <h4 className="text-base font-bold text-white">{course.instructor.name}</h4>
                  <p className="text-xs text-indigo-400 font-medium leading-snug">{course.instructor.title}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                {course.instructor.bio}
              </p>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800 text-center text-xs">
                <div>
                  <p className="font-extrabold text-white text-sm">{course.instructor.rating}</p>
                  <p className="text-[10px] text-slate-400">Instructor Rating</p>
                </div>
                <div>
                  <p className="font-extrabold text-white text-sm">{(course.instructor.studentsCount / 1000).toFixed(0)}k+</p>
                  <p className="text-[10px] text-slate-400">Students</p>
                </div>
                <div>
                  <p className="font-extrabold text-white text-sm">{course.instructor.coursesCount}</p>
                  <p className="text-[10px] text-slate-400">Courses</p>
                </div>
              </div>

              {/* Certificate Guarantee Box */}
              <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/40 text-center">
                <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <h5 className="text-xs font-bold text-white mb-1">Earn Your Accredited Credential</h5>
                <p className="text-[11px] text-slate-400 mb-3">
                  Complete all modules and achieve ≥ 70% in every quiz to claim your personalized printable certificate.
                </p>
                {courseProgress.isCourseCompleted ? (
                  <button
                    onClick={() => onViewCertificate(course.id)}
                    className="w-full py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                  >
                    View Official Certificate
                  </button>
                ) : (
                  <div className="text-[10px] text-indigo-300 font-medium">
                    {courseProgress.percentage}% to Certificate Unlock
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
