import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, ListTodo, X } from 'lucide-react'
import { extractErrorMessage } from '../../../context/AuthContext'
import { fetchAllSprints, createSprint, updateSprint, deleteSprint } from '../../../api/sprint'
import Panel from '../../../components/common/Panel'
import DataTable from '../../../components/common/DataTable'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import { Field, Input, Textarea } from '../../../components/common/Field'
import { Spinner, EmptyState, ErrorState } from '../../../components/common/Feedback'
import { SkeletonTable } from '../../../components/common/Skeleton'
import TasksPanel from './TasksPanel'

const emptyForm = { name: '', start_date: '', end_date: '', goal: '' }

export default function SprintsTab({ project }) {
  const [sprints, setSprints] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [activeSprint, setActiveSprint] = useState(null)

  async function load() {
    setLoading(true)
    setError(false)
    try {
      const { data } = await fetchAllSprints(project.id)
      setSprints(data)
    } catch (err) {
      setError(true)
      toast.error(extractErrorMessage(err, 'Could not load sprints'))
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
    setForm({ name: row.name, start_date: row.start_date, end_date: row.end_date, goal: row.goal })
    setFormError('')
  }

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await createSprint({ ...form, projectId: project.id })
      toast.success('Sprint created')
      setCreateOpen(false)
      load()
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not create the sprint'))
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await updateSprint(editing.id, form)
      toast.success('Sprint updated')
      setEditing(null)
      load()
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not update the sprint'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteSprint(pendingDelete.id)
      toast.success('Sprint deleted')
      if (activeSprint?.id === pendingDelete.id) setActiveSprint(null)
      setPendingDelete(null)
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete sprint'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          Sprints for this project. Open one to manage its tasks.
        </p>
        <Button size="sm" icon={Plus} onClick={openCreate}>
          New sprint
        </Button>
      </div>

      <Panel padded={false}>
        {loading ? (
          <SkeletonTable rows={4} cols={4} />
        ) : error ? (
          <div className="p-5">
            <ErrorState description="Try refreshing the page." />
          </div>
        ) : sprints.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No sprints yet"
              description="Create a sprint to start assigning tasks to your team."
              action={
                <Button size="sm" icon={Plus} onClick={openCreate}>
                  New sprint
                </Button>
              }
            />
          </div>
        ) : (
          <DataTable
            onRowClick={(row) => setActiveSprint(row)}
            columns={[
              { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span> },
              { key: 'name', header: 'Name' },
              { key: 'goal', header: 'Goal' },
              { key: 'start_date', header: 'Start' },
              { key: 'end_date', header: 'End' },
            ]}
            rows={sprints}
            actions={(row) => (
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => setActiveSprint(row)}
                  className="focus-ring rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-sunken)] hover:text-[var(--text)]"
                  title="View tasks"
                >
                  <ListTodo size={14} />
                </button>
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

      {activeSprint && (
        <Panel padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-sunken)] px-4 py-3">
            <p className="text-sm font-medium text-[var(--text)]">
              Tasks in <span className="text-ember-500">{activeSprint.name}</span>
            </p>
            <button
              onClick={() => setActiveSprint(null)}
              className="focus-ring rounded-md p-1 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <X size={15} />
            </button>
          </div>
          <div className="p-4">
            <TasksPanel sprint={activeSprint} />
          </div>
        </Panel>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New sprint">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Name" required>
            <Input required value={form.name} onChange={update('name')} placeholder="Sprint 1" />
          </Field>
          <Field label="Goal" required>
            <Textarea required value={form.goal} onChange={update('goal')} />
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
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create sprint
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit sprint">
        <form onSubmit={handleEdit} className="space-y-4">
          <Field label="Name" required>
            <Input required value={form.name} onChange={update('name')} />
          </Field>
          <Field label="Goal" required>
            <Textarea required value={form.goal} onChange={update('goal')} />
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
        title="Delete this sprint?"
        description="Its tasks will lose their sprint association."
        confirmLabel="Delete sprint"
      />
    </div>
  )
}
