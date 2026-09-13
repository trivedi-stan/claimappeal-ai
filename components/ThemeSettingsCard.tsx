"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check } from "lucide-react";

export function ThemeSettingsCard() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const options = [
    {
      id: "light",
      name: "Light Mode",
      description: "Clean, high-contrast crisp theme for daytime use",
      icon: Sun,
      iconColor: "text-amber-500",
    },
    {
      id: "dark",
      name: "Dark Mode",
      description: "Sleek, low-glare dark theme optimized for focused drafting",
      icon: Moon,
      iconColor: "text-blue-400",
    },
    {
      id: "system",
      name: "System Default",
      description: "Automatically matches your operating system appearance",
      icon: Laptop,
      iconColor: "text-primary",
    },
  ];

  if (!mounted) {
    return (
      <div className="cinematic-card p-6 space-y-4">
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted/60 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cinematic-card p-6 space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Interface Appearance
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Choose your preferred visual theme for the ClaimAppeal AI dashboard and workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {options.map((opt) => {
          const currentTheme = theme || "dark";
          const isSelected = currentTheme === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/[0.06] shadow-sm ring-1 ring-primary/30"
                  : "border-border bg-card/60 hover:border-border/80 hover:bg-accent/40 active:scale-[0.99]"
              }`}
            >
              <div className="flex w-full items-center justify-between mb-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background shadow-xs transition-colors ${
                    isSelected ? "border-primary/40" : ""
                  }`}
                >
                  <Icon className={`h-4 w-4 ${opt.iconColor}`} />
                </div>
                {isSelected && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground">
                {opt.name}
              </span>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
