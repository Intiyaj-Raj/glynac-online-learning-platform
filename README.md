# Glynac E-Learn

A React + TypeScript learning platform with a course catalog, lesson player, transcript, notes, downloadable learning resources, quizzes, progress tracking, and certificates.

## Requirements

- Node.js 20.19+ (or a version supported by Vite 8)
- npm 10+

## Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (the dev server uses port `3000`).

## Production build

```bash
npm run lint
npm run build
npm run preview
```

## Main features

- Browse courses and view course/module/lesson details.
- Watch lesson videos with playback controls and resume progress.
- Follow the transcript without moving the page; only the transcript panel scrolls.
- Create timestamped notes and export them as Markdown.
- Preview course resources. External resources open at their source; placeholder course handouts are generated as downloadable Markdown files.
- Take single-choice, multi-select, and sequence-order quizzes.
- Review every answer with correctness, the expected answer, and an explanation; retake assessments.
- Track learning progress and certificates in browser local storage.

## Data and persistence

Course content is stored in `src/data/coursesData.ts`. Learner progress is stored locally in the browser under `glynac_elearn_user_progress_v2`. This demo does not require a backend service.

## Demo video walkthrough

See [`DEMO-WALKTHROUGH.md`](./DEMO-WALKTHROUGH.md) for the suggested recording flow and narration. Record the running app with Loom or a screen recorder and add the resulting MP4/link when submitting; a recording cannot be generated from the source code alone.
