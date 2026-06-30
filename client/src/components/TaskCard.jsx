import { useState } from "react";
import { Check, Clock, Pencil, Trash2 } from "lucide-react";
import { priorityStyle } from "../utils/priority";
import { formatCountdown, formatDeadline, classNames } from "../utils/helpers";

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const [busy, setBusy] = useState(false);
  const style = priorityStyle(task.priority?.level);
  const { label, isOverdue } = formatCountdown(task.deadline);
  const isCompleted = task.status === "completed";

  async function handleToggle() {
    setBusy(true);
    try {
      await onToggleComplete(task);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={classNames(
        "card flex items-start gap-4 transition-shadow",
        !isCompleted && task.priority?.level === "CRITICAL" && "shadow-glow-critical"
      )}
    >
      <button
        onClick={handleToggle}
        disabled={busy}
        title={isCompleted ? "Mark as pending" : "Mark as completed"}
        className={classNames(
          "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-colors",
          isCompleted ? "border-risk-safe bg-risk-safe/15 text-risk-safe" : "border-border text-transparent hover:border-brand"
        )}
      >
        {isCompleted && <Check size={14} />}
      </button>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <h4 className={classNames("font-medium", isCompleted && "text-text-tertiary line-through")}>
            {task.title}
          </h4>

          <span className={classNames("badge", style.bg, style.text)}>
            <span className={classNames("h-1.5 w-1.5 rounded-full", style.dot)} />
            {task.priority?.level || "LOW"}
          </span>
        </div>

        {task.description && <p className="mt-1 text-sm text-text-secondary">{task.description}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-tertiary">
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {formatDeadline(task.deadline)}
          </span>

          {!isCompleted && (
            <span
              className={classNames(
                "font-mono font-semibold",
                isOverdue ? "text-risk-critical" : "text-text-secondary"
              )}
            >
              {isOverdue ? `${label} overdue` : `${label} left`}
            </span>
          )}

          <span>{task.estimatedMinutes}m est.</span>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5">
        <button
          onClick={() => onEdit(task)}
          className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-raised hover:text-text-primary"
          title="Edit task"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="rounded-lg p-1.5 text-text-tertiary hover:bg-risk-critical/10 hover:text-risk-critical"
          title="Delete task"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
