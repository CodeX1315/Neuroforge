import { humanizeEnum } from '../../constants/enums'
import { statusColor } from './Badge'

// `counts` = [{ value: 'ACTIVE', count: 4 }, ...] — pass only non-zero entries.
export default function StatBreakdown({ title, counts, emptyLabel = 'No data yet' }) {
  const total = counts.reduce((sum, c) => sum + c.count, 0)
  const max = Math.max(1, ...counts.map((c) => c.count))

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-raised)] p-5">
      <p className="mb-3 font-display text-sm font-semibold text-[var(--text)]">{title}</p>
      {total === 0 ? (
        <p className="text-xs text-[var(--text-muted)]">{emptyLabel}</p>
      ) : (
        <div className="space-y-2.5">
          {counts.map(({ value, count }) => (
            <div key={value} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-xs text-[var(--text-muted)]">
                {humanizeEnum(value)}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--bg-sunken)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(count / max) * 100}%`,
                    backgroundColor: statusColor(value),
                  }}
                />
              </div>
              <span className="w-6 shrink-0 text-right font-mono text-xs text-[var(--text)]">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
