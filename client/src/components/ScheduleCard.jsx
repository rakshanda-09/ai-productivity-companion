import { priorityStyle } from "../utils/priority";
import { blockDurationMinutes, formatTime, isBlockActive } from "../utils/scheduler";
import { classNames } from "../utils/helpers";

export default function ScheduleCard({ block }) {
  const style = priorityStyle(block.priorityLevel);
  const active = isBlockActive(block);

  return (
    <div
      className={classNames(
        "flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3.5 transition-colors",
        active && "border-brand/50 bg-brand/5"
      )}
    >
      <div className="flex w-20 flex-shrink-0 flex-col font-mono text-xs text-text-secondary">
        <span className="font-semibold text-text-primary">{formatTime(block.start)}</span>
        <span>{formatTime(block.end)}</span>
      </div>

      <span className={classNames("h-8 w-1 flex-shrink-0 rounded-full", style.dot)} />

      <div className="flex-1">
        <p className="font-medium">{block.title}</p>
        <p className="text-xs text-text-tertiary">{blockDurationMinutes(block)} min block</p>
      </div>

      {active && (
        <span className="badge bg-brand/15 text-brand">
          <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-brand" />
          Now
        </span>
      )}

      <span className={classNames("badge", style.bg, style.text)}>{block.priorityLevel}</span>
    </div>
  );
}
