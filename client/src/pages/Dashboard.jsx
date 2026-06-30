import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Flame, ListChecks, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";
import { fetchTasks } from "../api/taskApi";
import TaskCard from "../components/TaskCard.jsx";
import Loader from "../components/Loader.jsx";
import { setStatus } from "../services/taskService";

const LEVEL_COLORS = { CRITICAL: "#FF4D5E", HIGH: "#FFA53D", MEDIUM: "#FFD75E", LOW: "#34D399" };

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="card flex items-center gap-4">
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-surface-raised ${accent}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-2xl font-bold font-mono">{value}</p>
        <p className="text-sm text-text-tertiary">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await fetchTasks();
    setTasks(data.tasks);
    setStats(data.stats);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Pulling your latest tasks..." />;

  const critical = tasks.filter((t) => t.status !== "completed").sort((a, b) => b.priority.score - a.priority.score).slice(0, 4);

  const chartData = Object.entries(stats.byPriorityLevel).map(([level, count]) => ({ level, count }));

  async function handleToggle(task) {
    await setStatus(task._id, task.status === "completed" ? "pending" : "completed");
    load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="text-text-secondary">Here's where things stand right now.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={ListChecks} label="Pending tasks" value={stats.pending} accent="text-brand" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} accent="text-risk-safe" />
        <StatCard icon={Flame} label="Overdue" value={stats.overdue} accent="text-risk-critical" />
        <StatCard icon={ShieldAlert} label="At risk" value={stats.atRisk} accent="text-risk-high" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <h3 className="mb-4 font-display font-semibold">Tasks by priority</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3349" vertical={false} />
              <XAxis dataKey="level" stroke="#5C6680" fontSize={11} />
              <YAxis stroke="#5C6680" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#1A2030", border: "1px solid #2A3349", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.level} fill={LEVEL_COLORS[entry.level]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold">Top priority right now</h3>
            <Link to="/dashboard/tasks" className="flex items-center gap-1 text-sm text-brand">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {critical.length === 0 ? (
            <p className="text-sm text-text-tertiary">Nothing pending — you're all caught up.</p>
          ) : (
            <div className="space-y-3">
              {critical.map((task) => (
                <TaskCard key={task._id} task={task} onToggleComplete={handleToggle} onEdit={() => {}} onDelete={() => {}} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/dashboard/scheduler" className="card hover:border-brand/50">
          <h4 className="font-display font-semibold">Build today's schedule</h4>
          <p className="mt-1 text-sm text-text-secondary">Let the Smart Scheduler turn your list into time blocks.</p>
        </Link>
        <Link to="/dashboard/rescue" className="card hover:border-brand/50">
          <h4 className="font-display font-semibold">Check Rescue Mode</h4>
          <p className="mt-1 text-sm text-text-secondary">{stats.atRisk} task(s) currently need a recovery plan.</p>
        </Link>
        <Link to="/dashboard/habits" className="card hover:border-brand/50">
          <h4 className="font-display font-semibold">Goals & Habits</h4>
          <p className="mt-1 text-sm text-text-secondary">Build a streak on top of your one-off tasks.</p>
        </Link>
        <Link to="/dashboard/coach" className="card hover:border-brand/50">
          <h4 className="font-display font-semibold">Ask the AI Coach</h4>
          <p className="mt-1 text-sm text-text-secondary">Get advice tailored to your actual task list.</p>
        </Link>
      </div>
    </div>
  );
}
