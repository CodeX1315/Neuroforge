import { useState } from 'react'
import toast from 'react-hot-toast'
import { Search, Plus, Pencil, Trash2, Bug as BugIcon, X } from 'lucide-react'
import { extractErrorMessage } from '../../../context/AuthContext'
import { fetchTaskById } from '../../../api/task'
import {
  fetchTestCasesOfTask,
  createTestCase,
  updateTestCaseStatus,
  updateTestCaseStepAndResult,
  deleteTestCase,
} from '../../../api/testcase'
import { TEST_CASE_STATUSES } from '../../../constants/enums'
import Panel from '../../../components/common/Panel'
import DataTable from '../../../components/common/DataTable'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import { Field, Input, Textarea, Select } from '../../../components/common/Field'
import { Spinner, EmptyState, ErrorState } from '../../../components/common/Feedback'
import { SkeletonTable } from '../../../components/common/Skeleton'
import BugsPanel from './BugsPanel'

const emptyForm = { title: '', steps: '', expectedResult: '', testCaseStatus: 'DRAFT' }

export default function TestCasesTab() {
  const [taskIdInput, setTaskIdInput] = useState('')
  const [taskId, setTaskId] = useState(null)
  const [task, setTask] = useState(null)
  const [taskError, setTaskError] = useState(false)
  const [testCases, setTestCases] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [activeCase, setActiveCase] = useState(null)

  async function load(id) {
    setLoading(true)
    setError(false)
    setTaskError(false)
    try {
      const [taskRes, testCasesRes] = await Promise.all([fetchTaskById(id), fetchTestCasesOfTask(id)])
      setTask(taskRes.data)
      setTestCases(testCasesRes.data)
    } catch (err) {
      // If the task itself couldn't be found/accessed, say so specifically —
      // that's a different problem than "test cases failed to load".
      if (err.config?.url?.includes('/task/get/')) {
        setTaskError(true)
        toast.error(extractErrorMessage(err, "Couldn't find that task"))
      } else {
        setError(true)
        toast.error(extractErrorMessage(err, 'Could not load test cases'))
      }
    } finally {
      setLoading(false)
    }
  }

  function handleLookup(e) {
    e.preventDefault()
    const id = taskIdInput.trim()
    if (!id) return
    setTaskId(id)
    setTask(null)
    setActiveCase(null)
    load(id)
  }

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function openCreate() {
    setForm(emptyForm)
    setFormError('')
    setCreateOpen(true)
  }

  function openEdit(row) {
    setEditing(row)
    setForm({ steps: row.steps, expectedResult: row.expectedResult })
    setFormError('')
  }

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await createTestCase({ ...form, taskId: Number(taskId) })
      toast.success('Test case created')
      setCreateOpen(false)
      load(taskId)
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not create the test case'))
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await updateTestCaseStepAndResult(editing.id, Number(taskId), form.steps, form.expectedResult)
      toast.success('Test case updated')
      setEditing(null)
      load(taskId)
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not update the test case'))
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(id, testCaseStatus) {
    const previous = testCases
    setTestCases((list) => list.map((t) => (t.id === id ? { ...t, testCaseStatus } : t)))
    try {
      await updateTestCaseStatus(id, Number(taskId), testCaseStatus)
    } catch (err) {
      setTestCases(previous)
      toast.error(extractErrorMessage(err, 'Could not update status'))
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteTestCase(pendingDelete.id, Number(taskId))
      toast.success('Test case deleted')
      if (activeCase?.id === pendingDelete.id) setActiveCase(null)
      setPendingDelete(null)
      load(taskId)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete test case'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Panel>
        <p className="mb-1 text-sm font-medium text-[var(--text)]">Look up a task</p>
        <p className="mb-3 text-xs text-[var(--text-muted)]">
          Get the task ID from your project manager, then look it up here to see what you're
          testing before writing test cases.
        </p>
        <form onSubmit={handleLookup} className="flex gap-2">
          <Input
            value={taskIdInput}
            onChange={(e) => setTaskIdInput(e.target.value)}
            placeholder="Task ID, e.g. 12"
            type="number"
            className="max-w-[200px]"
          />
          <Button type="submit" size="sm" icon={Search} loading={loading}>
            Find task
          </Button>
        </form>
      </Panel>

      {taskId && taskError && (
        <ErrorState
          title="Couldn't find that task"
          description="Double-check the task ID with your project manager, or make sure you have access to it."
        />
      )}

      {task && (
        <Panel>
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="font-display text-sm font-semibold text-[var(--text)]">{task.title}</p>
            <span className="font-mono text-xs text-[var(--text-muted)]">#{task.id}</span>
            <Badge value={task.taskPriority} />
            <Badge value={task.taskStatus} />
          </div>
          {task.description && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">{task.description}</p>
          )}
          {task.estimatedHours != null && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Estimated: <span className="font-mono text-[var(--text)]">{task.estimatedHours}h</span>
            </p>
          )}
        </Panel>
      )}

      {taskId && !taskError && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--text)]">Test cases</p>
            <Button size="sm" icon={Plus} onClick={openCreate}>
              New test case
            </Button>
          </div>

          <Panel padded={false}>
            {loading ? (
              <SkeletonTable rows={3} cols={2} />
            ) : error ? (
              <div className="p-5">
                <ErrorState description="Try a different task ID, or check your access." />
              </div>
            ) : testCases.length === 0 ? (
              <div className="p-5">
                <EmptyState title="No test cases for this task yet" />
              </div>
            ) : (
              <DataTable
                onRowClick={(row) => setActiveCase(row)}
                columns={[
                  { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span> },
                  { key: 'title', header: 'Title' },
                  {
                    key: 'testCaseStatus',
                    header: 'Status',
                    render: (r) => (
                      <Select
                        value={r.testCaseStatus}
                        options={TEST_CASE_STATUSES}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        className="!py-1.5 text-xs"
                      />
                    ),
                  },
                ]}
                rows={testCases}
                actions={(row) => (
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => setActiveCase(row)}
                      className="focus-ring rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-sunken)] hover:text-[var(--text)]"
                      title="View bugs"
                    >
                      <BugIcon size={14} />
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

          {activeCase && (
            <Panel padded={false} className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-sunken)] px-4 py-3">
                <p className="text-sm font-medium text-[var(--text)]">
                  Bugs on <span className="text-ember-500">{activeCase.title}</span>
                </p>
                <button
                  onClick={() => setActiveCase(null)}
                  className="focus-ring rounded-md p-1 text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="p-4">
                <BugsPanel testCase={activeCase} taskId={taskId} />
              </div>
            </Panel>
          )}
        </>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New test case">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Title" required>
            <Input required value={form.title} onChange={update('title')} />
          </Field>
          <Field label="Steps" required>
            <Textarea required value={form.steps} onChange={update('steps')} />
          </Field>
          <Field label="Expected result" required>
            <Textarea required value={form.expectedResult} onChange={update('expectedResult')} />
          </Field>
          <Field label="Status" required>
            <Select
              required
              options={TEST_CASE_STATUSES}
              value={form.testCaseStatus}
              onChange={update('testCaseStatus')}
            />
          </Field>
          {formError && <p className="text-xs text-[#c4432e]">{formError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create test case
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit steps & expected result">
        <form onSubmit={handleEdit} className="space-y-4">
          <Field label="Steps" required>
            <Textarea required value={form.steps} onChange={update('steps')} />
          </Field>
          <Field label="Expected result" required>
            <Textarea required value={form.expectedResult} onChange={update('expectedResult')} />
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
        title="Delete this test case?"
        confirmLabel="Delete test case"
      />
    </div>
  )
}
