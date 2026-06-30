import http from "./httpClient";

export const fetchHabits = () => http.get("/habits").then((r) => r.data.data.habits);

export const createHabitRequest = (payload) => http.post("/habits", payload).then((r) => r.data.data.habit);

export const checkInHabitRequest = (id) => http.post(`/habits/${id}/checkin`).then((r) => r.data.data.habit);

export const updateHabitRequest = (id, payload) => http.put(`/habits/${id}`, payload).then((r) => r.data.data.habit);

export const deleteHabitRequest = (id) => http.delete(`/habits/${id}`).then((r) => r.data.data);