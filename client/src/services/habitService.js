import {
  checkInHabitRequest,
  createHabitRequest,
  deleteHabitRequest,
  fetchHabits,
  updateHabitRequest,
} from "../api/habitApi";

export async function loadHabits() {
  return fetchHabits();
}

export async function addHabit(payload) {
  return createHabitRequest(payload);
}

export async function toggleCheckIn(id) {
  return checkInHabitRequest(id);
}

export async function archiveHabit(id) {
  return updateHabitRequest(id, { archived: true });
}

export async function removeHabit(id) {
  return deleteHabitRequest(id);
}

export const FREQUENCY_LABEL = {
  daily: "Every day",
  weekdays: "Weekdays",
  weekly: "Once a week",
};