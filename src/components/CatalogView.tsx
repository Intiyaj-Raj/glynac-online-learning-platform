import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Sparkles,
  Clock,
  Star,
  Users,
  ChevronRight,
  CheckCircle,
  BarChart2,
  Award,
  Layers,
} from "lucide-react";
import { useLearning } from "../context/LearningContext";
import { CourseLevel } from "../types";

interface CatalogViewProps {
  onSelectCourse: (courseId: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onSelectCourse }) => {
  const { courses, getCourseProgress } = useLearning();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "duration">(
    "popular",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => set.add(c.category));
    return ["All", ...Array.from(set)];
  }, [courses]);

  // Filter & Sort logic
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const matchesQuery =
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.shortDescription
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.instructor.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          );

        const matchesCategory =
          selectedCategory === "All" || course.category === selectedCategory;
        const matchesLevel =
          selectedLevel === "All" || course.level === selectedLevel;

        return matchesQuery && matchesCategory && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === "popular")
          return b.studentsEnrolled - a.studentsEnrolled;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "duration")
          return b.totalDurationSeconds - a.totalDurationSeconds;
        return 0;
      });
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(start, start + itemsPerPage);
  }, [filteredCourses, currentPage]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedLevel("All");
    setSortBy("popular");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Hero section */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Engineering-Grade Interactive Curricula
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Advance Your Engineering Career with{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200 bg-clip-text text-transparent">
              Deep Technical Mastery
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 mb-8 leading-relaxed">
            High-production video lectures, real-time synchronized transcripts,
            timestamped notes, instant multi-format quizzes, and verifiable
            completion certificates.
          </p>

          {/* Search bar inside Hero */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search courses, frameworks (React, AI, K8s, Security), or instructors..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xl transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Filter & Sort Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level and Sort Dropdowns */}
          <div className="flex items-center gap-3">
            {/* Level Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Level:
              </span>
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by level"
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort courses"
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="duration">Longest Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Results Header */}
        <div className="flex items-center justify-between py-4 text-xs text-slate-400">
          <span>
            Showing{" "}
            <strong className="text-white">{filteredCourses.length}</strong>{" "}
            available courses
            {selectedCategory !== "All" && (
              <span>
                {" "}
                in <span className="text-indigo-400">{selectedCategory}</span>
              </span>
            )}
          </span>
          {(selectedCategory !== "All" ||
            selectedLevel !== "All" ||
            searchQuery) && (
            <button
              onClick={resetFilters}
              className="text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800 my-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              No matching courses found
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              We couldn't find any courses matching "{searchQuery}". Try
              searching for broader terms like "React", "AI", or "Security".
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20"
            >
              Show All Courses
            </button>
          </div>
        )}

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCourses.map((course) => {
            const progress = getCourseProgress(course.id);
            const totalHours = (course.totalDurationSeconds / 3600).toFixed(1);

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                  {/* Level Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        course.level === "Beginner"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : course.level === "Intermediate"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700/50">
                      {course.category}
                    </span>
                  </div>

                  {/* Duration overlay badge */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] text-slate-300 font-medium">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{totalHours} hrs</span>
                  </div>
                </div>

                {/* Progress Bar (if in progress) */}
                {progress.percentage > 0 && (
                  <div className="w-full bg-slate-800 h-1.5">
                    <div
                      className={`h-full transition-all duration-500 ${
                        progress.isCourseCompleted
                          ? "bg-emerald-500"
                          : "bg-indigo-500"
                      }`}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                )}

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Progress or Completion label */}
                    <div className="flex items-center justify-between text-[11px] font-semibold mb-2">
                      {progress.isCourseCompleted ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Course Completed (100%)
                        </span>
                      ) : progress.percentage > 0 ? (
                        <span className="text-indigo-400">
                          {progress.percentage}% completed (
                          {progress.completedLessonsCount}/
                          {progress.totalLessonsCount} lessons)
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          {course.modules.reduce(
                            (acc, m) => acc + m.lessons.length,
                            0,
                          )}{" "}
                          Lessons in {course.modules.length} Modules
                        </span>
                      )}

                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-white">
                          {course.rating}
                        </span>
                        <span className="text-slate-500 font-normal">
                          ({course.reviewsCount})
                        </span>
                      </div>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug mb-2">
                      {course.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {course.shortDescription}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {course.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Instructor & CTA */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-700"
                      />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-200 truncate">
                          {course.instructor.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {course.studentsEnrolled.toLocaleString()} learners
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course.id);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all shrink-0"
                    >
                      {progress.percentage > 0 ? "Continue" : "Details"}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-800"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
