import { useAuth } from '../../context/AuthContext'
import DashboardHeader from './DashboardHeader'
import ProjectJumpCard from './ProjectJumpCard'
import Panel from '../../components/common/Panel'
import { Bug } from 'lucide-react'

export default function QaDashboard() {
  const { user, role } = useAuth()

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} role={role} />

      <div className="grid gap-4 md:grid-cols-2">
        <ProjectJumpCard hint="You'll land on the project's Test cases & bugs tab, where you can look up a task by ID." />

        <Panel>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ember-500/10 text-ember-500">
              <Bug size={16} />
            </div>
            <p className="font-display text-sm font-semibold text-[var(--text)]">
              Your workflow
            </p>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-[var(--text-muted)]">
            <li>• Open a project, then look up a task by ID to see or add its test cases.</li>
            <li>• Log bugs against a specific test case, and track severity and status.</li>
            <li>
              • There's no task directory for QA yet — the task ID has to come from your project
              manager until a "tasks ready for testing" endpoint exists.
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  )
}
