/**
 * Dashboard layout-level loading skeleton.
 * Next.js renders this instantly (0ms) while the server page component
 * fetches data — completely eliminates the blank-screen flash on cold starts.
 */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-pulse pb-16 pt-2">
      {/* Header skeleton */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-5">
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-zinc-800" />
          <div className="h-7 w-64 rounded bg-zinc-800" />
          <div className="h-3 w-40 rounded bg-zinc-800/60 mt-1" />
        </div>
        <div className="h-8 w-32 rounded-lg bg-zinc-800" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="cinematic-card p-4 space-y-2">
            <div className="h-3 w-20 rounded bg-zinc-800" />
            <div className="h-6 w-14 rounded bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Table / list skeleton */}
      <div className="cinematic-card divide-y divide-white/[0.05]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4">
            <div className="space-y-2 flex-1">
              <div className="h-3.5 w-56 rounded bg-zinc-800" />
              <div className="h-3 w-32 rounded bg-zinc-800/60" />
            </div>
            <div className="h-6 w-20 rounded-full bg-zinc-800 ml-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
