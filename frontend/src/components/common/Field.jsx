import { humanizeEnum } from '../../constants/enums'

export function Field({ label, hint, error, children, required, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-[13px] font-medium text-[var(--text)]">
          {label}
          {required && <span className="text-ember-500"> *</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-[var(--text-muted)]">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-[#c4432e]">{error}</span>}
    </label>
  )
}

const baseFieldClasses =
  'focus-ring w-full rounded-md border border-[var(--border)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] transition-colors'

export function Input({ className = '', ...rest }) {
  return <input className={`${baseFieldClasses} ${className}`} {...rest} />
}

export function Textarea({ className = '', rows = 4, ...rest }) {
  return <textarea rows={rows} className={`${baseFieldClasses} resize-y ${className}`} {...rest} />
}

export function Select({ className = '', options = [], placeholder, ...rest }) {
  return (
    <select className={`${baseFieldClasses} ${className}`} {...rest}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {humanizeEnum(opt)}
        </option>
      ))}
    </select>
  )
}
