import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { priorityStyle } from "../utils/priority";
import { classNames, formatDeadline } from "../utils/helpers";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function CalendarView({ tasks = [] }) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const tasksByDay = useMemo(() => {
    const map = new Map();
    tasks.forEach((t) => {
      const d = new Date(t.deadline);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });
    return map;
  }, [tasks]);

  const today = new Date();
  const selectedTasks = selected ? tasksByDay.get(`${selected.getFullYear()}-${selected.getMonth()}-${selected.getDate()}`) || [] : [];

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">
          {cursor.toLocaleString([], { month: "long", year: "numeric" })}
        </h3>
        <div className="flex gap-1.5">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="rounded-lg p-1.5 hover:bg-surface-raised"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="rounded-lg p-1.5 hover:bg-surface-raised"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-text-tertiary">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 font-mono">
            {d}
          </div>
        ))}

        {cells.map((date, idx) => {
          if (!date) return <div key={idx} />;
          const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          const dayTasks = tasksByDay.get(key) || [];
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = selected && date.toDateString() === selected.toDateString();

          return (
            <button
              key={idx}
              onClick={() => setSelected(date)}
              className={classNames(
                "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border text-sm transition-colors",
                isSelected ? "border-brand bg-brand/10" : "border-transparent hover:border-border",
                isToday && !isSelected && "border-border bg-surface-raised"
              )}
            >
              <span className={isToday ? "font-semibold text-brand" : "text-text-primary"}>{date.getDate()}</span>
              <div className="flex gap-0.5">
                {dayTasks.slice(0, 3).map((t, i) => (
                  <span key={i} className={classNames("h-1.5 w-1.5 rounded-full", priorityStyle(t.priority?.level).dot)} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-2 text-sm font-medium text-text-secondary">
            {selected.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
          </p>
          {selectedTasks.length === 0 ? (
            <p className="text-sm text-text-tertiary">No deadlines this day.</p>
          ) : (
            <ul className="space-y-2">
              {selectedTasks.map((t) => (
                <li key={t._id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2">
                    <span className={classNames("h-1.5 w-1.5 rounded-full", priorityStyle(t.priority?.level).dot)} />
                    {t.title}
                  </span>
                  <span className="text-text-tertiary font-mono text-xs">{formatDeadline(t.deadline)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
