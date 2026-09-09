import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:
    'bg-ember-500 text-white hover:bg-ember-600 active:bg-ember-700 disabled:bg-ember-500/50',
  secondary:
    'bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg-sunken)]',
  ghost: 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-sunken)]',
  danger: 'bg-transparent text-[#c4432e] border border-[#c4432e]/40 hover:bg-[#c4432e]/10',
}

const SIZES = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5',
  md: 'text-sm px-3.5 py-2 gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`focus-ring inline-flex items-center justify-center rounded-md font-medium
        transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        Icon && <Icon size={15} />
      )}
      {children}
    </button>
  )
}
