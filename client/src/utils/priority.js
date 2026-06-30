// Display helpers that map a priority/risk level to Tailwind classes,
// keeping the semantic color language consistent across the whole app.
export const PRIORITY_STYLES = {
  CRITICAL: { dot: "bg-risk-critical", text: "text-risk-critical", bg: "bg-risk-critical/10", ring: "ring-risk-critical/30" },
  HIGH: { dot: "bg-risk-high", text: "text-risk-high", bg: "bg-risk-high/10", ring: "ring-risk-high/30" },
  MEDIUM: { dot: "bg-risk-medium", text: "text-risk-medium", bg: "bg-risk-medium/10", ring: "ring-risk-medium/30" },
  LOW: { dot: "bg-risk-safe", text: "text-risk-safe", bg: "bg-risk-safe/10", ring: "ring-risk-safe/30" },
};

export const RISK_STYLES = {
  CRITICAL: PRIORITY_STYLES.CRITICAL,
  HIGH_RISK: PRIORITY_STYLES.HIGH,
  SAFE: PRIORITY_STYLES.LOW,
};

export function priorityStyle(level) {
  return PRIORITY_STYLES[level] || PRIORITY_STYLES.LOW;
}

export function riskStyle(level) {
  return RISK_STYLES[level] || RISK_STYLES.SAFE;
}
