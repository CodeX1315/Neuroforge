import { humanizeEnum } from '../../constants/enums'

// Maps a raw enum value to a semantic color bucket. Falls back to "neutral".
const COLOR_MAP = {
  // positive / done
  DONE: 'success',
  COMPLETED: 'success',
  RELEASED: 'success',
  SUCCESS: 'success',
  APPROVED: 'success',
  VERIFIED: 'success',
  IMPLEMENTED: 'success',
  RESOLVED: 'success',
  CLOSED: 'success',
  READY: 'success',
  ACTIVE: 'success',

  // in progress / attention
  IN_PROGRESS: 'progress',
  IN_REVIEW: 'progress',
  TESTING: 'progress',
  RETEST: 'progress',
  PLANNED: 'progress',
  IN_DEVELOPMENT: 'progress',
  READY_FOR_RELEASE: 'progress',
  PENDING: 'progress',
  ASSIGNED: 'progress',
  REOPENED: 'progress',

  // caution / high priority
  HIGH: 'warning',
  CRITICAL: 'danger',
  BLOCKED: 'danger',
  FAILED: 'danger',
  REJECTED: 'danger',
  CANCELLED: 'neutral',
  DEFERRED: 'neutral',
  ROLLED_BACK: 'danger',
  ON_HOLD: 'warning',

  // neutral / early stage
  DRAFT: 'neutral',
  TODO: 'neutral',
  NEW: 'neutral',
  PLANNING: 'neutral',
  LOW: 'neutral',
  MEDIUM: 'progress',
  DEPRECATED: 'neutral',
  TRIVIAL: 'neutral',
}

const DOT_COLORS = {
  success: '#3f8f5f',
  progress: '#3b6e8c',
  warning: '#c98a1e',
  danger: '#c4432e',
  neutral: 'var(--text-muted)',
}

// Exposed so other components (e.g. StatBreakdown) can color things using
// the same status→color logic as the badge itself, for visual consistency.
export function statusColor(value) {
  const bucket = COLOR_MAP[value] || 'neutral'
  return DOT_COLORS[bucket]
}

export default function Badge({ value, label }) {
  if (!value) return null
  const bucket = COLOR_MAP[value] || 'neutral'
  const dot = DOT_COLORS[bucket]
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-sunken)] px-2.5 py-1 font-mono text-[11px] text-[var(--text)]">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} />
      {label || humanizeEnum(value)}
    </span>
  )
}
