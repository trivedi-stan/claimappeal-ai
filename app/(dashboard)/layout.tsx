import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { ThemeToggle } from "@/components/ThemeToggle";

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

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin = adminEmails.includes(user.email?.toLowerCase() ?? "");

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 selection:text-white">
      {/* Sidebar Navigation */}
      <SidebarNav
        userEmail={user.email ?? ""}
        userName={profile?.full_name ?? ""}
        isAdmin={isAdmin}
      />

      {/* Main Content Area */}
      <main className="md:ml-60 min-h-screen flex flex-col">
        {/* Desktop Utility Header */}
        <div className="hidden md:flex h-14 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Workspace</span>
            <span>/</span>
            <span className="truncate max-w-[240px]">{profile?.full_name || user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 px-3.5 py-6 sm:px-8 sm:py-10 max-w-6xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
