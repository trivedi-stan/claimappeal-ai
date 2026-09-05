import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Shield,
  LayoutDashboard,
  FilePlus,
  Settings,
  LogOut,
  User,
  CreditCard,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/appeals/new", label: "New Appeal", icon: FilePlus },
    { href: "/settings/profile", label: "Settings", icon: Settings },
    { href: "/settings/billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">
            ClaimAppeal<span className="text-primary"> AI</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white">
              {(profile?.full_name ?? user.email ?? "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">
                {profile?.full_name ?? "User"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {profile?.email ?? user.email}
              </p>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST" className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <div className="container mx-auto max-w-5xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
