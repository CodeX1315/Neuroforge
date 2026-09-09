import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LogIn } from 'lucide-react'
import AuthLayout from './AuthLayout'
import { Field, Input } from '../../components/common/Field'
import Button from '../../components/common/Button'
import { useAuth, extractErrorMessage } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back')
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      setError(extractErrorMessage(err, 'Username or password is wrong'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Welcome back"
      subtitle="Enter your credentials to access your workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" required>
          <Input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            placeholder="you@company.com"
          />
        </Field>
        <Field label="Password" required>
          <Input
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={update('password')}
            placeholder="••••••••"
          />
        </Field>

        {error && <p className="text-xs text-[#c4432e]">{error}</p>}

        <Button type="submit" icon={LogIn} loading={loading} className="w-full">
          Sign in
        </Button>
      </form>

      <div className="mt-6 space-y-1.5 text-xs text-[var(--text-muted)]">
        <p>
          Joining a team with an invite code?{' '}
          <Link to="/signup" className="font-medium text-ember-500 hover:underline">
            Create your account
          </Link>
        </p>
        <p>
          Starting fresh?{' '}
          <Link to="/register-workspace" className="font-medium text-ember-500 hover:underline">
            Set up a new workspace
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
