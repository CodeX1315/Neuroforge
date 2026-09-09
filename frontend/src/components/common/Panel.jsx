export default function Panel({ children, className = '', padded = true }) {
  return (
    <div
      className={`rounded-lg border border-[var(--border)] bg-[var(--bg-raised)] shadow-panel ${
        padded ? 'p-5' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
