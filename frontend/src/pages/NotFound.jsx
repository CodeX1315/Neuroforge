import { Link } from 'react-router-dom'
import { Flame } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--bg)] px-6 text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ember-500 text-white">
        <Flame size={18} strokeWidth={2.5} />
      </div>
      <h1 className="font-display text-xl font-semibold text-[var(--text)]">Page not found</h1>
      <p className="max-w-xs text-sm text-[var(--text-muted)]">
        That page doesn't exist, or you don't have access to it.
      </p>
      <Link to="/" className="mt-1 text-sm font-medium text-ember-500 hover:underline">
        Back to dashboard
      </Link>
    </div>
  )
}
