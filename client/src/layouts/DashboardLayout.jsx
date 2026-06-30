import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Flame } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import NotificationWatcher from "../components/NotificationWatcher.jsx";
import { fetchTasks } from "../api/taskApi";
import { formatCountdown, classNames } from "../utils/helpers";

/** Live, ticking countdown to the single nearest pending deadline - the
 * app's signature element, echoed in TaskCard and RescueCard. */
function NextDeadlineTicker() {
  const [nearest, setNearest] = useState(null);
  const [, setNow] = useState(Date.now());

  useEffect(() => {
    fetchTasks("pending").then(({ tasks }) => {
      const upcoming = tasks
        .filter((t) => t.status !== "completed")
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
      setNearest(upcoming || null);
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!nearest) return <span className="text-sm text-text-tertiary">No upcoming deadlines — you're clear.</span>;

  const { label, isOverdue } = formatCountdown(nearest.deadline);

  return (
    <div className="flex items-center gap-2.5">
      {isOverdue && <Flame size={15} className="text-risk-critical" />}
      <span className="text-sm text-text-secondary">Next up: {nearest.title}</span>
      <span
        className={classNames(
          "rounded-lg px-2.5 py-1 font-mono text-sm font-semibold tabular-nums",
          isOverdue ? "bg-risk-critical/15 text-risk-critical" : "bg-surface-raised text-brand"
        )}
      >
        {label}
        {isOverdue ? " over" : ""}
      </span>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <NotificationWatcher />
      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-ink/80 px-8 backdrop-blur-md">
          <NextDeadlineTicker />
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
