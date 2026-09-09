import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, ArrowRight, FolderKanban } from 'lucide-react'
import { useAuth, extractErrorMessage } from '../../context/AuthContext'
import { fetchAllProjects } from '../../api/project'
import DashboardHeader from './DashboardHeader'
import Panel from '../../components/common/Panel'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import { SkeletonCards } from '../../components/common/Skeleton'
import { EmptyState } from '../../components/common/Feedback'

const STATUS_ORDER = ['ACTIVE', 'PLANNING', 'ON_HOLD', 'COMPLETED', 'CANCELLED']

export default function ProjectManagerDashboard() {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data } = await fetchAllProjects()
        if (!cancelled) setProjects(data)
      } catch (err) {
        toast.error(extractErrorMessage(err, 'Could not load your projects'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = projects?.filter((p) => p.projectStatus === s).length ?? 0
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} role={role} />

      {loading ? (
        <SkeletonCards count={3} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATUS_ORDER.map((status) => (
              <Panel key={status} className="!p-4">
                <p className="text-xs text-[var(--text-muted)]">
                  <Badge value={status} />
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-[var(--text)]">
                  {counts[status]}
                </p>
              </Panel>
            ))}
          </div>

          <Panel padded={false}>
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
              <p className="font-display text-sm font-semibold text-[var(--text)]">Your projects</p>
              <div className="flex items-center gap-2">
                <Button size="sm" icon={Plus} onClick={() => navigate('/projects')}>
                  New project
                </Button>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="No projects yet"
                  description="Create your first project to start tracking requirements, sprints and releases."
                  action={
                    <Button size="sm" icon={Plus} onClick={() => navigate('/projects')}>
                      New project
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {projects.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="focus-ring flex w-full items-center justify-between px-5 py-3 text-left hover:bg-[var(--bg-sunken)]"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderKanban size={14} className="text-[var(--text-muted)]" />
                      <span className="text-sm text-[var(--text)]">{p.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge value={p.projectStatus} />
                      <ArrowRight size={13} className="text-[var(--text-muted)]" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {projects.length > 6 && (
              <div className="border-t border-[var(--border)] px-5 py-2.5">
                <button
                  onClick={() => navigate('/projects')}
                  className="focus-ring text-xs font-medium text-ember-500 hover:underline"
                >
                  View all {projects.length} projects →
                </button>
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  )
}
