import {
  createTaskRequest,
  deleteTaskRequest,
  fetchTasks,
  updateTaskRequest,
  recalculateAllRequest,
} from "../api/taskApi";

const LEVEL_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export async function loadTasks(status) {
  const { tasks, stats } = await fetchTasks(status);
  return { tasks, stats };
}

export function groupByPriority(tasks) {
  const groups = { CRITICAL: [], HIGH: [], MEDIUM: [], LOW: [] };
  tasks.forEach((t) => groups[t.priority?.level || "LOW"].push(t));
  return LEVEL_ORDER.map((level) => ({ level, tasks: groups[level] }));
}

export async function createTask(payload) {
  return createTaskRequest(payload);
}

export async function setStatus(taskId, status) {
  return updateTaskRequest(taskId, { status });
}

export async function editTask(taskId, payload) {
  return updateTaskRequest(taskId, payload);
}

export async function removeTask(taskId) {
  return deleteTaskRequest(taskId);
}

export async function recalculateAll() {
  return recalculateAllRequest();
}
