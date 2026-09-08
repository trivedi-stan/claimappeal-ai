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
  Sparkles,
  ChevronRight,
} from "lucide-react";

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
        <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary shadow-sm">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold tracking-tight text-white">ClaimAppeal</span>
              <span className="rounded bg-primary/20 px-1 py-0.5 text-[10px] font-bold text-primary tracking-wider">
                AI
              </span>
            </div>
          </Link>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded p-1 text-zinc-400 hover:text-white md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-3 pt-4">
          <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Workspace
          </p>
          <nav className="space-y-0.5">
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
                  className={`group relative flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white/[0.08] text-white shadow-sm border border-white/[0.06]"
                      : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300"
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

      {/* User Section at Bottom */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-white/[0.03] transition-colors">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 border border-white/[0.08] text-xs font-semibold text-zinc-200">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-zinc-200">{userName || "User"}</p>
            <p className="truncate text-[10px] text-zinc-500">{userEmail}</p>
          </div>
        </div>

        <form action="/api/auth/signout" method="POST" className="mt-2">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
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
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-white/[0.06] bg-[#09090b]/90 px-4 backdrop-blur-md md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary border border-primary/20">
            <Shield className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold text-white">ClaimAppeal AI</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg border border-white/[0.08] bg-zinc-900 p-1.5 text-zinc-300 hover:text-white"
        >
          <Menu className="h-4 w-4" />
        </button>
      </header>

      {/* Mobile Backdrop Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full w-64 bg-[#0c0c0e] border-r border-white/[0.06]"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-white/[0.06] bg-[#0c0c0e] md:block">
        {navContent}
      </aside>
    </>
  );
}
