import { TimerReset } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-text-tertiary md:flex-row">
        <div className="flex items-center gap-2 font-display text-text-secondary">
          <TimerReset size={16} className="text-brand" />
          AI Productivity Companion
        </div>
        <p>Built for people who do their best work under a ticking clock.</p>
      </div>
    </footer>
  );
}
