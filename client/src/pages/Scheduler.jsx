import { useEffect, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import ScheduleCard from "../components/ScheduleCard.jsx";
import Loader from "../components/Loader.jsx";
import { getScheduleForToday, regenerateSchedule } from "../services/schedulerService";

export default function Scheduler() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    getScheduleForToday()
      .then(setSchedule)
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const fresh = await regenerateSchedule();
      setSchedule(fresh);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return <Loader label="Checking today's plan..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Smart Scheduler</h1>
          <p className="text-text-secondary">Your pending tasks, arranged into today's available time.</p>
        </div>
        <button onClick={handleGenerate} disabled={generating} className="btn-primary">
          <RefreshCw size={16} className={generating ? "animate-spin" : ""} />
          {generating ? "Building..." : schedule ? "Regenerate" : "Generate today's plan"}
        </button>
      </div>

      {!schedule ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <Sparkles className="text-brand" size={28} />
          <p className="text-text-secondary">No schedule yet for today.</p>
          <p className="text-sm text-text-tertiary">Generate one and the AI will slot your pending tasks in by priority.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.blocks.length === 0 && (
            <p className="text-sm text-text-tertiary">No tasks fit into today's working hours.</p>
          )}
          {schedule.blocks.map((block, idx) => (
            <ScheduleCard key={idx} block={block} />
          ))}

          {schedule.unscheduledTasks?.length > 0 && (
            <div className="card border-l-4 border-l-risk-high">
              <p className="text-sm font-medium text-risk-high">
                {schedule.unscheduledTasks.length} task(s) didn't fit in today's window.
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Check Rescue Mode — these may need a recovery plan instead of waiting for tomorrow.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
