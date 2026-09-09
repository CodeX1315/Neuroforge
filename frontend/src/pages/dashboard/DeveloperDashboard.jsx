import { useAuth } from '../../context/AuthContext'
import { fetchTasksBySprintAndDeveloper, fetchTasksByRequirementAndDeveloper } from '../../api/task'
import DashboardHeader from './DashboardHeader'
import ProjectJumpCard from './ProjectJumpCard'
import TaskLookupCard from './TaskLookupCard'
import { CalendarRange, ClipboardList } from 'lucide-react'

export default function DeveloperDashboard() {
  const { user, role } = useAuth()

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} role={role} />

      <div>
        <p className="mb-3 font-display text-sm font-semibold text-[var(--text)]">My tasks</p>
        <div className="grid gap-4 md:grid-cols-2">
          <TaskLookupCard
            icon={CalendarRange}
            title="By sprint"
            idLabel="Sprint ID, e.g. 3"
            fetchFn={fetchTasksBySprintAndDeveloper}
          />
          <TaskLookupCard
            icon={ClipboardList}
            title="By requirement"
            idLabel="Requirement ID, e.g. 7"
            fetchFn={fetchTasksByRequirementAndDeveloper}
          />
        </div>
        <p className="mt-2 text-[11px] text-[var(--text-muted)]">
          Don't have the ID? Your project manager can see it on the project's Sprints &amp; tasks
          tab or the Requirements tab.
        </p>
      </div>

      <ProjectJumpCard hint="You'll land on the project's Repositories and Releases &amp; Deployments tabs." />
    </div>
  )
}
