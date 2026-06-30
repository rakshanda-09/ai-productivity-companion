import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import TaskCard from "../components/TaskCard.jsx";
import Loader from "../components/Loader.jsx";
import { priorityStyle } from "../utils/priority";
import {
  createTask,
  editTask,
  groupByPriority,
  loadTasks,
  removeTask,
  setStatus,
} from "../services/taskService";

const EMPTY_FORM = { title: "", description: "", deadline: "", estimatedMinutes: 30, importance: 3 };

function toLocalInputValue(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function TaskForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial
      ? { ...initial, deadline: toLocalInputValue(initial.deadline) }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ ...form, estimatedMinutes: Number(form.estimatedMinutes), importance: Number(form.importance) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold">{initial ? "Edit task" : "New task"}</h3>
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
          placeholder="Submit project report"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">Description (optional)</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-field min-h-[70px]"
          placeholder="Any extra detail worth remembering"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Deadline</label>
          <input
            type="datetime-local"
            required
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Estimated minutes</label>
          <input
            type="number"
            min={5}
            required
            value={form.estimatedMinutes}
            onChange={(e) => setForm({ ...form, estimatedMinutes: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Importance (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            required
            value={form.importance}
            onChange={(e) => setForm({ ...form, importance: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? "Saving..." : initial ? "Save changes" : "Add task"}
      </button>
    </form>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  async function refresh() {
    const { tasks } = await loadTasks();
    setTasks(tasks);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function handleCreate(payload) {
    await createTask(payload);
    setShowForm(false);
    refresh();
  }

  async function handleUpdate(payload) {
    await editTask(editing._id, payload);
    setEditing(null);
    refresh();
  }

  async function handleToggle(task) {
    await setStatus(task._id, task.status === "completed" ? "pending" : "completed");
    refresh();
  }

  async function handleDelete(task) {
    if (!confirm(`Delete "${task.title}"?`)) return;
    await removeTask(task._id);
    refresh();
  }

  if (loading) return <Loader label="Loading tasks..." />;

  const groups = groupByPriority(tasks.filter((t) => t.status !== "completed"));
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Tasks</h1>
          <p className="text-text-secondary">Ranked automatically by the Priority Engine.</p>
        </div>
        {!showForm && !editing && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={16} /> Add task
          </button>
        )}
      </div>

      {showForm && <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
      {editing && <TaskForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />}

      {groups.map(
        ({ level, tasks }) =>
          tasks.length > 0 && (
            <div key={level}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${priorityStyle(level).dot}`} />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">{level}</h3>
                <span className="text-xs text-text-tertiary">({tasks.length})</span>
              </div>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggleComplete={handleToggle}
                    onEdit={setEditing}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )
      )}

      {completed.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-tertiary">
            Completed ({completed.length})
          </h3>
          <div className="space-y-3">
            {completed.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={handleToggle}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="card py-16 text-center text-text-tertiary">
          No tasks yet — add your first one to see the Priority Engine in action.
        </div>
      )}
    </div>
  );
}
