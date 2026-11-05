import { LearningProvider, useLearning } from "./context/LearningContext";

function Debug() {
  const { courses, userProgress, resetAllProgress } = useLearning();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-2xl font-extrabold mb-1">glynac e-learn</h1>
      <p className="text-slate-400 text-sm mb-6">Learning Context check</p>

      <div className="max-w-2xl space-y-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm">
          <p>
            Learner: <b>{userProgress.learnerName}</b>
          </p>
          <p>
            Streak: <b>{userProgress.streak.currentStreak}</b> days
          </p>
          <p>
            Notes: <b>{userProgress.notes.length}</b>
          </p>
          <p>
            Certificates: <b>{userProgress.certificates.length}</b>
          </p>
          <p>
            Courses loaded: <b>{courses.length}</b>
          </p>
        </div>

        <button
          onClick={resetAllProgress}
          className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold"
        >
          Reset all progress (localStorage test)
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LearningProvider>
      <Debug />
    </LearningProvider>
  );
}
