import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "../services/authService";
import { initials } from "../utils/helpers";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const updated = await updateProfile({ name });
      setUser(updated);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Profile</h1>
        <p className="text-text-secondary">Your account details.</p>
      </div>

      <div className="card flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-raised font-mono text-lg text-text-secondary">
          {initials(user?.name)}
        </span>
        <div>
          <p className="font-medium">{user?.name}</p>
          <p className="text-sm text-text-tertiary">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="card space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Display name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
          <input value={user?.email} disabled className="input-field opacity-60" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save changes"}
        </button>
        {saved && <p className="text-sm text-risk-safe">Saved.</p>}
      </form>
    </div>
  );
}
