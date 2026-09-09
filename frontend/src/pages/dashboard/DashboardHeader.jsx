import { humanizeEnum } from '../../constants/enums'
import Panel from '../../components/common/Panel'

export default function DashboardHeader({ user, role, subtitle }) {
  return (
    <Panel className="!p-6">
      <p className="font-mono text-[11px] text-[var(--text-muted)]">
        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>
      <h2 className="mt-1 font-display text-xl font-semibold text-[var(--text)]">
        Welcome back, {user?.username?.split(' ')[0] || 'there'}
      </h2>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        {user?.orgName} · {role ? humanizeEnum(role) : "role not assigned"}
        {subtitle ? ` · ${subtitle}` : ''}
      </p>
    </Panel>
  )
}
