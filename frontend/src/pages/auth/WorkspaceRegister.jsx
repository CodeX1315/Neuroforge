import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Sparkles, Copy, Check } from 'lucide-react'
import AuthLayout from './AuthLayout'
import { Field, Input } from '../../components/common/Field'
import Button from '../../components/common/Button'
import { useAuth, extractErrorMessage } from '../../context/AuthContext'

export default function WorkspaceRegister() {
  const { createWorkspace } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    organizationName: '',
    adminName: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await createWorkspace(form)
      setResult(data)
      toast.success('Workspace created')
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not create the workspace'))
    } finally {
      setLoading(false)
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(result.inviteCode)
    setCopied(true)
    toast.success('Invite code copied')
    setTimeout(() => setCopied(false), 1500)
  }

  if (result) {
    return (
      <AuthLayout
        eyebrow="Workspace created"
        title={`${result.organizationName} is ready`}
        subtitle="Share this invite code with your team so they can join."
      >
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-sunken)] p-4">
          <p className="mb-1.5 text-xs text-[var(--text-muted)]">Invite code</p>
          <div className="flex items-center justify-between gap-2">
            <code className="font-mono text-lg font-medium text-ember-500">{result.inviteCode}</code>
            <button
              onClick={copyCode}
              className="focus-ring rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-raised)] hover:text-[var(--text)]"
              aria-label="Copy invite code"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
        </div>
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          New teammates will need this code, plus an admin will need to assign them a role from
          the Team &amp; roles page once they sign up — new accounts start without a role.
        </p>
        <Button className="mt-6 w-full" onClick={() => navigate('/login')}>
          Continue to sign in
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      eyebrow="New workspace"
      title="Set up your workspace"
      subtitle="This creates your organization and its first admin account."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Organization name" required>
          <Input
            required
            value={form.organizationName}
            onChange={update('organizationName')}
            placeholder="Acme Inc."
          />
        </Field>
        <Field label="Your name" required>
          <Input required value={form.adminName} onChange={update('adminName')} placeholder="Jane Doe" />
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

        {error && <p className="text-xs text-[#c4432e]">{error}</p>}

        <Button type="submit" icon={Sparkles} loading={loading} className="w-full">
          Create workspace
        </Button>
      </form>

      <p className="mt-6 text-xs text-[var(--text-muted)]">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-ember-500 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
