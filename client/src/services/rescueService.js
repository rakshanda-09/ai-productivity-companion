import { fetchRescuePlan, scanForRisk } from "../api/rescueApi";

export async function scanRisk() {
  return scanForRisk();
}

export async function getPlan(taskId) {
  return fetchRescuePlan(taskId);
}

export function mostUrgent(atRiskList) {
  if (!atRiskList?.length) return null;
  return atRiskList.reduce((a, b) => (a.hoursLeft < b.hoursLeft ? a : b));
}
