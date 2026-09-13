"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  FilePlus,
  Settings,
  LogOut,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SidebarNavProps {
  userEmail: string;
  userName: string;
  isAdmin: boolean;
}

export function SidebarNav({ userEmail, userName, isAdmin }: SidebarNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/appeals/new", label: "New Appeal", icon: FilePlus },
    { href: "/settings/billing", label: "Billing & Plans", icon: CreditCard },
    { href: "/settings/profile", label: "Settings", icon: Settings },
    ...(isAdmin ? [{ href: "/admin", label: "Admin Console", icon: Shield }] : []),
  ];

  const initials = (userName || userEmail || "U").charAt(0).toUpperCase();

  const navContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Workspace Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary shadow-xs">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold tracking-tight text-foreground">ClaimAppeal</span>
              <span className="rounded bg-primary/20 px-1 py-0.5 text-[10px] font-bold text-primary tracking-wider">
                AI
              </span>
            </div>
          </Link>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground md:hidden"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-3 pt-4">
          <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold shadow-xs border border-primary/20"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground active:bg-accent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Section & Theme Toggle at Bottom */}
      <div className="border-t border-border p-3 space-y-2">
        {/* Theme Switcher Bar */}
        <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-muted/40 border border-border/60">
          <span className="text-xs font-medium text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-accent/50 transition-colors">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border text-xs font-semibold text-foreground">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-foreground">{userName || "User"}</p>
            <p className="truncate text-[10px] text-muted-foreground">{userEmail}</p>
          </div>
        </div>

        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:bg-destructive/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Shield className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-foreground">ClaimAppeal AI</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg border border-border bg-card p-2 text-foreground hover:bg-accent active:bg-accent/80"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full w-72 max-w-[85vw] bg-card border-r border-border shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-border bg-card md:block">
        {navContent}
      </aside>
    </>
  );
}
