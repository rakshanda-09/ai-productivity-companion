import { Check, Flame, Trash2 } from "lucide-react";
import { FREQUENCY_LABEL } from "../services/habitService";
import { classNames } from "../utils/helpers";

export default function HabitCard({ habit, onCheckIn, onDelete }) {
  const isDone = !habit.dueToday;

  return (
    <div className="card flex items-center gap-4">
      <button
        onClick={() => onCheckIn(habit)}
        title={isDone ? "Checked in" : "Check in for today"}
        className={classNames(
          "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border transition-colors",
          isDone
            ? "border-risk-safe bg-risk-safe/15 text-risk-safe"
            : "border-border text-text-tertiary hover:border-brand hover:text-brand"
        )}
      >
        <Check size={18} />
      </button>

      <div className="flex-1">
        <p className="font-medium">{habit.title}</p>
        {habit.description && <p className="mt-0.5 text-sm text-text-secondary">{habit.description}</p>}
        <p className="mt-1 text-xs text-text-tertiary">{FREQUENCY_LABEL[habit.frequency]}</p>
      </div>

      <div className="flex flex-shrink-0 items-center gap-4">
        <div className="text-right">
          <div className="flex items-center gap-1.5 font-mono text-lg font-bold text-brand">
            <Flame size={16} className={habit.currentStreak > 0 ? "text-risk-high" : "text-text-tertiary"} />
            {habit.currentStreak}
          </div>
          <p className="text-[11px] text-text-tertiary">best {habit.longestStreak}</p>
        </div>

        <button
          onClick={() => onDelete(habit)}
          className="rounded-lg p-1.5 text-text-tertiary hover:bg-risk-critical/10 hover:text-risk-critical"
          title="Delete habit"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}