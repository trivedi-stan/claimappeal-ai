/**
 * Review page loading skeleton — shown while structured_output loads from Supabase.
 */
export default function ReviewLoading() {
  return (
    <div className="space-y-6 animate-pulse pb-16">
      {/* Top nav */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/[0.06] pb-5">
        <div className="space-y-2">
          <div className="h-3 w-48 rounded bg-zinc-800" />
          <div className="h-7 w-56 rounded bg-zinc-800" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-lg bg-zinc-800" />
          ))}
        </div>
      </div>

      {/* Advisory banner */}
      <div className="h-12 w-full rounded-lg bg-amber-500/[0.06] border border-amber-500/10" />

      {/* Dual pane */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Letter editor */}
        <div className="lg:col-span-8 cinematic-card p-6 space-y-4">
          <div className="space-y-2 border-b border-white/[0.06] pb-5">
            <div className="h-3 w-40 rounded bg-zinc-800" />
            <div className="h-10 w-full rounded bg-zinc-800/60" />
          </div>
          <div className="h-96 w-full rounded-lg bg-zinc-900/60" />
        </div>

        {/* Strategy sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="cinematic-card p-5 space-y-3">
              <div className="h-4 w-32 rounded bg-zinc-800" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-3 w-full rounded bg-zinc-800/60" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
