import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { extractErrorMessage } from '../../../context/AuthContext'
import { fetchAllBugsOfTestCase, createBug, updateBugStatus, updateBugSeverity, deleteBug } from '../../../api/bug'
import { BUG_SEVERITIES, BUG_STATUSES } from '../../../constants/enums'
import DataTable from '../../../components/common/DataTable'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import { Field, Input, Textarea, Select } from '../../../components/common/Field'
import { Spinner, EmptyState, ErrorState } from '../../../components/common/Feedback'
import { SkeletonTable } from '../../../components/common/Skeleton'

const emptyForm = { title: '', description: '', bugSeverity: 'MEDIUM', bugStatus: 'NEW' }

export default function BugsPanel({ testCase, taskId }) {
  const [bugs, setBugs] = useState(null)
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
      const { data } = await fetchAllBugsOfTestCase(testCase.id)
      setBugs(data)
    } catch (err) {
      setError(true)
      toast.error(extractErrorMessage(err, 'Could not load bugs'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testCase.id])

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
      await createBug({ ...form, testCaseId: testCase.id, taskId: Number(taskId) })
      toast.success('Bug logged')
      setCreateOpen(false)
      load()
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not log the bug'))
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(id, bugStatus) {
    const previous = bugs
    setBugs((list) => list.map((b) => (b.id === id ? { ...b, bugStatus } : b)))
    try {
      await updateBugStatus(id, bugStatus)
    } catch (err) {
      setBugs(previous)
      toast.error(extractErrorMessage(err, 'Could not update status'))
    }
  }

  async function handleSeverityChange(id, bugSeverity) {
    const previous = bugs
    setBugs((list) => list.map((b) => (b.id === id ? { ...b, bugSeverity } : b)))
    try {
      await updateBugSeverity(id, bugSeverity)
    } catch (err) {
      setBugs(previous)
      toast.error(extractErrorMessage(err, 'Could not update severity'))
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await deleteBug(id)
      toast.success('Bug deleted')
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete bug'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-muted)]">{bugs?.length ?? 0} bug(s) on this test case</p>
        <Button size="sm" icon={Plus} onClick={openCreate}>
          Log bug
        </Button>
      </div>

      {loading ? (
        <SkeletonTable rows={3} cols={3} />
      ) : error ? (
        <ErrorState description="Try refreshing." />
      ) : bugs.length === 0 ? (
        <EmptyState title="No bugs logged for this test case" />
      ) : (
        <DataTable
          columns={[
            { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span> },
            { key: 'title', header: 'Title' },
            {
              key: 'bugSeverity',
              header: 'Severity',
              render: (r) => (
                <Select
                  value={r.bugSeverity}
                  options={BUG_SEVERITIES}
                  onChange={(e) => handleSeverityChange(r.id, e.target.value)}
                  className="!py-1.5 text-xs"
                />
              ),
            },
            {
              key: 'bugStatus',
              header: 'Status',
              render: (r) => (
                <Select
                  value={r.bugStatus}
                  options={BUG_STATUSES}
                  onChange={(e) => handleStatusChange(r.id, e.target.value)}
                  className="!py-1.5 text-xs"
                />
              ),
            },
          ]}
          rows={bugs}
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

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Log a bug">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Title" required>
            <Input required value={form.title} onChange={update('title')} />
          </Field>
          <Field label="Description" required>
            <Textarea required value={form.description} onChange={update('description')} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Severity" required>
              <Select
                required
                options={BUG_SEVERITIES}
                value={form.bugSeverity}
                onChange={update('bugSeverity')}
              />
            </Field>
            <Field label="Status" required>
              <Select
                required
                options={BUG_STATUSES}
                value={form.bugStatus}
                onChange={update('bugStatus')}
              />
            </Field>
          </div>
          {formError && <p className="text-xs text-[#c4432e]">{formError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Log bug
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
