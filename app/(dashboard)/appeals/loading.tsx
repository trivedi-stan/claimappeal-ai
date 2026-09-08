/**
 * Appeals list / detail level loading skeleton.
 * Covers /dashboard and /appeals/[id] page transitions.
 */
export default function AppealsLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-pulse pb-16 pt-2">
      {/* Breadcrumb + title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.06] pb-5">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-zinc-800" />
          <div className="h-7 w-72 rounded bg-zinc-800" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-lg bg-zinc-800" />
          <div className="h-8 w-32 rounded-lg bg-zinc-800" />
        </div>
      </div>

      {/* Metric strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="cinematic-card p-4 space-y-2">
            <div className="h-3 w-20 rounded bg-zinc-800" />
            <div className="h-6 w-14 rounded bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Detail cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="cinematic-card p-6 space-y-4">
            <div className="h-4 w-28 rounded bg-zinc-800 border-b border-white/[0.06] pb-3" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="space-y-1">
                <div className="h-2.5 w-16 rounded bg-zinc-800/60" />
                <div className="h-3.5 w-36 rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
