/**
 * Notification Service
 * ---------------------
 * Thin wrapper around the browser Notification API. Deliberately simple:
 * no service worker / push subscription, since these are foreground,
 * in-session alerts tied to data the AI engines already computed
 * (priority level, rescue risk, schedule timing) — not a server push system.
 */

const STORAGE_KEY = "lmls_notifications_enabled";

export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationsEnabled() {
  return notificationsSupported() && localStorage.getItem(STORAGE_KEY) === "true" && Notification.permission === "granted";
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return "unsupported";
  const result = await Notification.requestPermission();
  localStorage.setItem(STORAGE_KEY, result === "granted" ? "true" : "false");
  return result;
}

export function disableNotifications() {
  localStorage.setItem(STORAGE_KEY, "false");
}

/**
 * Fires a native browser notification if permission is granted and the
 * person has opted in. Falls back silently (never throws) so a denied/
 * unsupported browser never breaks the app.
 */
export function notify(title, options = {}) {
  if (!notificationsEnabled()) return;
  try {
    const n = new Notification(title, {
      icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23080B16'/%3E%3Cpath d='M16 6v11l7 4' stroke='%238B5CF6' stroke-width='2.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='16' cy='17' r='10' stroke='%238B5CF6' stroke-width='2.2' fill='none'/%3E%3C/svg%3E",
      ...options,
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    // Notification constructor can throw in some embedded/mobile webviews — ignore.
  }
}
