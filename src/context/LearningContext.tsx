import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Course,
  Lesson,
  Quiz,
  QuizAttempt,
  UserNote,
  Certificate,
  UserProgressState,
} from "../types";
import { INITIAL_COURSES } from "../data/coursesData";

const STORAGE_KEY = "glynac_elearn_user_progress_v2";

const DEFAULT_STATE: UserProgressState = {
  learnerName: "Alex Morgan",
  learnerTitle: "Senior Frontend Engineer & Aspiring Cloud Architect",
  completedLessons: {
    "les-r1-1": true,
  },
  lessonWatchTime: {
    "les-r1-1": 480,
    "les-r1-2": 140,
    "les-ai-1": 120,
  },
  lastWatched: {
    courseId: "course-react-fullstack",
    lessonId: "les-r1-2",
    timestamp: 140,
    updatedAt: new Date().toISOString(),
  },
  quizAttempts: {
    "quiz-react-1": [
      {
        id: "att-sample-1",
        quizId: "quiz-react-1",
        courseId: "course-react-fullstack",
        moduleId: "mod-react-1",
        scorePercent: 100,
        passed: true,
        userAnswers: {
          "q-r1": "opt-b",
          "q-r2": ["opt-client-state", "opt-event-listener", "opt-browser-api"],
          "q-r3": ["step-req", "step-stream", "step-promise", "step-swap"],
        },
        timeSpentSeconds: 112,
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        totalQuestions: 3,
        correctCount: 3,
      },
    ],
  },
  notes: [
    {
      id: "note-sample-1",
      courseId: "course-react-fullstack",
      lessonId: "les-r1-1",
      timestamp: 83,
      formattedTime: "01:23",
      content:
        "Server Components can render Client Components, but Client Components can only render Server Components if passed as children props! Very important architectural nuance.",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "note-sample-2",
      courseId: "course-react-fullstack",
      lessonId: "les-r1-2",
      timestamp: 46,
      formattedTime: "00:46",
      content:
        "Suspense boundaries prevent cascading waterfalls. Wrap low-priority async widgets separately.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  streak: {
    currentStreak: 5,
    maxStreak: 12,
    lastActiveDate: new Date().toISOString().split("T")[0],
    activeDates: [
      new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0],
      new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
      new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
      new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
      new Date().toISOString().split("T")[0],
    ],
  },
  certificates: [
    {
      id: "cert-sample-react",
      courseId: "course-react-fullstack",
      courseTitle: "Modern Full-Stack React & Next.js: Architecture to Cloud",
      learnerName: "Alex Morgan",
      issueDate: "November 2, 2026",
      scorePercent: 96,
      credentialId: "GLYNAC-2026-REACT-84920",
      instructorName: "Dr. Sarah Lin",
      instructorTitle: "Principal Software Architect",
      totalHours: "4.0 Hours",
    },
  ],
};

interface LearningContextType {
  courses: Course[];
  userProgress: UserProgressState;
  activeCourse: Course | null;
  activeLesson: Lesson | null;
  activeQuiz: Quiz | null;
  selectedCourseId: string | null;
  selectedLessonId: string | null;

  // Navigation actions
  navigateToCourse: (courseId: string) => void;
  navigateToLesson: (courseId: string, lessonId: string) => void;
  openQuiz: (quiz: Quiz) => void;
  closeQuiz: () => void;

