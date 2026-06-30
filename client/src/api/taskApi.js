import http from "./httpClient";

export const fetchTasks = (status) =>
  http.get("/tasks", { params: status ? { status } : {} }).then((r) => r.data.data);

export const fetchTask = (id) => http.get(`/tasks/${id}`).then((r) => r.data.data.task);

export const createTaskRequest = (payload) => http.post("/tasks", payload).then((r) => r.data.data.task);

export const updateTaskRequest = (id, payload) => http.put(`/tasks/${id}`, payload).then((r) => r.data.data.task);

export const deleteTaskRequest = (id) => http.delete(`/tasks/${id}`).then((r) => r.data.data);

export const recalculateAllRequest = () => http.post("/tasks/recalculate").then((r) => r.data.data.tasks);
