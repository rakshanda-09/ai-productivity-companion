import { fetchSchedule, generateScheduleRequest } from "../api/scheduleApi";

export async function getScheduleForToday() {
  return fetchSchedule();
}

export async function regenerateSchedule(date) {
  return generateScheduleRequest(date);
}

/** Minutes of working time left today, based purely on the wall clock. */
export function minutesLeftInDay(endHHMM = "21:00") {
  const [h, m] = endHHMM.split(":").map(Number);
  const end = new Date();
  end.setHours(h, m, 0, 0);
  return Math.max(0, Math.round((end.getTime() - Date.now()) / 60000));
}
