import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { useAuth, extractErrorMessage } from '../../../context/AuthContext'
import {
  fetchDeploymentsByRelease,
  createDeployment,
  updateDeploymentStatus,
  deleteDeployment,
} from '../../../api/deployment'
import { ENVIRONMENTS, DEPLOYMENT_STATUSES } from '../../../constants/enums'
import DataTable from '../../../components/common/DataTable'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import { Field, Select } from '../../../components/common/Field'
import { Spinner, EmptyState, ErrorState } from '../../../components/common/Feedback'
import { SkeletonTable } from '../../../components/common/Skeleton'

export default function DeploymentsPanel({ release }) {
  const { user } = useAuth()
  const [deployments, setDeployments] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [environment, setEnvironment] = useState('DEVELOPMENT')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  async function load() {
    setLoading(true)
    setError(false)
    try {
      const { data } = await fetchDeploymentsByRelease(release.id)
      setDeployments(data)
    } catch (err) {
      setError(true)
      toast.error(extractErrorMessage(err, 'Could not load deployments'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [release.id])

  function openCreate() {
    setEnvironment('DEVELOPMENT')
    setFormError('')
    setCreateOpen(true)
  }

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await createDeployment({ releaseId: release.id, devopsEngineerId: user.id, environment })
      toast.success('Deployment started')
      setCreateOpen(false)
      load()
    } catch (err) {
      setFormError(extractErrorMessage(err, 'Could not create the deployment'))
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(id, deploymentStatus) {
    const previous = deployments
    setDeployments((list) => list.map((d) => (d.id === id ? { ...d, deploymentStatus } : d)))
    try {
      await updateDeploymentStatus(id, deploymentStatus)
    } catch (err) {
      setDeployments(previous)
      toast.error(extractErrorMessage(err, 'Could not update status'))
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await deleteDeployment(id)
      toast.success('Deployment deleted')
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete deployment'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-muted)]">
          {deployments?.length ?? 0} deployment(s) for this release
        </p>
        <Button size="sm" icon={Plus} onClick={openCreate}>
          New deployment
        </Button>
      </div>

      {loading ? (
        <SkeletonTable rows={3} cols={3} />
      ) : error ? (
        <ErrorState description="Try refreshing." />
      ) : deployments.length === 0 ? (
        <EmptyState title="No deployments for this release yet" />
      ) : (
        <DataTable
          columns={[
            { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span> },
            { key: 'environment', header: 'Environment' },
            { key: 'deployAt', header: 'Deployed' },
            {
              key: 'deploymentStatus',
              header: 'Status',
              render: (r) => (
                <Select
                  value={r.deploymentStatus}
                  options={DEPLOYMENT_STATUSES}
                  onChange={(e) => handleStatusChange(r.id, e.target.value)}
                  className="!py-1.5 text-xs"
                />
              ),
            },
          ]}
          rows={deployments}
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

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New deployment">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Environment" required>
            <Select
              required
              options={ENVIRONMENTS}
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
            />
          </Field>
          <p className="text-xs text-[var(--text-muted)]">
            You'll be recorded as the DevOps engineer running this deployment.
          </p>
          {formError && <p className="text-xs text-[#c4432e]">{formError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Start deployment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
