import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner } from '../common/Feedback'

export function RequireAuth() {
  const { isAuthenticated, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg)]">
        <Spinner label="Loading NeuroForge" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export function RequireGuest() {
  const { isAuthenticated, initializing } = useAuth()
  if (initializing) return null
  if (isAuthenticated) return <Navigate to="/" replace />
  return <Outlet />
}

// Wrap a page element: <RequireRole roles={['ADMIN']}><AdminUsers /></RequireRole>
// If the backend hasn't started returning `role` yet, we let the request
// through and rely on the API's own 403 handling instead of blocking here.
export function RequireRole({ roles, children }) {
  const { role } = useAuth()
  if (role && !roles.includes(role)) {
    return <Navigate to="/" replace />
  }
  return children
}
