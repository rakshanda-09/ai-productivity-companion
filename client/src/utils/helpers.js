export function formatCountdown(targetDate) {
  const diffMs = new Date(targetDate).getTime() - Date.now();
  const isOverdue = diffMs <= 0;
  const abs = Math.abs(diffMs);

  const totalMinutes = Math.floor(abs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const pad = (n) => String(n).padStart(2, "0");
  let label;
  if (days > 0) label = `${days}d ${pad(hours)}h`;
  else label = `${pad(hours)}:${pad(minutes)}`;

  return { label, isOverdue };
}

export function formatDeadline(date) {
  return new Date(date).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function classNames(...args) {
  return args.filter(Boolean).join(" ");
}

export function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}
