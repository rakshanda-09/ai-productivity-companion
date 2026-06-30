# AI Productivity Companion

An AI-assisted productivity system for people racing the clock. Four engines work together on
every task you add:

1. **Intelligent Task Prioritization** — scores each task on urgency, importance, and effort risk; assigns LOW / MEDIUM / HIGH / CRITICAL.
2. **AI Smart Scheduler** — drops your pending tasks into concrete time blocks across your working hours.
3. **AI Rescue Mode** — flags tasks that are running out of time and generates a recovery plan (SAFE / HIGH_RISK / CRITICAL).
4. **AI Productivity Coach** — a real LLM (OpenAI or Gemini) that answers questions using your live task data as context.

On top of that, **context-aware browser notifications** turn those engines from passive dashboards
into proactive alerts: you're notified the moment a task escalates to CRITICAL, the moment Rescue
Mode flags something new, or a few minutes before a scheduled time block starts — not a generic
"task due" reminder, but one driven by what the AI has actually concluded about your day.

The first three engines are deterministic, rule-based scoring systems — fast, free, and fully
explainable, with no external API required. Only the Coach calls out to a real AI provider, since
that's the one feature that genuinely needs open-ended reasoning.

## Stack

- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT auth
- **Frontend:** React (Vite), React Router, Tailwind CSS, Recharts, lucide-react

## Project structure

```
server/   Express API — models, controllers, routes, the 4 AI engines
client/   React app — pages, components, API layer
database/ seed.js — populates a demo account with sample tasks
docs/     API.md — full endpoint reference
```

## Setup

### 1. Prerequisites
- Node.js 18+
- A running MongoDB instance (local `mongod`, or a free Atlas cluster)

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Configure environment variables
```bash
cd server
cp .env.example .env
```
Edit `server/.env`:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `AI_PROVIDER` — `openai` or `gemini`
- `OPENAI_API_KEY` **or** `GEMINI_API_KEY` — required for the AI Coach feature to respond. Every
  other feature works without this; the Coach will return a clear error telling you which key to add
  until one is set.

### 4. (Optional) Seed demo data
```bash
npm run seed
```
Creates `demo@lastminute.dev` / `password123` with a few sample tasks.

### 5. Run it
```bash
npm run dev
```
This starts the API on `http://localhost:5000` and the React app on `http://localhost:5173`
(which proxies `/api` calls to the server — no CORS setup needed in dev).

## Notes on the original scaffold

- The original folder tree included both Mongoose-style models and a `database/schema.sql` +
  `seed.sql` pair. Since the backend uses MongoDB, the SQL files were replaced with `database/seed.js`,
  a Mongoose-based seed script — there's no SQL schema to maintain since Mongoose's schemas
  (`server/models/*.js`) already define the structure.
- `client/src/assets/` (logo.png, hero.png) and `client/public/favicon.ico` were intentionally left
  out of the build — the UI uses an inline SVG mark and lucide-react icons instead, so there are no
  binary assets to swap out if you want to re-brand it. Drop your own files into those folders and
  reference them whenever you're ready.

## Full API reference

See [`docs/API.md`](./docs/API.md).
