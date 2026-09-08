import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/dashboard/SidebarNav";

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
        <div className="flex-1 px-4 py-8 sm:px-8 sm:py-10 max-w-6xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
