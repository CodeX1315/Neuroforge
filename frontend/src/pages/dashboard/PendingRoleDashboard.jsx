import { useAuth } from '../../context/AuthContext'
import DashboardHeader from './DashboardHeader'
import Panel from '../../components/common/Panel'
import { Hourglass } from 'lucide-react'

export default function PendingRoleDashboard() {
  const { user, role } = useAuth()

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} role={role} />

      <Panel className="flex items-start gap-3 border-[#c98a1e]/30 bg-[#c98a1e]/5">
        <Hourglass size={16} className="mt-0.5 shrink-0 text-[#c98a1e]" />
        <div>
          <p className="text-sm font-medium text-[var(--text)]">Waiting on a role</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Your account was created but hasn't been assigned a role yet. An admin in{' '}
            {user?.orgName || 'your workspace'} needs to set your role from the Team &amp; roles
            page before you can access requirements, sprints, tasks, or anything else here.
          </p>
        </div>
      </Panel>
    </div>
  )
}
