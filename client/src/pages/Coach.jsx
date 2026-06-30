import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import CoachCard from "../components/CoachCard.jsx";
import { sendMessage } from "../services/coachService";

const SUGGESTIONS = [
  "What should I focus on right now?",
  "I have three deadlines tomorrow, what's my plan?",
  "How do I stop procrastinating on my biggest task?",
];

const WELCOME = {
  role: "coach",
  content:
    "Hey — I can see your current tasks and priorities. Ask me anything about what to work on, how to recover from a tight deadline, or how to structure your day.",
};

export default function Coach() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text) {
    const content = text ?? input;
    if (!content.trim() || sending) return;

    setMessages((m) => [...m, { role: "user", content }]);
    setInput("");
    setSending(true);

    const { reply, error } = await sendMessage(content);

    setMessages((m) => [
      ...m,
      error
        ? { role: "coach", content: error, isError: true }
        : { role: "coach", content: reply },
    ]);
    setSending(false);
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
          <Sparkles size={20} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold">AI Productivity Coach</h1>
          <p className="text-text-secondary">Context-aware advice based on your live task list.</p>
        </div>
      </div>

      <div className="card flex-1 space-y-4 overflow-y-auto">
        {messages.map((m, idx) => (
          <CoachCard key={idx} role={m.role} content={m.content} isError={m.isError} />
        ))}
        {sending && <CoachCard role="coach" content="Thinking..." />}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => handleSend(s)} className="btn-secondary px-3 py-1.5 text-xs">
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the coach something..."
          className="input-field"
        />
        <button type="submit" disabled={sending} className="btn-primary px-4">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
