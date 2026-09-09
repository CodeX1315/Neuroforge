import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShieldCheck, ArrowRight, UserCog, AlertTriangle, Users } from 'lucide-react'
import { useAuth, extractErrorMessage } from '../../context/AuthContext'
import { fetchAllUsers } from '../../api/admin'
import { useOrgOverview } from '../../hooks/useOrgOverview'
import { ADMIN_RESOURCES } from '../../constants/adminResources'
import { ROLES, humanizeEnum } from '../../constants/enums'
import DashboardHeader from './DashboardHeader'
import Panel from '../../components/common/Panel'
import Button from '../../components/common/Button'
import StatTile from '../../components/common/StatTile'
import StatBreakdown from '../../components/common/StatBreakdown'
import { SkeletonCards } from '../../components/common/Skeleton'

// Groups a list of items by an enum-valued field and returns
// [{ value, count }] sorted largest-first, skipping zero counts.
function groupBy(items, field) {
  const counts = {}
  for (const item of items) {
    const value = item[field]
    if (!value) continue
    counts[value] = (counts[value] || 0) + 1
  }
  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
}

export default function AdminDashboard() {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState(null)
  const [usersLoading, setUsersLoading] = useState(true)
  const { data: org, loading: orgLoading, failed } = useOrgOverview()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data } = await fetchAllUsers()
        if (!cancelled) setUsers(data)
      } catch (err) {
        toast.error(extractErrorMessage(err, 'Could not load your team'))
      } finally {
        if (!cancelled) setUsersLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (failed.length > 0) {
      toast.error(`Couldn't load: ${failed.join(', ')} — check the endpoint paths in api/admin.js`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failed.length])

  const pending = users?.filter((u) => u.role === 'USER') ?? []
  const roleCounts = ROLES.reduce((acc, r) => {
    acc[r] = users?.filter((u) => u.role === r).length ?? 0
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} role={role} subtitle="workspace administrator" />

      {pending.length > 0 && !usersLoading && (
        <Panel className="flex items-start gap-3 border-[#c98a1e]/30 bg-[#c98a1e]/5">
          <UserCog size={16} className="mt-0.5 shrink-0 text-[#c98a1e]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--text)]">
              {pending.length} teammate{pending.length > 1 ? 's' : ''} waiting on a role
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {pending
                .slice(0, 4)
                .map((u) => u.name)
                .join(', ')}
              {pending.length > 4 ? `, +${pending.length - 4} more` : ''} joined but can't do
              anything until you assign them a role.
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-3"
              icon={ArrowRight}
              onClick={() => navigate('/admin/users')}
            >
              Assign roles
            </Button>
          </div>
        </Panel>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-sm font-semibold text-[var(--text)]">
            Organization at a glance
          </p>
          {failed.length > 0 && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#c98a1e]">
              <AlertTriangle size={12} />
              {failed.length} resource{failed.length > 1 ? 's' : ''} unavailable
            </span>
          )}
        </div>

        {orgLoading ? (
          <SkeletonCards count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <StatTile
              icon={Users}
              label="Team members"
              value={users?.length ?? '—'}
              onClick={() => navigate('/admin/users')}
            />
            {ADMIN_RESOURCES.map((r) => (
              <StatTile
                key={r.key}
                icon={r.icon}
                label={r.label}
                value={org[r.key].length}
                onClick={() => navigate(`/admin/organization/${r.key}`)}
              />
            ))}
          </div>
        )}
        <p className="mt-3 text-[11px] text-[var(--text-muted)]">
          Click any tile to open the full, read-only list for that resource.
        </p>
      </div>

      {!orgLoading && (
        <div className="grid gap-4 lg:grid-cols-3">
          <StatBreakdown
            title="Projects by status"
            counts={groupBy(org.projects, 'projectStatus')}
            emptyLabel="No projects yet"
          />
          <StatBreakdown
            title="Tasks by status"
            counts={groupBy(org.tasks, 'taskStatus')}
            emptyLabel="No tasks yet"
          />
          <StatBreakdown
            title="Bugs by severity"
            counts={groupBy(org.bugs, 'bugSeverity')}
            emptyLabel="No bugs logged yet"
          />
        </div>
      )}

      <p className="text-[11px] text-[var(--text-muted)]">
        This data is read-only — opening a specific project's full workspace to edit it still
        requires the Project Manager role, since{' '}
        <span className="font-mono">/project/project/{'{id}'}</span> doesn't allow ADMIN.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ember-500/10 text-ember-500">
              <ShieldCheck size={16} />
            </div>
            <p className="font-display text-sm font-semibold">Team &amp; roles</p>
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            {users?.length ?? 0} member{users?.length === 1 ? '' : 's'} in {user?.orgName}.
            Assign roles, or remove access for people who've left.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4 w-fit"
            icon={ArrowRight}
            onClick={() => navigate('/admin/users')}
          >
            Manage team
          </Button>
        </Panel>

        <Panel>
          <p className="mb-3 font-display text-sm font-semibold text-[var(--text)]">
            Team by role
          </p>
          <div className="space-y-2">
            {ROLES.filter((r) => r !== 'USER' && roleCounts[r] > 0).map((r) => (
              <div key={r} className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">{humanizeEnum(r)}</span>
                <span className="font-mono text-[var(--text)]">{roleCounts[r]}</span>
              </div>
            ))}
            {ROLES.every((r) => r === 'USER' || roleCounts[r] === 0) && (
              <p className="text-xs text-[var(--text-muted)]">
                No roles assigned yet — start in Team &amp; roles.
              </p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}
