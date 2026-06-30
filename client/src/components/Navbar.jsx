import { Link, NavLink } from "react-router-dom";
import { TimerReset } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ink/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 text-brand">
            <TimerReset size={18} />
          </span>
          AI Productivity<span className="text-brand"> Companion</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/dashboard" className="btn-secondary px-3.5 py-2 text-sm">
                Open app
              </Link>
              <button onClick={logout} className="text-sm text-text-secondary hover:text-text-primary">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary">
                Log in
              </Link>
              <Link to="/register" className="btn-primary px-3.5 py-2 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
