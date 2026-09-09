import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Pencil, Trash2 } from 'lucide-react'
import { extractErrorMessage } from '../../../context/AuthContext'
import { editProject, updateProjectStatus, deleteProject } from '../../../api/project'
import { PROJECT_STATUSES } from '../../../constants/enums'
import Panel from '../../../components/common/Panel'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import { Field, Input, Textarea, Select } from '../../../components/common/Field'

export default function OverviewTab({ project, onProjectChange }) {
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    title: project.title,
    description: project.description,
    start_date: project.start_date,
    end_date: project.end_date,
  })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [statusSaving, setStatusSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleEdit(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      const { data } = await editProject(project.id, form)
      onProjectChange(data)
      toast.success('Project updated')
      setEditOpen(false)
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not update the project'))
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(e) {
    const projectStatus = e.target.value
    setStatusSaving(true)
    try {
      await updateProjectStatus(project.id, projectStatus)
      onProjectChange({ ...project, projectStatus })
      toast.success('Status updated')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not update status'))
    } finally {
      setStatusSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteProject(project.id)
      toast.success('Project deleted')
      navigate('/projects')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete the project'))
      setDeleting(false)
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Panel className="lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-sm font-semibold text-[var(--text)]">Details</p>
          <Button variant="secondary" size="sm" icon={Pencil} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        </div>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-xs text-[var(--text-muted)]">Description</dt>
            <dd className="mt-1 text-[var(--text)]">{project.description}</dd>
          </div>
          <div className="flex gap-8">
            <div>
              <dt className="text-xs text-[var(--text-muted)]">Start date</dt>
              <dd className="mt-1 font-mono text-[var(--text)]">{project.start_date}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">End date</dt>
              <dd className="mt-1 font-mono text-[var(--text)]">{project.end_date}</dd>
            </div>
          </div>
        </dl>
      </Panel>

      <div className="space-y-5">
        <Panel>
          <p className="mb-3 font-display text-sm font-semibold text-[var(--text)]">Status</p>
          <Select
            value={project.projectStatus}
            options={PROJECT_STATUSES}
            onChange={handleStatusChange}
            disabled={statusSaving}
          />
        </Panel>

        <Panel className="border-[#c4432e]/30">
          <p className="mb-1 font-display text-sm font-semibold text-[var(--text)]">Danger zone</p>
          <p className="mb-3 text-xs text-[var(--text-muted)]">
            Deleting a project removes it permanently.
          </p>
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => setConfirmDelete(true)}>
            Delete project
          </Button>
        </Panel>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit project">
        <form onSubmit={handleEdit} className="space-y-4">
          <Field label="Title" required>
            <Input required value={form.title} onChange={update('title')} />
          </Field>
          <Field label="Description" required>
            <Textarea required value={form.description} onChange={update('description')} />
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
            <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save changes
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this project?"
        description="This permanently removes the project. This can't be undone."
        confirmLabel="Delete project"
      />
    </div>
  )
}
