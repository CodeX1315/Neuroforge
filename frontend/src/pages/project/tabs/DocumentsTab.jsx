import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, FileText } from 'lucide-react'
import { extractErrorMessage } from '../../../context/AuthContext'
import {
  fetchDocumentsByProjectAndType,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../../../api/document'
import { DOCUMENT_TYPES, humanizeEnum } from '../../../constants/enums'
import Panel from '../../../components/common/Panel'
import DataTable from '../../../components/common/DataTable'
import Badge from '../../../components/common/Badge'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import ConfirmDialog from '../../../components/common/ConfirmDialog'
import { Field, Input, Textarea, Select } from '../../../components/common/Field'
import { Spinner, EmptyState, ErrorState } from '../../../components/common/Feedback'
import { SkeletonTable } from '../../../components/common/Skeleton'

const emptyForm = { title: '', documentType: 'SRS', data: '' }

export default function DocumentsTab({ project }) {
  const [typeFilter, setTypeFilter] = useState('SRS')
  const [documents, setDocuments] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load(type) {
    setLoading(true)
    setError(false)
    try {
      const { data } = await fetchDocumentsByProjectAndType(project.id, type)
      setDocuments(data)
    } catch (err) {
      setError(true)
      toast.error(extractErrorMessage(err, 'Could not load documents'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(typeFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id, typeFilter])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function openCreate() {
    setForm({ ...emptyForm, documentType: typeFilter })
    setFormError('')
    setCreateOpen(true)
  }

  function openEdit(row) {
    setEditing(row)
    setForm({ data: row.data })
    setFormError('')
  }

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await createDocument({ ...form, projectId: project.id })
      toast.success('Document created')
      setCreateOpen(false)
      load(typeFilter)
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not create the document'))
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await updateDocument(editing.id, form.data)
      toast.success('Document updated')
      setEditing(null)
      load(typeFilter)
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not update the document'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteDocument(pendingDelete.id)
      toast.success('Document deleted')
      setPendingDelete(null)
      load(typeFilter)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete document'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          value={typeFilter}
          options={DOCUMENT_TYPES}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="max-w-[220px]"
        />
        <Button size="sm" icon={Plus} onClick={openCreate}>
          New document
        </Button>
      </div>

      <Panel padded={false}>
        {loading ? (
          <SkeletonTable rows={5} cols={2} />
        ) : error ? (
          <div className="p-5">
            <ErrorState description="Try refreshing the page." />
          </div>
        ) : documents.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title={`No ${humanizeEnum(typeFilter).toLowerCase()} documents yet`}
              action={
                <Button size="sm" icon={Plus} onClick={openCreate}>
                  New document
                </Button>
              }
            />
          </div>
        ) : (
          <DataTable
            columns={[
              { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span> },
              {
                key: 'title',
                header: 'Title',
                render: (r) => (
                  <span className="flex items-center gap-2">
                    <FileText size={14} className="text-[var(--text-muted)]" />
                    {r.title}
                  </span>
                ),
              },
              { key: 'documentType', header: 'Type', render: (r) => <Badge value={r.documentType} /> },
            ]}
            rows={documents}
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

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New document">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Title" required>
            <Input required value={form.title} onChange={update('title')} />
          </Field>
          <Field label="Type" required>
            <Select required options={DOCUMENT_TYPES} value={form.documentType} onChange={update('documentType')} />
          </Field>
          <Field label="Content" required>
            <Textarea rows={6} required value={form.data} onChange={update('data')} />
          </Field>
          {formError && <p className="text-xs text-[#c4432e]">{formError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create document
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit document">
        <form onSubmit={handleEdit} className="space-y-4">
          <Field label="Content" required>
            <Textarea rows={6} required value={form.data} onChange={update('data')} />
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
        title="Delete this document?"
        confirmLabel="Delete document"
      />
    </div>
  )
}
