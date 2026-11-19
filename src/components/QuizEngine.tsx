import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Award,
  FileText,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Quiz, QuizQuestion, QuizAttempt } from "../types";
import { useLearning } from "../context/LearningContext";

interface QuizEngineProps {
  quiz: Quiz;
  onClose: () => void;
  onViewCertificate?: (courseId: string) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  quiz,
  onClose,
  onViewCertificate,
}) => {
  const { submitQuizAttempt, userProgress, issueCertificate } = useLearning();

  // Active state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(
    quiz.timeLimitSeconds,
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [instantFeedbackMode, setInstantFeedbackMode] = useState<boolean>(true);
  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(
    null,
  );

  // Drag-to-order state per question
  const [orderState, setOrderState] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    quiz.questions.forEach((q) => {
      if (q.type === "drag-order") {
        // Initialize with default or slightly shuffled order
        init[q.id] = q.options.map((o) => o.id);
      }
    });
    return init;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown Timer
  useEffect(() => {
    if (isSubmitted) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSubmitted]);

  // Current Question
  const currentQuestion = quiz.questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === quiz.questions.length - 1;

  // Single select option change
  const handleSingleSelect = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Check correctness of a question
  const isQuestionCorrect = (q: QuizQuestion, userAns: any): boolean => {
    if (!userAns) return false;
    if (q.type === "multiple-choice") {
      return userAns === q.correctAnswer;
    }
    if (q.type === "multi-select") {
      const correctArr = [...(q.correctAnswer as string[])].sort();
      const userArr = [...((userAns as string[]) || [])].sort();
      if (correctArr.length !== userArr.length) return false;
      return correctArr.every((val, i) => val === userArr[i]);
    }
    if (q.type === "drag-order") {
      const correctArr = q.correctAnswer as string[];
      const userArr = (userAns as string[]) || orderState[q.id];
      if (!userArr || userArr.length !== correctArr.length) return false;
      return correctArr.every((val, i) => val === userArr[i]);
    }
    return false;
  };

  // Final Submit Handler
  const handleSubmit = () => {
    if (isSubmitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    // Merge drag-order answers
    const finalAnswers = { ...answers };
    quiz.questions.forEach((q) => {
      if (q.type === "drag-order" && !finalAnswers[q.id]) {
        finalAnswers[q.id] = orderState[q.id];
      }
    });

    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (isQuestionCorrect(q, finalAnswers[q.id])) {
        correctCount++;
      }
    });

    const scorePercent = Math.round(
      (correctCount / quiz.questions.length) * 100,
    );
    const passed = scorePercent >= quiz.passingScorePercent;
    const timeSpent = quiz.timeLimitSeconds - timeRemaining;

    const attempt = submitQuizAttempt({
      quizId: quiz.id,
      courseId: quiz.courseId,
      moduleId: quiz.moduleId,
      scorePercent,
      passed,
      userAnswers: finalAnswers,
      timeSpentSeconds: timeSpent,
      totalQuestions: quiz.questions.length,
      correctCount,
    });

    setCompletedAttempt(attempt);
    setIsSubmitted(true);

    if (passed) {
      // Issue certificate if all quizzes passed
      issueCertificate(quiz.courseId, scorePercent);
    }
  };

  // Format timer
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                Assessment
              </span>
              <span className="text-xs text-slate-400">
                Pass Mark: {quiz.passingScorePercent}%
              </span>
            </div>
            <h2 className="text-base font-bold text-white truncate max-w-md">
              {quiz.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold ${
                  timeRemaining < 60
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse"
                    : "bg-slate-800 border-slate-700 text-slate-200"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeRemaining)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CASE A: RESULTS BREAKDOWN VIEW                                */}
        {/* ============================================================== */}
        {isSubmitted && completedAttempt ? (
          <div className="flex-1 overflow-y-auto p-8 text-center space-y-4">
            <p className="text-sm text-slate-400">Your score</p>
            <p className="text-5xl font-extrabold text-white">
              {completedAttempt.scorePercent}%
            </p>
            <p
              className={`text-sm font-semibold ${completedAttempt.passed ? "text-emerald-400" : "text-rose-400"}`}
            >
              {completedAttempt.passed ? "Passed!" : "Not passed yet"} &mdash;{" "}
              {completedAttempt.correctCount}/{completedAttempt.totalQuestions}{" "}
              correct
            </p>
            <div className="text-left space-y-3 mt-6">
              {quiz.questions.map((q, index) => {
                const userAnswer = completedAttempt.userAnswers[q.id];
                const correct = isQuestionCorrect(q, userAnswer);
                const labels = (ids: string | string[] | undefined) => {
                  const values = Array.isArray(ids) ? ids : ids ? [ids] : [];
                  return values.map(
                    (id) =>
                      q.options.find((option) => option.id === id)?.label || id,
                  );
                };
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/70"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-xs font-bold text-white">
                        Q{index + 1}. {q.question}
                      </p>
                      <span
                        className={`text-[10px] font-bold ${correct ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        {correct ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Your answer:{" "}
                      {labels(userAnswer).join(" • ") || "Not answered"}
                    </p>
                    {!correct && (
                      <p className="text-[11px] text-emerald-300 mt-1">
                        Correct answer: {labels(q.correctAnswer).join(" • ")}
                      </p>
                    )}
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  setCurrentQuestionIdx(0);
                  setAnswers({});
                  setTimeRemaining(quiz.timeLimitSeconds);
                  setIsSubmitted(false);
                  setCompletedAttempt(null);
                  const reset: Record<string, string[]> = {};
                  quiz.questions.forEach((q) => {
                    if (q.type === "drag-order")
                      reset[q.id] = q.options.map((o) => o.id);
                  });
                  setOrderState(reset);
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Retake Quiz
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* CASE B: ACTIVE QUIZ QUESTIONS STEPPER                          */
          /* ============================================================== */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Progress Stepper Bar */}
            <div className="w-full bg-slate-800 h-1">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{
                  width: `${((currentQuestionIdx + 1) / quiz.questions.length) * 100}%`,
                }}
              />
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-indigo-400">
                  Question {currentQuestionIdx + 1} of {quiz.questions.length}
                </span>
                <span className="uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-slate-800">
                  {currentQuestion.type === "multiple-choice"
                    ? "Single Choice"
                    : currentQuestion.type === "multi-select"
                      ? "Multi-Select (Choose All)"
                      : "Drag / Reorder Sequence"}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {currentQuestion.question}
              </h3>

              {/* Optional Code Snippet */}
              {currentQuestion.codeSnippet && (
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                  <code>{currentQuestion.codeSnippet}</code>
                </pre>
              )}

              {/* ========================================================== */}
              {/* QUESTION TYPE 1: MULTIPLE CHOICE                          */}
              {/* ========================================================== */}
              {currentQuestion.type === "multiple-choice" && (
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() =>
                          handleSingleSelect(currentQuestion.id, opt.id)
                        }
                        className={`p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-indigo-600/20 border-indigo-500 text-white font-medium shadow-md"
                            : "bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-indigo-400 bg-indigo-600"
                                : "border-slate-600"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                          </div>
                          <span>{opt.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === "multi-select" && (
                <div className="space-y-2">
                  {currentQuestion.options.map((opt) => {
                    const selected = (
                      (answers[currentQuestion.id] as string[]) || []
                    ).includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selected ? "bg-indigo-600/20 border-indigo-500 text-white" : "bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-600"}`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) =>
                            setAnswers((prev) => {
                              const current =
                                (prev[currentQuestion.id] as string[]) || [];
                              return {
                                ...prev,
                                [currentQuestion.id]: e.target.checked
                                  ? [...current, opt.id]
                                  : current.filter((id) => id !== opt.id),
                              };
                            })
                          }
                          className="accent-indigo-500 w-4 h-4"
                        />
                        <span className="text-sm">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
              {currentQuestion.type === "drag-order" && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">
                    Use the arrows to arrange these steps in the correct order.
                  </p>
                  {(
                    orderState[currentQuestion.id] ||
                    currentQuestion.options.map((o) => o.id)
                  ).map((id, index, list) => {
                    const option = currentQuestion.options.find(
                      (o) => o.id === id,
                    )!;
                    const move = (direction: number) =>
                      setOrderState((prev) => {
                        const next = [...list];
                        const target = index + direction;
                        if (target < 0 || target >= next.length) return prev;
                        [next[index], next[target]] = [
                          next[target],
                          next[index],
                        ];
                        return { ...prev, [currentQuestion.id]: next };
                      });
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800"
                      >
                        <span className="text-xs font-mono text-indigo-300 w-6">
                          {index + 1}
                        </span>
                        <span className="text-sm text-slate-200 flex-1">
                          {option.label}
                        </span>
                        <button
                          aria-label="Move up"
                          disabled={index === 0}
                          onClick={() => move(-1)}
                          className="p-2 rounded-lg bg-slate-800 disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          aria-label="Move down"
                          disabled={index === list.length - 1}
                          onClick={() => move(1)}
                          className="p-2 rounded-lg bg-slate-800 disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {instantFeedbackMode && answers[currentQuestion.id] && (
                <div
                  className={`p-3 rounded-xl border text-xs ${isQuestionCorrect(currentQuestion, answers[currentQuestion.id]) ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200" : "bg-amber-500/10 border-amber-500/30 text-amber-100"}`}
                >
                  <p className="font-bold mb-1">
                    {isQuestionCorrect(
                      currentQuestion,
                      answers[currentQuestion.id],
                    )
                      ? "Correct answer"
                      : "Keep thinking"}
                  </p>
                  <p className="leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Instant Hint / Feedback toggle info */}
              {currentQuestion.hint && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Hint: {currentQuestion.hint}</span>
                </div>
              )}
            </div>

            {/* Stepper Footer Controls */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <button
                type="button"
                disabled={currentQuestionIdx === 0}
                onClick={() =>
                  setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))
                }
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {isLastQuestion ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Submit Assessment
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentQuestionIdx((prev) =>
                        Math.min(quiz.questions.length - 1, prev + 1),
                      )
                    }
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
