import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  CalendarClock,
  Check,
  LifeBuoy,
  Sparkles,
  TimerReset,
  X,
} from "lucide-react";

const FEATURES = [
  {
    number: "01",
    icon: Brain,
    title: "Intelligent Task Prioritization",
    description:
      "Every task gets scored on urgency, importance, and effort the moment you add it — so you always know what to touch first.",
    output: "Priority: CRITICAL",
    accent: "text-risk-critical",
    iconBg: "from-risk-critical/20 to-risk-critical/5",
  },
  {
    number: "02",
    icon: CalendarClock,
    title: "AI Smart Scheduler",
    description:
      "Your task list gets dropped straight into time blocks across your working hours — a finished day plan, not a guess.",
    output: "09:00 – 10:00  Finish report",
    accent: "text-brand",
    iconBg: "from-brand/20 to-brand/5",
  },
  {
    number: "03",
    icon: LifeBuoy,
    title: "AI Rescue Mode",
    description:
      "When a deadline gets dangerously close, you get a step-by-step recovery plan built for exactly how much time is left.",
    output: "12h left → Recovery plan ready",
    accent: "text-violet",
    iconBg: "from-violet/20 to-violet/5",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "AI Productivity Coach",
    description:
      "A context-aware assistant that's actually read your task list — ask it anything and get advice tied to your real day.",
    output: '"Prioritize the shortest deadline first."',
    accent: "text-risk-safe",
    iconBg: "from-risk-safe/20 to-risk-safe/5",
  },
];

const HOW_IT_WORKS = [
  { title: "Add your tasks", description: "Deadline, effort estimate, and how much it matters — that's all the AI needs." },
  { title: "Get an instant priority", description: "The Priority Engine scores it LOW through CRITICAL in real time." },
  { title: "Let the day build itself", description: "The Scheduler arranges everything into time blocks across your working hours." },
  { title: "Get rescued if you slip", description: "Falling behind triggers Rescue Mode with a concrete recovery plan." },
];

const WITHOUT = [
  "A to-do list that just sits there",
  "Reminders you swipe away and forget",
  "Finding out you're behind the night before",
  "Guessing what to work on next",
];

const WITH = [
  "Tasks ranked the moment you add them",
  "A finished day plan built automatically",
  "An early warning when a deadline gets risky",
  "A coach that knows your actual workload",
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center md:pt-28 md:pb-20">
        <span className="badge mb-6 bg-gradient-to-r from-brand/15 to-violet/15 text-brand">
          <TimerReset size={13} />
          AI Productivity System
        </span>
        <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
          Stop living five minutes{" "}
          <span className="bg-gradient-to-r from-brand via-violet to-brand-glow bg-clip-text text-transparent">
            before the deadline.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-text-secondary">
          AI Productivity Companion ranks your tasks, builds your day, and pulls you back from the
          edge when a deadline gets dangerously close — with an AI coach watching your back the
          whole time.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="btn-primary px-5 py-3">
            Get started free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary px-5 py-3">
            Log in
          </Link>
        </div>

        <div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-text-tertiary">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-risk-critical" /> Real-time priority scoring
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Automatic daily scheduling
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" /> Built-in deadline rescue
          </span>
        </div>
      </section>

      {/* How it works — numbered timeline */}
      <section className="border-y border-border bg-surface/60 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-display text-2xl font-semibold sm:text-3xl">How it actually works</h2>
          <div className="relative mt-12 grid gap-10 sm:grid-cols-4">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent sm:block" />
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={step.title} className="relative text-center sm:text-left">
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface font-mono text-sm font-semibold text-brand sm:mx-0 mx-auto">
                  {idx + 1}
                </span>
                <h3 className="mt-4 font-medium">{step.title}</h3>
                <p className="mt-1.5 text-sm text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold">Four AI features, one system.</h2>
        <p className="mt-2 max-w-xl text-text-secondary">
          Each one solves a different moment of falling behind — together they cover the whole arc
          from "added a task" to "barely made it."
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {FEATURES.map(({ number, icon: Icon, title, description, output, accent, iconBg }) => (
            <div
              key={title}
              className="card relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:border-brand/40"
            >
              <span className="absolute right-5 top-5 font-mono text-3xl font-bold text-text-primary/5">
                {number}
              </span>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} ${accent}`}>
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{description}</p>
              <p className={`mt-4 font-mono text-sm font-semibold ${accent}`}>{output}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Before / after */}
      <section className="border-y border-border bg-surface/60 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-display text-2xl font-semibold sm:text-3xl">
            A normal day, with and without it.
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="card">
              <p className="text-sm font-semibold text-text-tertiary">Without</p>
              <ul className="mt-4 space-y-3">
                {WITHOUT.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <X size={15} className="mt-0.5 flex-shrink-0 text-risk-critical" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-brand via-violet to-brand-glow p-[1.5px]">
              <div className="h-full rounded-[15px] bg-surface p-5">
                <p className="text-sm font-semibold text-brand">With AI Productivity Companion</p>
                <ul className="mt-4 space-y-3">
                  {WITH.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-text-primary">
                      <Check size={15} className="mt-0.5 flex-shrink-0 text-risk-safe" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-[20px] bg-gradient-to-r from-brand via-violet to-brand-glow p-[1.5px]">
          <div className="flex flex-col items-center gap-4 rounded-[18.5px] bg-surface px-6 py-14 text-center">
            <h2 className="font-display text-2xl font-semibold">Your next deadline is already counting down.</h2>
            <p className="max-w-md text-text-secondary">
              Give your task list to the AI and get your day back in order in under a minute.
            </p>
            <Link to="/register" className="btn-primary px-6 py-3">
              Create your free account <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}