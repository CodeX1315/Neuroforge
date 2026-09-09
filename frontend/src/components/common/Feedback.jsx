import { Loader2, Inbox, AlertTriangle } from 'lucide-react'

export function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--text-muted)]">
      <Loader2 size={16} className="animate-spin" />
      {label}
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--border)] px-6 py-14 text-center">
      <Inbox size={22} className="mb-1 text-[var(--text-muted)]" />
      <p className="text-sm font-medium text-[var(--text)]">{title}</p>
      {description && <p className="max-w-sm text-xs text-[var(--text-muted)]">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export function ErrorState({ title = 'Could not load this', description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-[#c4432e]/30 bg-[#c4432e]/5 px-6 py-10 text-center">
      <AlertTriangle size={20} className="text-[#c4432e]" />
      <p className="text-sm font-medium text-[var(--text)]">{title}</p>
      {description && <p className="max-w-sm text-xs text-[var(--text-muted)]">{description}</p>}
    </div>
  )
}
