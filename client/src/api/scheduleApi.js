import http from "./httpClient";

export const generateScheduleRequest = (date) =>
  http.post("/schedule/generate", date ? { date } : {}).then((r) => r.data.data.schedule);

export const fetchSchedule = (date) =>
  http.get("/schedule", { params: date ? { date } : {} }).then((r) => r.data.data.schedule);
