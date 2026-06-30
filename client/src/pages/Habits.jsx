import { useEffect, useState } from "react";
import { Plus, Target, X } from "lucide-react";
import HabitCard from "../components/HabitCard.jsx";
import Loader from "../components/Loader.jsx";
import { addHabit, archiveHabit, loadHabits, toggleCheckIn } from "../services/habitService";

const EMPTY_FORM = { title: "", description: "", frequency: "daily" };

function HabitForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold">New goal / habit</h3>
        <button type="button" onClick={onCancel} className="text-text-tertiary hover:text-text-primary">
          <X size={18} />
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input-field"
          placeholder="Read for 20 minutes"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">Description (optional)</label>
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-field"
          placeholder="Any extra detail worth remembering"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">Frequency</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "daily", label: "Every day" },
            { id: "weekdays", label: "Weekdays" },
            { id: "weekly", label: "Once a week" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setForm({ ...form, frequency: f.id })}
              className={
                form.frequency === f.id
                  ? "rounded-xl border border-brand/50 bg-brand/10 px-3 py-2 text-sm font-medium text-brand"
                  : "rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-secondary hover:text-text-primary"
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? "Saving..." : "Create"}
      </button>
    </form>
  );
}

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function refresh() {
    const data = await loadHabits();
    setHabits(data);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function handleCreate(payload) {
    await addHabit(payload);
    setShowForm(false);
    refresh();
  }

  async function handleCheckIn(habit) {
    const updated = await toggleCheckIn(habit._id);
    setHabits((prev) => prev.map((h) => (h._id === updated._id ? updated : h)));
  }

  async function handleDelete(habit) {
    if (!confirm(`Remove "${habit.title}"? This won't delete its streak history.`)) return;
    await archiveHabit(habit._id);
    refresh();
  }

  if (loading) return <Loader label="Loading goals and habits..." />;

  const dueToday = habits.filter((h) => h.dueToday);
  const doneToday = habits.filter((h) => !h.dueToday);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <Target size={20} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold">Goals & Habits</h1>
            <p className="text-text-secondary">Build consistency on top of your one-off tasks.</p>
          </div>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={16} /> New habit
          </button>
        )}
      </div>

      {showForm && <HabitForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

      {habits.length === 0 && !showForm ? (
        <div className="card py-16 text-center text-text-tertiary">
          No goals yet — add a daily, weekday, or weekly habit to start building a streak.
        </div>
      ) : (
        <>
          {dueToday.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                Due today ({dueToday.length})
              </h3>
              <div className="space-y-3">
                {dueToday.map((habit) => (
                  <HabitCard key={habit._id} habit={habit} onCheckIn={handleCheckIn} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {doneToday.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
                Checked in ({doneToday.length})
              </h3>
              <div className="space-y-3">
                {doneToday.map((habit) => (
                  <HabitCard key={habit._id} habit={habit} onCheckIn={handleCheckIn} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}