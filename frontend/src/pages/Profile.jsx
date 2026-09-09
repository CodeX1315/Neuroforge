import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { KeyRound, Trash2, Pencil } from 'lucide-react'
import { usePageTitle } from '../context/PageTitleContext'
import { useAuth, extractErrorMessage } from '../context/AuthContext'
import { updatePassword, deleteOwnAccount, updateUserDetails } from '../api/user'
import { humanizeEnum } from '../constants/enums'
import Panel from '../components/common/Panel'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Modal from '../components/common/Modal'
import { Field, Input } from '../components/common/Field'
import ConfirmDialog from '../components/common/ConfirmDialog'

export default function Profile() {
  usePageTitle('Profile')
  const { user, role, logout, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmedPassword: '',
  })
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: user?.username || '', email: user?.email || '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')

  const update = (key) => (e) => setPasswordForm((f) => ({ ...f, [key]: e.target.value }))
  const updateProfileField = (key) => (e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))

  function openEdit() {
    setProfileForm({ name: user?.username || '', email: user?.email || '' })
    setProfileError('')
    setEditOpen(true)
  }

  async function handleProfileSubmit(e) {
    e.preventDefault()
    setProfileError('')
    setSavingProfile(true)
    try {
      await updateUserDetails(profileForm)
      await refreshProfile()
      toast.success('Profile updated')
      setEditOpen(false)
    } catch (err) {
      setProfileError(extractErrorMessage(err, 'Could not update your profile'))
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setPasswordError('')
    setSavingPassword(true)
    try {
      await updatePassword(passwordForm)
      toast.success('Password updated')
      setPasswordForm({ oldPassword: '', newPassword: '', confirmedPassword: '' })
    } catch (err) {
      setPasswordError(extractErrorMessage(err, 'Could not update your password'))
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteOwnAccount()
      toast.success('Account deleted')
      logout()
      navigate('/login')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete your account'))
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <Panel>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-sm font-semibold text-[var(--text)]">Account details</p>
          <Button variant="secondary" size="sm" icon={Pencil} onClick={openEdit}>
            Edit
          </Button>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-[var(--text-muted)]">Name</dt>
            <dd className="font-medium text-[var(--text)]">{user?.username}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[var(--text-muted)]">Email</dt>
            <dd className="font-medium text-[var(--text)]">{user?.email}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[var(--text-muted)]">Organization</dt>
            <dd className="font-medium text-[var(--text)]">{user?.orgName}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[var(--text-muted)]">Role</dt>
            <dd>{role && role !== 'USER' ? <Badge value={role} label={humanizeEnum(role)} /> : <span className="text-xs text-[var(--text-muted)]">Not assigned yet</span>}</dd>
          </div>
        </dl>
      </Panel>

      <Panel>
        <p className="mb-4 font-display text-sm font-semibold text-[var(--text)]">Change password</p>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Field label="Current password" required>
            <Input
              type="password"
              required
              value={passwordForm.oldPassword}
              onChange={update('oldPassword')}
            />
          </Field>
          <Field label="New password" required>
            <Input
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={update('newPassword')}
            />
          </Field>
          <Field label="Confirm new password" required>
            <Input
              type="password"
              required
              value={passwordForm.confirmedPassword}
              onChange={update('confirmedPassword')}
            />
          </Field>
          {passwordError && <p className="text-xs text-[#c4432e]">{passwordError}</p>}
          <Button type="submit" icon={KeyRound} loading={savingPassword}>
            Update password
          </Button>
        </form>
      </Panel>

      <Panel className="border-[#c4432e]/30">
        <p className="mb-1 font-display text-sm font-semibold text-[var(--text)]">Danger zone</p>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Deleting your account is permanent and can't be undone.
        </p>
        <Button variant="danger" icon={Trash2} onClick={() => setConfirmDelete(true)}>
          Delete account
        </Button>
      </Panel>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile">
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <Field label="Name" required>
            <Input required value={profileForm.name} onChange={updateProfileField('name')} />
          </Field>
          <Field label="Email" required>
            <Input type="email" required value={profileForm.email} onChange={updateProfileField('email')} />
          </Field>
          {profileError && <p className="text-xs text-[#c4432e]">{profileError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={savingProfile}>
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
        title="Delete your account?"
        description="This permanently removes your account and cannot be undone."
        confirmLabel="Delete account"
      />
    </div>
  )
}
