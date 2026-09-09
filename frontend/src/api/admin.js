import { axiosClient } from './axiosClient'

// GET /admin/users
export function fetchAllUsers() {
  return axiosClient.get('/admin/users')
}

// PUT /admin/user/{id}/role
export function updateUserRole(id, role) {
  return axiosClient.put(`/admin/user/${id}/role`, { role })
}

// DELETE /admin/user/{id}/delete
export function deleteUserById(id) {
  return axiosClient.delete(`/admin/user/${id}/delete`)
}

// --- Organization-wide read-only overview (ADMIN only) ---
// One GET per resource type, org-scoped rather than project-scoped — these
// are what power the "Organization" section of the admin dashboard.
export function fetchAllProjectsOrgWide() {
  return axiosClient.get('/admin/projects')
}

export function fetchAllRequirementsOrgWide() {
  return axiosClient.get('/admin/requirements')
}

export function fetchAllSprintsOrgWide() {
  return axiosClient.get('/admin/sprints')
}

export function fetchAllTasksOrgWide() {
  return axiosClient.get('/admin/tasks')
}

export function fetchAllTestCasesOrgWide() {
  return axiosClient.get('/admin/testcases')
}

export function fetchAllBugsOrgWide() {
  return axiosClient.get('/admin/bugs')
}

export function fetchAllDocumentsOrgWide() {
  return axiosClient.get('/admin/documents')
}

export function fetchAllReportsOrgWide() {
  return axiosClient.get('/admin/reports')
}

export function fetchAllRepositoriesOrgWide() {
  return axiosClient.get('/admin/repos')
}

export function fetchAllReleasesOrgWide() {
  return axiosClient.get('/admin/releases')
}

export function fetchAllDeploymentsOrgWide() {
  return axiosClient.get('/admin/deployments')
}
