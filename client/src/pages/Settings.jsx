import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "../services/authService";
import {
  disableNotifications,
  notificationsEnabled,
  notificationsSupported,
  requestNotificationPermission,
} from "../services/notificationService";

export default function Settings() {
  const { user, setUser } = useAuth();
  const [workingHours, setWorkingHours] = useState(user?.workingHours || { start: "09:00", end: "21:00" });
  const [preferences, setPreferences] = useState(
    user?.preferences || { focusBlockMinutes: 50, breakMinutes: 10, theme: "dark" }
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifOn, setNotifOn] = useState(notificationsEnabled());
  const [notifStatus, setNotifStatus] = useState("");

  useEffect(() => {
    setNotifOn(notificationsEnabled());
  }, []);

  async function handleNotificationToggle() {
    if (notifOn) {
      disableNotifications();
      setNotifOn(false);
      setNotifStatus("Notifications turned off.");
      return;
    }

    const result = await requestNotificationPermission();
    if (result === "granted") {
      setNotifOn(true);
      setNotifStatus("Notifications enabled — you'll be alerted as tasks become critical or fall at risk.");
    } else if (result === "denied") {
      setNotifOn(false);
      setNotifStatus("Permission denied. Enable notifications for this site in your browser settings to turn this on.");
    } else {
      setNotifOn(false);
      setNotifStatus("Notifications aren't supported in this browser.");
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const updated = await updateProfile({ workingHours, preferences });
      setUser(updated);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
        <p className="text-text-secondary">These feed directly into the Smart Scheduler.</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${notifOn ? "bg-brand/15 text-brand" : "bg-surface-raised text-text-tertiary"}`}>
              {notifOn ? <Bell size={18} /> : <BellOff size={18} />}
            </span>
            <div>
              <h3 className="font-medium">Context-aware notifications</h3>
              <p className="mt-0.5 text-sm text-text-secondary">
                Get alerted the moment a task turns CRITICAL, Rescue Mode flags something new, or a
                scheduled block is about to start — while the app is open in this browser.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleNotificationToggle}
            disabled={!notificationsSupported()}
            className={notifOn ? "btn-secondary px-4 py-2 text-sm" : "btn-primary px-4 py-2 text-sm"}
          >
            {notifOn ? "Turn off" : "Turn on"}
          </button>
        </div>
        {notifStatus && <p className="mt-3 text-xs text-text-tertiary">{notifStatus}</p>}
      </div>

      <form onSubmit={handleSave} className="card space-y-6">
        <div>
          <h3 className="mb-3 font-medium">Working hours</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-text-secondary">Start</label>
              <input
                type="time"
                value={workingHours.start}
                onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-secondary">End</label>
              <input
                type="time"
                value={workingHours.end}
                onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-medium">Focus blocks</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-text-secondary">Default block (min)</label>
              <input
                type="number"
                min={15}
                value={preferences.focusBlockMinutes}
                onChange={(e) => setPreferences({ ...preferences, focusBlockMinutes: Number(e.target.value) })}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-secondary">Break between blocks (min)</label>
              <input
                type="number"
                min={0}
                value={preferences.breakMinutes}
                onChange={(e) => setPreferences({ ...preferences, breakMinutes: Number(e.target.value) })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save settings"}
        </button>
        {saved && <p className="text-sm text-risk-safe">Saved — your next generated schedule will use these.</p>}
      </form>
    </div>
  );
}
