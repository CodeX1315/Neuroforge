import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'
import { usePageTitle } from '../../context/PageTitleContext'
import { extractErrorMessage } from '../../context/AuthContext'
import { fetchAllUsers, updateUserRole, deleteUserById } from '../../api/admin'
import { ROLES, humanizeEnum } from '../../constants/enums'
import Panel from '../../components/common/Panel'
import DataTable from '../../components/common/DataTable'
import Badge from '../../components/common/Badge'
import { Select } from '../../components/common/Field'
import { Spinner, EmptyState, ErrorState } from '../../components/common/Feedback'
import { SkeletonTable } from '../../components/common/Skeleton'
import ConfirmDialog from '../../components/common/ConfirmDialog'

export default function AdminUsers() {
  usePageTitle('Team & roles')
  const [users, setUsers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    setError(false)
    try {
      const { data } = await fetchAllUsers()
      setUsers(data)
    } catch (err) {
      setError(true)
      toast.error(extractErrorMessage(err, 'Could not load users'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleRoleChange(id, role) {
    const previous = users
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, role } : u)))
    try {
      await updateUserRole(id, role)
      toast.success('Role updated')
    } catch (err) {
      setUsers(previous)
      toast.error(extractErrorMessage(err, 'Could not update role'))
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteUserById(pendingDelete.id)
      setUsers((list) => list.filter((u) => u.id !== pendingDelete.id))
      toast.success('User removed')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete user'))
    } finally {
      setDeleting(false)
      setPendingDelete(null)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-semibold text-[var(--text)]">Team &amp; roles</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Everyone who signs up with your invite code lands here with no role until you assign
          one.
        </p>
      </div>

      <Panel padded={false}>
        {loading ? (
          <SkeletonTable rows={5} cols={3} />
        ) : error ? (
          <div className="p-5">
            <ErrorState description="Try refreshing the page." />
          </div>
        ) : users.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No teammates yet" description="Share your invite code to get started." />
          </div>
        ) : (
          <DataTable
            columns={[
              { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span> },
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              {
                key: 'role',
                header: 'Role',
                render: (row) => (
                  <Select
                    value={row.role || ''}
                    options={ROLES}
                    onChange={(e) => handleRoleChange(row.id, e.target.value)}
                    className="!py-1.5 text-xs"
                  />
                ),
              },
            ]}
            rows={users}
            actions={(row) => (
              <button
                onClick={() => setPendingDelete(row)}
                className="focus-ring rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[#c4432e]/10 hover:text-[#c4432e]"
                aria-label="Remove user"
              >
                <Trash2 size={15} />
              </button>
            )}
          />
        )}
      </Panel>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove this user?"
        description={
          pendingDelete
            ? `${pendingDelete.name} will lose access to ${pendingDelete.role ? humanizeEnum(pendingDelete.role) + ' ' : ''}this workspace immediately.`
            : ''
        }
        confirmLabel="Remove user"
      />
    </div>
  )
}
