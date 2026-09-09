import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Rocket, X } from 'lucide-react'
import { extractErrorMessage, useAuth } from '../../../context/AuthContext'
import { fetchReleasesByProject, createRelease, updateReleaseStatus, deleteRelease } from '../../../api/release'
import { fetchAllSprints } from '../../../api/sprint'
import { fetchRepositoriesByProject } from '../../../api/repository'
import { RELEASE_STATUSES } from '../../../constants/enums'
import Panel from '../../../components/common/Panel'
import DataTable from '../../../components/common/DataTable'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import { Field, Input, Textarea, Select } from '../../../components/common/Field'
import { Spinner, EmptyState, ErrorState } from '../../../components/common/Feedback'
import { SkeletonTable } from '../../../components/common/Skeleton'
import DeploymentsPanel from './DeploymentsPanel'

const emptyForm = { sprintId: '', repositoryId: '', version: '', changelog: '' }

export default function ReleasesTab({ project }) {
  const { role } = useAuth()
  // POST /release/create, status/changelog updates, and delete are all
  // ADMIN/PROJECT_MANAGER-only — BA, Developer and DevOps see read-only here
  // (DevOps manages Deployments instead, one level down).
  const canManage = role === 'ADMIN' || role === 'PROJECT_MANAGER'
  const [releases, setReleases] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [sprints, setSprints] = useState([])
  const [repos, setRepos] = useState([])
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [activeRelease, setActiveRelease] = useState(null)

  async function load() {
    setLoading(true)
    setError(false)
    try {
      const { data } = await fetchReleasesByProject(project.id)
      setReleases(data)
    } catch (err) {
      setError(true)
      toast.error(extractErrorMessage(err, 'Could not load releases'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function openCreate() {
    setForm(emptyForm)
    setFormError('')
    setCreateOpen(true)
    try {
      const [sprintRes, repoRes] = await Promise.all([
        fetchAllSprints(project.id),
        fetchRepositoriesByProject(project.id),
      ])
      setSprints(sprintRes.data)
      setRepos(repoRes.data)
    } catch {
      // Selects just stay empty — the ID fields inline validation will catch it.
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await createRelease({
        ...form,
        projectId: project.id,
        sprintId: Number(form.sprintId),
        repositoryId: Number(form.repositoryId),
      })
      toast.success('Release created')
      setCreateOpen(false)
      load()
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not create the release'))
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(id, releaseStatus) {
    const previous = releases
    setReleases((list) => list.map((r) => (r.id === id ? { ...r, releaseStatus } : r)))
    try {
      await updateReleaseStatus(id, releaseStatus)
    } catch (err) {
      setReleases(previous)
      toast.error(extractErrorMessage(err, 'Could not update status'))
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteRelease(pendingDelete.id)
      toast.success('Release deleted')
      if (activeRelease?.id === pendingDelete.id) setActiveRelease(null)
      setPendingDelete(null)
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete release'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">Releases cut from this project's sprints.</p>
        {canManage && (
          <Button size="sm" icon={Plus} onClick={openCreate}>
            New release
          </Button>
        )}
      </div>

      <Panel padded={false}>
        {loading ? (
          <SkeletonTable rows={4} cols={3} />
        ) : error ? (
          <div className="p-5">
            <ErrorState description="Try refreshing the page." />
          </div>
        ) : releases.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No releases yet"
              action={
                canManage ? (
                  <Button size="sm" icon={Plus} onClick={openCreate}>
                    New release
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <DataTable
            onRowClick={(row) => setActiveRelease(row)}
            columns={[
              { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span> },
              { key: 'version', header: 'Version', render: (r) => <span className="font-mono">{r.version}</span> },
              { key: 'releaseDate', header: 'Date' },
              {
                key: 'releaseStatus',
                header: 'Status',
                render: (r) =>
                  canManage ? (
                    <Select
                      value={r.releaseStatus}
                      options={RELEASE_STATUSES}
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                      className="!py-1.5 text-xs"
                    />
                  ) : (
                    <Badge value={r.releaseStatus} />
                  ),
              },
            ]}
            rows={releases}
            actions={(row) => (
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => setActiveRelease(row)}
                  className="focus-ring rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-sunken)] hover:text-[var(--text)]"
                  title="View deployments"
                >
                  <Rocket size={14} />
                </button>
                {canManage && (
                  <button
                    onClick={() => setPendingDelete(row)}
                    className="focus-ring rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[#c4432e]/10 hover:text-[#c4432e]"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          />
        )}
      </Panel>

      {activeRelease && (
        <Panel padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-sunken)] px-4 py-3">
            <p className="text-sm font-medium text-[var(--text)]">
              Deployments for <span className="font-mono text-ember-500">{activeRelease.version}</span>
            </p>
            <div className="flex items-center gap-2">
              <Badge value={activeRelease.releaseStatus} />
              <button
                onClick={() => setActiveRelease(null)}
                className="focus-ring rounded-md p-1 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X size={15} />
              </button>
            </div>
          </div>
          <div className="p-4">
            <DeploymentsPanel release={activeRelease} />
          </div>
        </Panel>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New release">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Version" required>
            <Input required value={form.version} onChange={update('version')} placeholder="v1.2.0" />
          </Field>
          <Field label="Sprint" required hint={sprints.length === 0 ? 'No sprints found for this project' : undefined}>
            <select
              required
              value={form.sprintId}
              onChange={update('sprintId')}
              className="focus-ring w-full rounded-md border border-[var(--border)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--text)]"
            >
              <option value="">Choose a sprint</option>
              {sprints.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Repository" required hint={repos.length === 0 ? 'No repositories linked yet' : undefined}>
            <select
              required
              value={form.repositoryId}
              onChange={update('repositoryId')}
              className="focus-ring w-full rounded-md border border-[var(--border)] bg-[var(--bg-raised)] px-3 py-2 text-sm text-[var(--text)]"
            >
              <option value="">Choose a repository</option>
              {repos.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.repositoryName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Changelog" required>
            <Textarea required value={form.changelog} onChange={update('changelog')} />
          </Field>
          {formError && <p className="text-xs text-[#c4432e]">{formError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create release
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this release?"
        confirmLabel="Delete release"
      />
    </div>
  )
}
