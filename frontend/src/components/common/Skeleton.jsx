// Skeleton loaders — shown instead of a spinner while list/detail data loads,
// so the layout doesn't jump once real content arrives.

function Shimmer({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded bg-[var(--bg-sunken)] ${className}`}
    />
  )
}

// Mimics DataTable: a header row + N skeleton rows with `cols` columns.
export function SkeletonTable({ rows = 5, cols = 3 }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)]">
      <div className="flex gap-4 border-b border-[var(--border)] bg-[var(--bg-sunken)] px-4 py-2.5">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} className="h-3 w-20" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-4 border-b border-[var(--border)] px-4 py-3 last:border-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Shimmer key={c} className={`h-3.5 ${c === 0 ? 'w-32' : 'w-16'}`} />
          ))}
        </div>
      ))}
    </div>
  )
}

// Mimics a Panel of key/value details (Overview tab, Profile page).
export function SkeletonDetails({ rows = 4 }) {
  return (
    <div className="space-y-4 rounded-lg border border-[var(--border)] bg-[var(--bg-raised)] p-5">
      <Shimmer className="h-4 w-28" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}

// A grid of dashboard-style panel cards.
export function SkeletonCards({ count = 3 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-raised)] p-5">
          <Shimmer className="mb-3 h-8 w-8 rounded-md" />
          <Shimmer className="mb-2 h-3.5 w-24" />
          <Shimmer className="h-3 w-full" />
          <Shimmer className="mt-1.5 h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export default Shimmer
