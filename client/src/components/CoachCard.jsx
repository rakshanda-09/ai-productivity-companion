import { Sparkles, User } from "lucide-react";
import { classNames } from "../utils/helpers";

export default function CoachCard({ role, content, isError }) {
  const isUser = role === "user";

  return (
    <div className={classNames("flex gap-3", isUser && "flex-row-reverse")}>
      <span
        className={classNames(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-surface-raised text-text-secondary" : "bg-brand/15 text-brand"
        )}
      >
        {isUser ? <User size={15} /> : <Sparkles size={15} />}
      </span>

      <div
        className={classNames(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
          isUser ? "bg-surface-raised text-text-primary" : "bg-surface border border-border text-text-primary",
          isError && "border-risk-critical/40 text-risk-critical"
        )}
      >
        {content}
      </div>
    </div>
  );
}
