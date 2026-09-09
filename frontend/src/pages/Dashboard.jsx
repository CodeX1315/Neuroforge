import { usePageTitle } from '../context/PageTitleContext'
import { useAuth } from '../context/AuthContext'
import { isPendingRole } from '../constants/access'

import AdminDashboard from './dashboard/AdminDashboard'
import ProjectManagerDashboard from './dashboard/ProjectManagerDashboard'
import BusinessAnalystDashboard from './dashboard/BusinessAnalystDashboard'
import DeveloperDashboard from './dashboard/DeveloperDashboard'
import QaDashboard from './dashboard/QaDashboard'
import DevOpsDashboard from './dashboard/DevOpsDashboard'
import PendingRoleDashboard from './dashboard/PendingRoleDashboard'

const DASHBOARDS = {
  ADMIN: AdminDashboard,
  PROJECT_MANAGER: ProjectManagerDashboard,
  BUSINESS_ANALYST: BusinessAnalystDashboard,
  DEVELOPER: DeveloperDashboard,
  QA_ENGINEER: QaDashboard,
  DEVOPS_ENGINEER: DevOpsDashboard,
}

export default function Dashboard() {
  usePageTitle('Dashboard')
  const { role } = useAuth()

  if (isPendingRole(role)) return <PendingRoleDashboard />

  // Keyed by role string rather than a big if/else, so adding a new role
  // later is a one-line addition to the DASHBOARDS map above.
  const RoleDashboard = DASHBOARDS[role] || PendingRoleDashboard
  return <RoleDashboard />
}
