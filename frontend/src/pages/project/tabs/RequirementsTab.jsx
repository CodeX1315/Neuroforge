import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { extractErrorMessage } from '../../../context/AuthContext'
import {
  fetchRequirementsByProject,
  createRequirement,
  updateRequirementStatus,
  editRequirement,
  deleteRequirement,
} from '../../../api/requirement'
import { REQUIREMENT_PRIORITIES, REQUIREMENT_STATUSES } from '../../../constants/enums'
import Panel from '../../../components/common/Panel'
import DataTable from '../../../components/common/DataTable'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import { Field, Input, Textarea, Select } from '../../../components/common/Field'
import { Spinner, EmptyState, ErrorState } from '../../../components/common/Feedback'
import { SkeletonTable } from '../../../components/common/Skeleton'

const emptyForm = { title: '', description: '', requirementPriority: 'MEDIUM', requirementStatus: 'DRAFT' }

export default function RequirementsTab({ project }) {
  const [requirements, setRequirements] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    setError(false)
    try {
      const { data } = await fetchRequirementsByProject(project.id)
      setRequirements(data)
    } catch (err) {
      setError(true)
      toast.error(extractErrorMessage(err, 'Could not load requirements'))
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

  function openEdit(row) {
    setEditing(row)
    setForm({ title: row.title, description: row.description })
    setFormError('')
  }

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await createRequirement({ ...form, projectId: project.id })
      toast.success('Requirement created')
      setCreateOpen(false)
      load()
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not create the requirement'))
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await editRequirement(editing.id, { title: form.title, description: form.description })
      toast.success('Requirement updated')
      setEditing(null)
      load()
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not update the requirement'))
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(id, requirementStatus) {
    const previous = requirements
    setRequirements((list) => list.map((r) => (r.id === id ? { ...r, requirementStatus } : r)))
    try {
      await updateRequirementStatus(id, requirementStatus)
    } catch (err) {
      setRequirements(previous)
      toast.error(extractErrorMessage(err, 'Could not update status'))
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteRequirement(pendingDelete.id)
      toast.success('Requirement deleted')
      setPendingDelete(null)
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete requirement'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">Requirements you've authored for this project.</p>
        <Button size="sm" icon={Plus} onClick={openCreate}>
          New requirement
        </Button>
      </div>

      <Panel padded={false}>
        {loading ? (
          <SkeletonTable rows={5} cols={3} />
        ) : error ? (
          <div className="p-5">
            <ErrorState description="Try refreshing the page." />
          </div>
        ) : requirements.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No requirements yet"
              description="Capture what needs to be built before breaking it into sprints."
              action={
                <Button size="sm" icon={Plus} onClick={openCreate}>
                  New requirement
                </Button>
              }
            />
          </div>
        ) : (
          <DataTable
            columns={[
              { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span> },
              { key: 'title', header: 'Title' },
              { key: 'priority', header: 'Priority', render: (r) => <Badge value={r.requirementPriority} /> },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <Select
                    value={r.requirementStatus}
                    options={REQUIREMENT_STATUSES}
                    onChange={(e) => handleStatusChange(r.id, e.target.value)}
                    className="!py-1.5 text-xs"
                  />
                ),
              },
            ]}
            rows={requirements}
            actions={(row) => (
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => openEdit(row)}
                  className="focus-ring rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-sunken)] hover:text-[var(--text)]"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setPendingDelete(row)}
                  className="focus-ring rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[#c4432e]/10 hover:text-[#c4432e]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          />
        )}
      </Panel>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New requirement">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Title" required>
            <Input required value={form.title} onChange={update('title')} />
          </Field>
          <Field label="Description" required>
            <Textarea required value={form.description} onChange={update('description')} />
          </Field>
          <Field label="Priority" required>
            <Select
              required
              options={REQUIREMENT_PRIORITIES}
              value={form.requirementPriority}
              onChange={update('requirementPriority')}
            />
          </Field>
          <Field label="Status" required>
            <Select
              required
              options={REQUIREMENT_STATUSES}
              value={form.requirementStatus}
              onChange={update('requirementStatus')}
            />
          </Field>
          {formError && <p className="text-xs text-[#c4432e]">{formError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create requirement
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit requirement">
        <form onSubmit={handleEdit} className="space-y-4">
          <Field label="Title" required>
            <Input required value={form.title} onChange={update('title')} />
          </Field>
          <Field label="Description" required>
            <Textarea required value={form.description} onChange={update('description')} />
          </Field>
          {formError && <p className="text-xs text-[#c4432e]">{formError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save changes
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this requirement?"
        description="Tasks generated from it may also be affected."
        confirmLabel="Delete requirement"
      />
    </div>
  )
}
