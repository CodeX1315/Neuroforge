import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { extractErrorMessage } from '../../../context/AuthContext'
import {
  fetchTasksBySprint,
  createTask,
  deleteTaskBySprint,
  updateTaskStatus,
  updateTaskPriority,
} from '../../../api/task'
import { TASK_STATUSES, TASK_PRIORITIES } from '../../../constants/enums'
import DataTable from '../../../components/common/DataTable'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import { Field, Input, Textarea, Select } from '../../../components/common/Field'
import { Spinner, EmptyState, ErrorState } from '../../../components/common/Feedback'
import { SkeletonTable } from '../../../components/common/Skeleton'

const emptyForm = {
  requirementId: '',
  assignedDeveloperId: '',
  title: '',
  description: '',
  estimatedHours: '',
  taskStatus: 'TODO',
  taskPriority: 'MEDIUM',
}

export default function TasksPanel({ sprint }) {
  const [tasks, setTasks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  async function load() {
    setLoading(true)
    setError(false)
    try {
      const { data } = await fetchTasksBySprint(sprint.id)
      setTasks(data)
    } catch (err) {
      setError(true)
      toast.error(extractErrorMessage(err, 'Could not load tasks'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprint.id])

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
      await createTask({
        ...form,
        sprintId: sprint.id,
        requirementId: Number(form.requirementId),
        assignedDeveloperId: Number(form.assignedDeveloperId),
        estimatedHours: Number(form.estimatedHours),
      })
      toast.success('Task created')
      setCreateOpen(false)
      load()
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not create the task'))
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(id, taskStatus) {
    const previous = tasks
    setTasks((list) => list.map((t) => (t.id === id ? { ...t, taskStatus } : t)))
    try {
      await updateTaskStatus(id, taskStatus)
    } catch (err) {
      setTasks(previous)
      toast.error(extractErrorMessage(err, 'Could not update status'))
    }
  }

  async function handlePriorityChange(id, taskPriority) {
    const previous = tasks
    setTasks((list) => list.map((t) => (t.id === id ? { ...t, taskPriority } : t)))
    try {
      await updateTaskPriority(id, taskPriority)
    } catch (err) {
      setTasks(previous)
      toast.error(extractErrorMessage(err, 'Could not update priority'))
    }
  }

  async function handleDelete(taskId) {
    setDeletingId(taskId)
    try {
      await deleteTaskBySprint(taskId, sprint.id)
      toast.success('Task deleted')
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete task'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-muted)]">{tasks?.length ?? 0} task(s) in this sprint</p>
        <Button size="sm" icon={Plus} onClick={openCreate}>
          New task
        </Button>
      </div>

      {loading ? (
        <SkeletonTable rows={3} cols={4} />
      ) : error ? (
        <ErrorState description="Try refreshing the page." />
      ) : tasks.length === 0 ? (
        <EmptyState title="No tasks in this sprint yet" />
      ) : (
        <DataTable
          columns={[
            { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span> },
            { key: 'title', header: 'Title' },
            { key: 'estimatedHours', header: 'Est. hours' },
            {
              key: 'taskPriority',
              header: 'Priority',
              render: (r) => (
                <Select
                  value={r.taskPriority}
                  options={TASK_PRIORITIES}
                  onChange={(e) => handlePriorityChange(r.id, e.target.value)}
                  className="!py-1.5 text-xs"
                />
              ),
            },
            {
              key: 'taskStatus',
              header: 'Status',
              render: (r) => (
                <Select
                  value={r.taskStatus}
                  options={TASK_STATUSES}
                  onChange={(e) => handleStatusChange(r.id, e.target.value)}
                  className="!py-1.5 text-xs"
                />
              ),
            },
          ]}
          rows={tasks}
          actions={(row) => (
            <button
              onClick={() => handleDelete(row.id)}
              disabled={deletingId === row.id}
              className="focus-ring rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[#c4432e]/10 hover:text-[#c4432e] disabled:opacity-50"
            >
              <Trash2 size={14} />
            </button>
          )}
        />
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New task">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Title" required>
            <Input required value={form.title} onChange={update('title')} />
          </Field>
          <Field label="Description" required>
            <Textarea required value={form.description} onChange={update('description')} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Requirement ID"
              required
              hint="Ask your business analyst for the requirement's ID"
            >
              <Input
                type="number"
                required
                value={form.requirementId}
                onChange={update('requirementId')}
              />
            </Field>
            <Field label="Estimated hours" required>
              <Input
                type="number"
                min="1"
                required
                value={form.estimatedHours}
                onChange={update('estimatedHours')}
              />
            </Field>
          </div>
          <Field label="Assigned developer's user ID" required hint="Find this on the Team & roles page">
            <Input
              type="number"
              required
              value={form.assignedDeveloperId}
              onChange={update('assignedDeveloperId')}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Priority" required>
              <Select
                required
                options={TASK_PRIORITIES}
                value={form.taskPriority}
                onChange={update('taskPriority')}
              />
            </Field>
            <Field label="Status" required>
              <Select
                required
                options={TASK_STATUSES}
                value={form.taskStatus}
                onChange={update('taskStatus')}
              />
            </Field>
          </div>
          {formError && <p className="text-xs text-[#c4432e]">{formError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
