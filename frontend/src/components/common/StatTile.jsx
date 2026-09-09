export default function StatTile({ icon: Icon, label, value, onClick, active }) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Wrapper
      onClick={onClick}
      className={`focus-ring rounded-lg border p-4 text-left transition-colors ${
        onClick ? 'cursor-pointer hover:border-ember-500/40 hover:bg-[var(--bg-sunken)]' : ''
      } ${
        active
          ? 'border-ember-500 bg-ember-500/5'
          : 'border-[var(--border)] bg-[var(--bg-raised)]'
      }`}
    >
      <div className="flex items-center gap-2 text-[var(--text-muted)]">
        {Icon && <Icon size={14} />}
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-[var(--text)]">{value}</p>
    </Wrapper>
  )
}
