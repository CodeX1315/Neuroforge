import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { usePageTitle } from '../../context/PageTitleContext'
import { extractErrorMessage } from '../../context/AuthContext'
import { fetchAllProjects, createProject } from '../../api/project'
import { PROJECT_STATUSES } from '../../constants/enums'
import Panel from '../../components/common/Panel'
import DataTable from '../../components/common/DataTable'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { Field, Input, Textarea, Select } from '../../components/common/Field'
import { Spinner, EmptyState, ErrorState } from '../../components/common/Feedback'
import { SkeletonTable } from '../../components/common/Skeleton'

const emptyForm = {
  title: '',
  description: '',
  projectStatus: 'PLANNING',
  start_date: '',
  end_date: '',
}

export default function ProjectsList() {
  usePageTitle('Projects')
  const navigate = useNavigate()
  const [projects, setProjects] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  async function load() {
    setLoading(true)
    setError(false)
    try {
      const { data } = await fetchAllProjects()
      setProjects(data)
    } catch (err) {
      setError(true)
      toast.error(extractErrorMessage(err, 'Could not load projects'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await createProject(form)
      toast.success('Project created')
      setModalOpen(false)
      setForm(emptyForm)
      load()
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not create the project'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--text)]">Projects</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Each project is a self-contained workspace for its requirements, sprints, tasks and
            releases.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          New project
        </Button>
      </div>

      <Panel padded={false}>
        {loading ? (
          <SkeletonTable rows={5} cols={4} />
        ) : error ? (
          <div className="p-5">
            <ErrorState description="Try refreshing the page." />
          </div>
        ) : projects.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No projects yet"
              description="Create your first project to start tracking requirements, sprints and releases."
              action={
                <Button size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
                  New project
                </Button>
              }
            />
          </div>
        ) : (
          <DataTable
            onRowClick={(row) => navigate(`/projects/${row.id}`)}
            columns={[
              { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span> },
              { key: 'title', header: 'Title' },
              {
                key: 'status',
                header: 'Status',
                render: (row) => <Badge value={row.projectStatus} />,
              },
              { key: 'start_date', header: 'Start' },
              { key: 'end_date', header: 'End' },
            ]}
            rows={projects}
          />
        )}
      </Panel>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New project">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Title" required>
            <Input required value={form.title} onChange={update('title')} placeholder="Mobile app redesign" />
          </Field>
          <Field label="Description" required>
            <Textarea
              required
              value={form.description}
              onChange={update('description')}
              placeholder="What is this project about?"
            />
          </Field>
          <Field label="Status" required>
            <Select
              required
              options={PROJECT_STATUSES}
              value={form.projectStatus}
              onChange={update('projectStatus')}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date" required>
              <Input type="date" required value={form.start_date} onChange={update('start_date')} />
            </Field>
            <Field label="End date" required>
              <Input type="date" required value={form.end_date} onChange={update('end_date')} />
            </Field>
          </div>

          {formError && <p className="text-xs text-[#c4432e]">{formError}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