  // Progress actions
  markLessonComplete: (courseId: string, lessonId: string) => void;
  updateWatchTime: (
    lessonId: string,
    seconds: number,
    totalDuration: number,
    courseId: string,
  ) => void;
  addNote: (
    courseId: string,
    lessonId: string,
    timestamp: number,
    content: string,
  ) => void;
  updateNote: (noteId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  submitQuizAttempt: (
    attempt: Omit<QuizAttempt, "id" | "completedAt">,
  ) => QuizAttempt;
  getCourseProgress: (courseId: string) => {
    completedLessonsCount: number;
    totalLessonsCount: number;
    percentage: number;
    isCourseCompleted: boolean;
    hasPassedQuizzes: boolean;
  };
  getLessonProgress: (
    lessonId: string,
    duration: number,
  ) => {
    isCompleted: boolean;
    watchTime: number;
    percentage: number;
  };
  updateLearnerName: (name: string, title?: string) => void;
  issueCertificate: (courseId: string, scorePercent?: number) => Certificate;
  resetAllProgress: () => void;
}

const LearningContext = createContext<LearningContextType | undefined>(
  undefined,
);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [userProgress, setUserProgress] = useState<UserProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load progress from localStorage", e);
    }
    return DEFAULT_STATE;
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    "course-react-fullstack",
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    "les-r1-1",
  );
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch (e) {
      console.error("Failed to save progress to localStorage", e);
    }
  }, [userProgress]);

  // Touch daily streak
  const touchStreak = () => {
    const today = new Date().toISOString().split("T")[0];
    setUserProgress((prev) => {
      const activeDates = new Set(prev.streak.activeDates || []);
      const wasActiveToday = activeDates.has(today);
      if (wasActiveToday) return prev;

      activeDates.add(today);
      const sortedDates = Array.from(activeDates).sort();
      const lastActive = prev.streak.lastActiveDate;
      let newStreak = prev.streak.currentStreak;

      if (lastActive) {
        const last = new Date(lastActive).getTime();
        const cur = new Date(today).getTime();
        const diffDays = Math.round((cur - last) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      return {
        ...prev,
        streak: {
          currentStreak: newStreak,
          maxStreak: Math.max(newStreak, prev.streak.maxStreak),
          lastActiveDate: today,
          activeDates: sortedDates,
        },
      };
    });
  };

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || null;

  let activeLesson: Lesson | null = null;
  if (activeCourse && selectedLessonId) {
    for (const mod of activeCourse.modules) {
      const found = mod.lessons.find((l) => l.id === selectedLessonId);
      if (found) {
        activeLesson = found;
        break;
      }
    }
  }

  const navigateToCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const targetCourse = courses.find((c) => c.id === courseId);
    if (targetCourse && targetCourse.modules[0]?.lessons[0]) {
      setSelectedLessonId(targetCourse.modules[0].lessons[0].id);
    }
    setActiveQuiz(null);
  };

  const navigateToLesson = (courseId: string, lessonId: string) => {
    setSelectedCourseId(courseId);
    setSelectedLessonId(lessonId);
    setActiveQuiz(null);
    touchStreak();
  };

  const openQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    touchStreak();
    setUserProgress((prev) => ({
      ...prev,
      completedLessons: {
        ...prev.completedLessons,
        [lessonId]: true,
      },
    }));
  };

  const updateWatchTime = (
    lessonId: string,
    seconds: number,
    totalDuration: number,
    courseId: string,
  ) => {
    touchStreak();
    setUserProgress((prev) => {
      const isComplete =
        seconds >= totalDuration * 0.9 || prev.completedLessons[lessonId];
      return {
        ...prev,
        lessonWatchTime: {
          ...prev.lessonWatchTime,
          [lessonId]: Math.floor(seconds),
        },
        completedLessons: {
          ...prev.completedLessons,
          ...(isComplete ? { [lessonId]: true } : {}),
        },
        lastWatched: {
          courseId,
          lessonId,
          timestamp: Math.floor(seconds),
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  const addNote = (
    courseId: string,
    lessonId: string,
    timestamp: number,
    content: string,
  ) => {
    const mins = Math.floor(timestamp / 60);
    const secs = Math.floor(timestamp % 60);
    const formattedTime = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    const newNote: UserNote = {
      id:
        "note-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      courseId,
      lessonId,
      timestamp,
      formattedTime,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    touchStreak();
    setUserProgress((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));
  };

  const updateNote = (noteId: string, content: string) => {
    setUserProgress((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === noteId ? { ...n, content } : n)),
    }));
  };

  const deleteNote = (noteId: string) => {
    setUserProgress((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== noteId),
    }));
  };

  const submitQuizAttempt = (
    attemptData: Omit<QuizAttempt, "id" | "completedAt">,
  ): QuizAttempt => {
    touchStreak();
    const newAttempt: QuizAttempt = {
      ...attemptData,
      id: "att-" + Date.now(),
      completedAt: new Date().toISOString(),
    };

    setUserProgress((prev) => {
      const existing = prev.quizAttempts[newAttempt.quizId] || [];
      return {
        ...prev,
        quizAttempts: {
          ...prev.quizAttempts,
          [newAttempt.quizId]: [newAttempt, ...existing],
        },
      };
    });

    return newAttempt;
  };

  const getCourseProgress = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      return {
        completedLessonsCount: 0,
        totalLessonsCount: 0,
        percentage: 0,
        isCourseCompleted: false,
        hasPassedQuizzes: false,
      };
    }

    let totalLessons = 0;
    let completedCount = 0;
    let totalQuizzes = 0;
    let passedQuizzes = 0;

    course.modules.forEach((m) => {
      m.lessons.forEach((l) => {
        totalLessons++;
        if (userProgress.completedLessons[l.id]) {
          completedCount++;
        }
      });
      if (m.quiz) {
        totalQuizzes++;
        const attempts = userProgress.quizAttempts[m.quiz.id];
        if (attempts && attempts.some((a) => a.passed)) {
          passedQuizzes++;
        }
      }
    });

    const lessonRatio = totalLessons > 0 ? completedCount / totalLessons : 0;
    const percentage = Math.round(lessonRatio * 100);
    const hasPassedQuizzes =
      totalQuizzes === 0 || passedQuizzes >= totalQuizzes;
    const isCourseCompleted = percentage >= 100 && hasPassedQuizzes;

    return {
      completedLessonsCount: completedCount,
      totalLessonsCount: totalLessons,
      percentage,
      isCourseCompleted,
      hasPassedQuizzes,
    };
  };

  const getLessonProgress = (lessonId: string, duration: number) => {
    const isCompleted = !!userProgress.completedLessons[lessonId];
    const watchTime = userProgress.lessonWatchTime[lessonId] || 0;
    const percentage =
      duration > 0
        ? Math.min(100, Math.round((watchTime / duration) * 100))
        : 0;
    return {
      isCompleted,
      watchTime,
      percentage: isCompleted ? 100 : percentage,
    };
  };

  const updateLearnerName = (name: string, title?: string) => {
    setUserProgress((prev) => ({
      ...prev,
      learnerName: name,
      learnerTitle: title || prev.learnerTitle,
    }));
  };

  const issueCertificate = (
    courseId: string,
    scorePercent = 95,
  ): Certificate => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) throw new Error("Course not found");

    const existing = userProgress.certificates.find(
      (c) => c.courseId === courseId,
    );
    if (existing) return existing;

    const hours = (course.totalDurationSeconds / 3600).toFixed(1) + " Hours";
    const newCert: Certificate = {
      id: "cert-" + courseId + "-" + Date.now(),
      courseId,
      courseTitle: course.title,
      learnerName: userProgress.learnerName || "Learner",
      issueDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      scorePercent,
      credentialId: `GLYNAC-${new Date().getFullYear()}-${courseId.slice(-4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
      instructorName: course.instructor.name,
      instructorTitle: course.instructor.title,
      totalHours: hours,
    };

    setUserProgress((prev) => ({
      ...prev,
      certificates: [...prev.certificates, newCert],
    }));

    return newCert;
  };

  const resetAllProgress = () => {
    setUserProgress({
      learnerName: "Alex Morgan",
      learnerTitle: "Full-Stack Developer",
      completedLessons: {},
      lessonWatchTime: {},
      lastWatched: null,
      quizAttempts: {},
      notes: [],
      streak: {
        currentStreak: 1,
        maxStreak: 1,
        lastActiveDate: new Date().toISOString().split("T")[0],
        activeDates: [new Date().toISOString().split("T")[0]],
      },
      certificates: [],
    });
  };

  return (
    <LearningContext.Provider
      value={{
        courses,
        userProgress,
        activeCourse,
        activeLesson,
        activeQuiz,
        selectedCourseId,
        selectedLessonId,
        navigateToCourse,
        navigateToLesson,
        openQuiz,
        closeQuiz,
        markLessonComplete,
        updateWatchTime,
        addNote,
        updateNote,
        deleteNote,
        submitQuizAttempt,
        getCourseProgress,
        getLessonProgress,
        updateLearnerName,
        issueCertificate,
        resetAllProgress,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
};
