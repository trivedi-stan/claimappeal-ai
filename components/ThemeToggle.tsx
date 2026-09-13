"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

function SunBadgeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 12-scallop radiant sun badge matching the user reference */}
      <path
        d="M12 2.5a2 2 0 0 1 1.732 1l.5.866a2 2 0 0 0 1.414 1l.98.172a2 2 0 0 1 1.62 1.62l.172.98a2 2 0 0 0 1 1.414l.866.5a2 2 0 0 1 0 3.464l-.866.5a2 2 0 0 0-1 1.414l-.172.98a2 2 0 0 1-1.62 1.62l-.98.172a2 2 0 0 0-1.414 1l-.5.866a2 2 0 0 1-3.464 0l-.5-.866a2 2 0 0 0-1.414-1l-.98-.172a2 2 0 0 1-1.62-1.62l-.172-.98a2 2 0 0 0-1-1.414l-.866-.5a2 2 0 0 1 0-3.464l.866-.5a2 2 0 0 0 1-1.414l.172-.98a2 2 0 0 1 1.62-1.62l.98-.172a2 2 0 0 0 1.414-1l.5-.866A2 2 0 0 1 12 2.5z"
        fill="#f59e0b"
      />
      <circle cx="12" cy="12" r="5" fill="#fbbf24" />
    </svg>
  );
}

function MoonBadgeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="#60a5fa"
        stroke="#3b82f6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeToggle({ className = "", showLabel = true }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [currentMode, setCurrentMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (typeof document !== "undefined") {
      const isDomDark =
        document.documentElement.classList.contains("dark") ||
        (!document.documentElement.classList.contains("light") && resolvedTheme !== "light");
      setCurrentMode(isDomDark ? "dark" : "light");
    }
  }, [resolvedTheme, theme]);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Determine target mode based on current state & DOM
    const isCurrentlyDark =
      currentMode === "dark" ||
      (typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
    const nextMode: "dark" | "light" = isCurrentlyDark ? "light" : "dark";

    // 1. Update React state immediately so UI updates with zero lag
    setCurrentMode(nextMode);

    // 2. Update document element classes and localStorage immediately
    if (typeof document !== "undefined") {
      if (nextMode === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
      try {
        localStorage.setItem("theme", nextMode);
      } catch {}
    }

    // 3. Synchronize with next-themes
    try {
      setTheme(nextMode);
    } catch {}
  };

  const isDark = currentMode === "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`group relative inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs transition-all duration-150 hover:bg-accent/80 hover:border-border/80 active:scale-95 cursor-pointer select-none z-10 ${className}`}
      title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      aria-label={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
    >
      {isDark ? (
        /* When in Dark mode: show Light option so user can click to go into Light mode */
        <>
          <SunBadgeIcon className="h-4 w-4 shrink-0 pointer-events-none transition-transform duration-200 group-hover:scale-110" />
          {showLabel && <span className="font-semibold text-foreground pointer-events-none">Light</span>}
        </>
      ) : (
        /* When in Light mode: show Dark option so user can click to go into Dark mode */
        <>
          <MoonBadgeIcon className="h-4 w-4 shrink-0 pointer-events-none transition-transform duration-200 group-hover:scale-110" />
          {showLabel && <span className="font-semibold text-foreground pointer-events-none">Dark</span>}
        </>
      )}
    </button>
  );
}
