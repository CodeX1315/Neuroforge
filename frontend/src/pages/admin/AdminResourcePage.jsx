import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { usePageTitle } from '../../context/PageTitleContext'
import { extractErrorMessage } from '../../context/AuthContext'
import { getResourceConfig } from '../../constants/adminResources'
import Panel from '../../components/common/Panel'
import DataTable from '../../components/common/DataTable'
import { SkeletonTable } from '../../components/common/Skeleton'
import { EmptyState, ErrorState } from '../../components/common/Feedback'

export default function AdminResourcePage() {
  const { resourceKey } = useParams()
  const resource = getResourceConfig(resourceKey)

  const [rows, setRows] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  usePageTitle(resource ? resource.label : 'Organization')

  useEffect(() => {
    if (!resource) return
    let cancelled = false
    setLoading(true)
    setError(false)
    resource
      .fetch()
      .then(({ data }) => {
        if (!cancelled) setRows(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(true)
          toast.error(extractErrorMessage(err, `Could not load ${resource.label.toLowerCase()}`))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceKey])

  // Unknown resource key in the URL — bounce back to the dashboard instead of
  // rendering a blank page.
  if (!resource) return <Navigate to="/" replace />

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-[var(--text)]">{resource.label}</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Every {resource.label.toLowerCase()} across the organization, read-only.
        </p>
      </div>

      <Panel padded={false}>
        {loading ? (
          <SkeletonTable rows={8} cols={resource.columns.length} />
        ) : error ? (
          <div className="p-5">
            <ErrorState description="Try refreshing the page." />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-5">
            <EmptyState title={`No ${resource.label.toLowerCase()} yet`} />
          </div>
        ) : (
          <DataTable columns={resource.columns} rows={rows} />
        )}
      </Panel>
    </div>
  )
}
