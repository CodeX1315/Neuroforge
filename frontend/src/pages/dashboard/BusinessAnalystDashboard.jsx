import { useAuth } from '../../context/AuthContext'
import DashboardHeader from './DashboardHeader'
import ProjectJumpCard from './ProjectJumpCard'
import Panel from '../../components/common/Panel'
import { ClipboardList } from 'lucide-react'

export default function BusinessAnalystDashboard() {
  const { user, role } = useAuth()

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} role={role} />

      <div className="grid gap-4 md:grid-cols-2">
        <ProjectJumpCard hint="You'll land in the project's Requirements tab, where you can write up new requirements and track their status." />

        <Panel>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ember-500/10 text-ember-500">
              <ClipboardList size={16} />
            </div>
            <p className="font-display text-sm font-semibold text-[var(--text)]">
              Your workflow
            </p>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-[var(--text-muted)]">
            <li>• Draft requirements against a project — title, description, priority, status.</li>
            <li>• Requirements you write feed into the sprints and tasks your PM builds.</li>
            <li>
              • You'll also see Repositories and Releases &amp; Deployments for context on what's
              shipping.
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  )
}
