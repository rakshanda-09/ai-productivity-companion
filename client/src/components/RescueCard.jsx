import { AlertTriangle, Flame, ListOrdered } from "lucide-react";
import { riskStyle } from "../utils/priority";
import { classNames, formatDeadline } from "../utils/helpers";

const RISK_LABEL = { CRITICAL: "Critical", HIGH_RISK: "High risk" };
const RISK_ICON = { CRITICAL: Flame, HIGH_RISK: AlertTriangle };

export default function RescueCard({ entry }) {
  const { task, riskLevel, message, recoveryPlan, hoursLeft } = entry;
  const style = riskStyle(riskLevel);
  const Icon = RISK_ICON[riskLevel] || AlertTriangle;

  return (
    <div className={classNames("card border-l-4", riskLevel === "CRITICAL" ? "border-l-risk-critical shadow-glow-critical" : "border-l-risk-high")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={classNames("badge", style.bg, style.text)}>
              <Icon size={13} />
              {RISK_LABEL[riskLevel]}
            </span>
            <span className="text-xs text-text-tertiary">Due {formatDeadline(task.deadline)}</span>
          </div>
          <h4 className="mt-2 font-display text-lg font-semibold">{task.title}</h4>
        </div>

        <div className="text-right font-mono">
          <p className={classNames("text-2xl font-bold", style.text)}>
            {hoursLeft <= 0 ? "0h" : `${hoursLeft}h`}
          </p>
          <p className="text-xs text-text-tertiary">{hoursLeft <= 0 ? "overdue" : "remaining"}</p>
        </div>
      </div>

      <p className="mt-3 text-sm text-text-secondary">{message}</p>

      <div className="mt-4 space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          <ListOrdered size={13} />
          Recovery plan
        </p>
        <ol className="space-y-1.5">
          {recoveryPlan.map((step, idx) => (
            <li key={idx} className="flex gap-2.5 text-sm text-text-secondary">
              <span className="font-mono text-xs text-text-tertiary">{String(idx + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
