export function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function blockDurationMinutes(block) {
  return Math.round((new Date(block.end) - new Date(block.start)) / 60000);
}

export function isBlockActive(block) {
  const now = Date.now();
  return now >= new Date(block.start).getTime() && now <= new Date(block.end).getTime();
}
