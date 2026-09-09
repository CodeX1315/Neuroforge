import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { UserPlus } from 'lucide-react'
import AuthLayout from './AuthLayout'
import { Field, Input } from '../../components/common/Field'
import Button from '../../components/common/Button'
import { useAuth, extractErrorMessage } from '../../context/AuthContext'

export default function UserSignup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', inviteCode: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(form)
      toast.success('Account created — sign in to continue')
      navigate('/login')
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not create your account'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Join a workspace"
      title="Create your account"
      subtitle="You'll need the invite code from your organization's admin."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" required>
          <Input required value={form.name} onChange={update('name')} placeholder="Jane Doe" />
        </Field>
        <Field label="Email" required>
          <Input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            placeholder="you@company.com"
          />
        </Field>
        <Field label="Password" required>
          <Input
            type="password"
            required
            value={form.password}
            onChange={update('password')}
            placeholder="••••••••"
          />
        </Field>
        <Field label="Invite code" required hint="Given to you by your workspace admin">
          <Input
            required
            value={form.inviteCode}
            onChange={update('inviteCode')}
            placeholder="ACM-4F92C1"
            className="font-mono"
          />
        </Field>

        {error && <p className="text-xs text-[#c4432e]">{error}</p>}

        <Button type="submit" icon={UserPlus} loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <div className="mt-6 space-y-1.5 text-xs text-[var(--text-muted)]">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-ember-500 hover:underline">
            Sign in
          </Link>
        </p>
        <p>
          Setting up a brand new workspace?{' '}
          <Link to="/register-workspace" className="font-medium text-ember-500 hover:underline">
            Start here
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
