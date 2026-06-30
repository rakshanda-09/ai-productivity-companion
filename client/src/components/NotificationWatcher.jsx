import { useEffect, useRef } from "react";
import { fetchTasks } from "../api/taskApi";
import { scanForRisk } from "../api/rescueApi";
import { fetchSchedule } from "../api/scheduleApi";
import { notificationsEnabled, notify } from "../services/notificationService";

const POLL_MS = 60 * 1000;
const UPCOMING_BLOCK_WINDOW_MS = 5 * 60 * 1000;

/**
 * Mounted once inside the authenticated dashboard. Polls the same data the
 * Priority / Rescue / Scheduler engines already produce and turns specific,
 * meaningful state *changes* into native browser notifications — not a
 * generic "task due soon" timer, but things like a task crossing into
 * CRITICAL, Rescue Mode newly flagging something, or a scheduled block
 * about to start.
 *
 * Renders nothing; it's a side-effect-only watcher.
 */
export default function NotificationWatcher() {
  const seenCritical = useRef(new Set());
  const seenAtRisk = useRef(new Set());
  const notifiedBlocks = useRef(new Set());

  useEffect(() => {
    if (!notificationsEnabled()) return;

    let cancelled = false;

    async function checkPriorities() {
      const { tasks } = await fetchTasks("pending");
      tasks.forEach((task) => {
        const isCritical = task.priority?.level === "CRITICAL";
        const alreadySeen = seenCritical.current.has(task._id);

        if (isCritical && !alreadySeen) {
          notify("A task just became CRITICAL", {
            body: `"${task.title}" needs attention now — priority just escalated.`,
            tag: `critical-${task._id}`,
          });
          seenCritical.current.add(task._id);
        }
        if (!isCritical) {
          seenCritical.current.delete(task._id);
        }
      });
    }

    async function checkRescue() {
      const atRisk = await scanForRisk();
      atRisk.forEach(({ task, riskLevel, hoursLeft }) => {
        const key = `${task._id}-${riskLevel}`;
        if (!seenAtRisk.current.has(key)) {
          notify(riskLevel === "CRITICAL" ? "Rescue Mode: deadline in danger" : "Rescue Mode: this is getting tight", {
            body: `"${task.title}" — about ${Math.max(0, Math.round(hoursLeft))}h left. A recovery plan is ready.`,
            tag: `rescue-${task._id}`,
          });
          seenAtRisk.current.add(key);
        }
      });
    }

    async function checkUpcomingBlock() {
      const schedule = await fetchSchedule();
      if (!schedule?.blocks?.length) return;

      const now = Date.now();
      schedule.blocks.forEach((block) => {
        const start = new Date(block.start).getTime();
        const msUntilStart = start - now;
        const key = `${schedule._id || schedule.date}-${block.title}-${block.start}`;

        if (msUntilStart > 0 && msUntilStart <= UPCOMING_BLOCK_WINDOW_MS && !notifiedBlocks.current.has(key)) {
          notify("Time block starting soon", {
            body: `"${block.title}" starts in about ${Math.max(1, Math.round(msUntilStart / 60000))} min.`,
            tag: key,
          });
          notifiedBlocks.current.add(key);
        }
      });
    }

    async function runChecks() {
      if (cancelled) return;
      try {
        await Promise.all([checkPriorities(), checkRescue(), checkUpcomingBlock()]);
      } catch {
        // Silent — notifications are a non-critical enhancement, never surface polling errors to the user.
      }
    }

    runChecks();
    const id = setInterval(runChecks, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return null;
}
