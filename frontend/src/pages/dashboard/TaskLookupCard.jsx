import { useState } from 'react'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'
import { useAuth, extractErrorMessage } from '../../context/AuthContext'
import { updateTaskStatus } from '../../api/task'
import { TASK_STATUSES } from '../../constants/enums'
import Panel from '../../components/common/Panel'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import DataTable from '../../components/common/DataTable'
import { Field, Input, Select } from '../../components/common/Field'
import { SkeletonTable } from '../../components/common/Skeleton'
import { EmptyState } from '../../components/common/Feedback'

// `fetchFn(developerId, idValue)` — used for both the sprint and requirement
// lookups on the Developer dashboard, since they're the same shape of query.
export default function TaskLookupCard({ icon: Icon, title, idLabel, fetchFn }) {
  const { user } = useAuth()
  const [idValue, setIdValue] = useState('')
  const [tasks, setTasks] = useState(null)
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    if (!idValue.trim()) return
    setLoading(true)
    try {
      const { data } = await fetchFn(user.id, idValue.trim())
      setTasks(data)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not load your tasks'))
      setTasks(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(taskId, taskStatus) {
    const previous = tasks
    setTasks((list) => list.map((t) => (t.id === taskId ? { ...t, taskStatus } : t)))
    try {
      await updateTaskStatus(taskId, taskStatus)
      toast.success('Status updated')
    } catch (err) {
      setTasks(previous)
      toast.error(extractErrorMessage(err, 'Could not update status'))
    }
  }

  const columns = [
    { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span> },
    { key: 'title', header: 'Title' },
    { key: 'taskPriority', header: 'Priority', render: (r) => <Badge value={r.taskPriority} /> },
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
  ]

  const visibleTasks = statusFilter ? tasks?.filter((t) => t.taskStatus === statusFilter) : tasks

  return (
    <Panel>
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ember-500/10 text-ember-500">
          <Icon size={16} />
        </div>
        <p className="font-display text-sm font-semibold text-[var(--text)]">{title}</p>
      </div>

      <form onSubmit={handleSearch} className="mt-4 flex gap-2">
        <Field className="flex-1">
          <Input
            value={idValue}
            onChange={(e) => setIdValue(e.target.value)}
            placeholder={idLabel}
            inputMode="numeric"
          />
        </Field>
        <Button type="submit" size="sm" icon={Search} loading={loading}>
          Find
        </Button>
      </form>

      {loading ? (
        <div className="mt-4">
          <SkeletonTable rows={2} cols={4} />
        </div>
      ) : tasks && tasks.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No tasks assigned to you here" />
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="mt-4 space-y-2">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={TASK_STATUSES}
            placeholder="All statuses"
            className="max-w-[180px] !py-1.5 text-xs"
          />
          <DataTable columns={columns} rows={visibleTasks} />
        </div>
      ) : null}
    </Panel>
  )
}
