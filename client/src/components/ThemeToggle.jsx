import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { classNames } from "../utils/helpers";

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={classNames(
        "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-raised text-text-secondary transition-colors hover:text-brand",
        className
      )}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
