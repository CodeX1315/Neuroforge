import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, ExternalLink, GitBranch } from 'lucide-react'
import { extractErrorMessage, useAuth } from '../../../context/AuthContext'
import { fetchRepositoriesByProject, createRepository } from '../../../api/repository'
import Panel from '../../../components/common/Panel'
import DataTable from '../../../components/common/DataTable'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import { Field, Input } from '../../../components/common/Field'
import { Spinner, EmptyState, ErrorState } from '../../../components/common/Feedback'
import { SkeletonTable } from '../../../components/common/Skeleton'

const emptyForm = { gitHubRepoId: '', repositoryName: '', url: '', defaultBranch: 'main' }

export default function RepositoriesTab({ project }) {
  const { role } = useAuth()
  // POST /repository/create is ADMIN/PROJECT_MANAGER-only on the backend —
  // everyone else on this tab (BA, Developer, DevOps) is read-only.
  const canManage = role === 'ADMIN' || role === 'PROJECT_MANAGER'
  const [repos, setRepos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  async function load() {
    setLoading(true)
    setError(false)
    try {
      const { data } = await fetchRepositoriesByProject(project.id)
      setRepos(data)
    } catch (err) {
      setError(true)
      toast.error(extractErrorMessage(err, 'Could not load repositories'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function openCreate() {
    setForm(emptyForm)
    setFormError('')
    setCreateOpen(true)
  }

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await createRepository({ ...form, projectId: project.id })
      toast.success('Repository linked')
      setCreateOpen(false)
      load()
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not link the repository'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          Repositories linked to this project. Releases reference one of these.
        </p>
        {canManage && (
          <Button size="sm" icon={Plus} onClick={openCreate}>
            Link repository
          </Button>
        )}
      </div>

      <Panel padded={false}>
        {loading ? (
          <SkeletonTable rows={3} cols={3} />
        ) : error ? (
          <div className="p-5">
            <ErrorState description="Try refreshing the page." />
          </div>
        ) : repos.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No repositories linked yet"
              action={
                canManage ? (
                  <Button size="sm" icon={Plus} onClick={openCreate}>
                    Link repository
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <DataTable
            columns={[
              { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span> },
              {
                key: 'repositoryName',
                header: 'Repository',
                render: (r) => (
                  <span className="flex items-center gap-2">
                    <GitBranch size={14} className="text-[var(--text-muted)]" />
                    {r.repositoryName}
                  </span>
                ),
              },
              { key: 'defaultBranch', header: 'Default branch', render: (r) => <span className="font-mono text-xs">{r.defaultBranch}</span> },
              {
                key: 'url',
                header: 'URL',
                render: (r) => (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-ember-500 hover:underline"
                  >
                    Open <ExternalLink size={12} />
                  </a>
                ),
              },
            ]}
            rows={repos}
          />
        )}
      </Panel>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Link a repository">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Repository name" required>
            <Input required value={form.repositoryName} onChange={update('repositoryName')} placeholder="neuroforge-api" />
          </Field>
          <Field label="GitHub repo ID" required>
            <Input required value={form.gitHubRepoId} onChange={update('gitHubRepoId')} />
          </Field>
          <Field label="URL" required>
            <Input
              required
              type="url"
              value={form.url}
              onChange={update('url')}
              placeholder="https://github.com/org/repo"
            />
          </Field>
          <Field label="Default branch" required>
            <Input required value={form.defaultBranch} onChange={update('defaultBranch')} />
          </Field>
          {formError && <p className="text-xs text-[#c4432e]">{formError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Link repository
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
