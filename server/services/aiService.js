/**
 * AI Coach Service
 * ----------------
 * Uses Google's Gemini API to generate personalized productivity advice.
 */

const axios = require("axios");

const SYSTEM_PROMPT = `You are the AI Productivity Coach inside "AI Productivity Companion", an app that
helps people who are close to missing deadlines. You receive a short summary of the user's current
tasks and productivity stats, plus their question. Reply like a sharp, encouraging mentor:
- Be concrete and specific to the data you were given, never generic filler.
- Prefer short paragraphs or a tight bullet list over long prose.
- If they're at real risk of missing a deadline, say so plainly and tell them what to do first.
- Keep the whole reply under ~150 words.`;

function buildContextBlock(context = {}) {
  const { tasks = [], stats = {} } = context;

  const taskLines = tasks
    .slice(0, 10)
    .map(
      (t) =>
        `- "${t.title}" | priority: ${
          t.priority?.level || "N/A"
        } | due: ${new Date(t.deadline).toLocaleString()}`
    )
    .join("\n");

  return [
    `Pending tasks (${tasks.length} total, showing up to 10):`,
    taskLines || "(no pending tasks)",
    "",
    `Stats: ${stats.completed ?? 0} completed, ${stats.overdue ?? 0} overdue, ${stats.atRisk ?? 0} currently at risk.`,
  ].join("\n");
}

async function callGemini(userMessage, contextBlock) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const err = new Error(
      "AI Coach has no GEMINI_API_KEY configured. Add one to server/.env."
    );
    err.statusCode = 503;
    throw err;
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const { data } = await axios.post(url, {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\n${contextBlock}\n\nUser question: ${userMessage}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 350,
    },
  });

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join("") || "";

  return text.trim() || "I couldn't generate a response right now.";
}

/**
 * @param {string} userMessage
 * @param {{tasks: Array, stats: Object}} context
 */
async function getCoachReply(userMessage, context) {
  const contextBlock = buildContextBlock(context);
  return callGemini(userMessage, contextBlock);
}

module.exports = { getCoachReply };