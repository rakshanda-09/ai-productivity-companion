# API Reference

Base URL (dev): `http://localhost:5000/api`

All responses are wrapped as `{ success: boolean, data?: any, message?: string }`.
Authenticated routes require `Authorization: Bearer <token>`.

## Auth

| Method | Route | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/auth/register` | – | `{ name, email, password }` | Create an account, returns `{ user, token }` |
| POST | `/auth/login` | – | `{ email, password }` | Returns `{ user, token }` |
| GET | `/auth/me` | ✅ | – | Current user |
| PUT | `/auth/me` | ✅ | `{ name?, workingHours?, preferences? }` | Update profile / scheduler settings |

## Tasks — Priority Engine

| Method | Route | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/tasks` | ✅ | `{ title, description?, deadline, estimatedMinutes, importance? }` | Create a task; priority is calculated automatically |
| GET | `/tasks?status=pending\|completed` | ✅ | – | List tasks (sorted by priority score) + `stats` |
| GET | `/tasks/:id` | ✅ | – | Single task |
| PUT | `/tasks/:id` | ✅ | any editable field | Update task; priority recalculates if deadline/effort/importance changes |
| DELETE | `/tasks/:id` | ✅ | – | Delete task |
| POST | `/tasks/recalculate` | ✅ | – | Re-score every pending task (useful as a cron job) |

Priority object shape: `{ level: "LOW"|"MEDIUM"|"HIGH"|"CRITICAL", score: 0-100, breakdown: { urgency, importance, effortRisk } }`

## Schedule — Smart Scheduler

| Method | Route | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/schedule/generate` | ✅ | `{ date? }` (ISO date, defaults to today) | Builds/overwrites that day's schedule from pending tasks |
| GET | `/schedule?date=` | ✅ | – | Fetch a day's schedule (`null` if none generated yet) |

## Rescue — Deadline Recovery Planner

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/rescue` | ✅ | Scans all pending tasks, returns the ones at `HIGH_RISK` or `CRITICAL` with a recovery plan |
| GET | `/rescue/:taskId` | ✅ | Recovery plan for one specific task |

## Coach — AI Productivity Coach

| Method | Route | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/coach` | ✅ | `{ message }` | Sends your task list + stats as context to the configured LLM, returns `{ reply }` |

If no `OPENAI_API_KEY` / `GEMINI_API_KEY` is set for the chosen `AI_PROVIDER`, this returns
`503` with a message telling you exactly which env var to add.

## Errors

```json
{ "success": false, "message": "Human-readable reason" }
```

Common status codes: `400` validation, `401` auth, `404` not found, `409` conflict (duplicate email),
`502/503` AI Coach provider issue, `500` unexpected.
