import { Routes, Route, Navigate } from 'react-router-dom'
import { RequireAuth, RequireGuest, RequireRole } from './components/layout/RouteGuards'
import AppLayout from './components/layout/AppLayout'

import Login from './pages/auth/Login'
import WorkspaceRegister from './pages/auth/WorkspaceRegister'
import UserSignup from './pages/auth/UserSignup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import AdminUsers from './pages/admin/AdminUsers'
import AdminResourcePage from './pages/admin/AdminResourcePage'
import ProjectsList from './pages/project/ProjectsList'
import ProjectWorkspace from './pages/project/ProjectWorkspace'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<RequireGuest />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register-workspace" element={<WorkspaceRegister />} />
        <Route path="/signup" element={<UserSignup />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/:projectId" element={<ProjectWorkspace />} />
          <Route
            path="/admin/users"
            element={
              <RequireRole roles={['ADMIN']}>
                <AdminUsers />
              </RequireRole>
            }
          />
          <Route
            path="/admin/organization/:resourceKey"
            element={
              <RequireRole roles={['ADMIN']}>
                <AdminResourcePage />
              </RequireRole>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
