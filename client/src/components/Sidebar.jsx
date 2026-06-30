import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  CalendarClock,
  LifeBuoy,
  Sparkles,
  Calendar,
  Target,
  UserCircle,
  Settings as SettingsIcon,
  TimerReset,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { initials } from "../utils/helpers";
import ThemeToggle from "./ThemeToggle.jsx";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/tasks", label: "Tasks", icon: ListChecks },
  { to: "/dashboard/habits", label: "Goals & Habits", icon: Target },
  { to: "/dashboard/scheduler", label: "Scheduler", icon: CalendarClock },
  { to: "/dashboard/rescue", label: "Rescue Mode", icon: LifeBuoy },
  { to: "/dashboard/coach", label: "AI Coach", icon: Sparkles },
  { to: "/dashboard/calendar", label: "Calendar", icon: Calendar },
];

const FOOTER_ITEMS = [
  { to: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  const itemClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive ? "bg-brand/15 text-brand" : "text-text-secondary hover:bg-surface-raised hover:text-text-primary"
    }`;

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-border bg-surface px-4 py-6">
      <div className="mb-8 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 text-brand">
            <TimerReset size={18} />
          </span>
          AI Productivity<span className="text-brand"> Companion</span>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={itemClass}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border pt-4">
        {FOOTER_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={itemClass}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        <div className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-raised font-mono text-xs text-text-secondary">
            {initials(user?.name) || "U"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">{user?.name}</p>
            <p className="truncate text-xs text-text-tertiary">{user?.email}</p>
          </div>
          <button onClick={logout} title="Sign out" className="text-text-tertiary hover:text-risk-critical">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}