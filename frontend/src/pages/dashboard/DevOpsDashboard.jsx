import { useAuth } from '../../context/AuthContext'
import DashboardHeader from './DashboardHeader'
import ProjectJumpCard from './ProjectJumpCard'
import Panel from '../../components/common/Panel'
import { Rocket } from 'lucide-react'

export default function DevOpsDashboard() {
  const { user, role } = useAuth()

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} role={role} />

      <div className="grid gap-4 md:grid-cols-2">
        <ProjectJumpCard hint="You'll land on the project's Releases & Deployments tab." />

        <Panel>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ember-500/10 text-ember-500">
              <Rocket size={16} />
            </div>
            <p className="font-display text-sm font-semibold text-[var(--text)]">
              Your workflow
            </p>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-[var(--text-muted)]">
            <li>• Open a project, pick a release, and start or track a deployment.</li>
            <li>• Set the environment (development, staging, production) and update status as it runs.</li>
            <li>• You can also browse linked repositories for context on what's being deployed.</li>
          </ul>
        </Panel>
      </div>
    </div>
  )
}
