// Central place for role-based UI rules, mirroring the @PreAuthorize checks
// on the backend controllers as of the latest backend. Keep this in sync if
// backend roles change — see README.md for the full authorization matrix.

// Only PROJECT_MANAGER can list/view/create projects. ADMIN can technically
// call GET /project/all-projects (it's in that endpoint's @PreAuthorize), but
// the query behind it filters to "projects where I am the project manager,"
// so an admin who isn't literally a PM on anything gets an empty list — and
// GET /project/project/{id} (viewing one project) doesn't allow ADMIN at all.
// Practically, Projects is a PROJECT_MANAGER-only section today.
export function canListProjects(role) {
  return role === 'PROJECT_MANAGER'
}

export function isAdmin(role) {
  return role === 'ADMIN'
}

// A signed-up user starts with role "USER" until an admin assigns a real
// role (AuthenticationService.registerUser hardcodes Role.USER). Treat that,
// and a missing role, the same way: nothing is usable yet.
export function isPendingRole(role) {
  return !role || role === 'USER'
}

// Tabs shown inside a project workspace, gated by role.
//
// "Overview" needs GET /project/project/{id}, which only PROJECT_MANAGER can
// call — not even ADMIN. So for every other role, ProjectWorkspace never
// gets real project details and falls back to a minimal header; Overview
// (which also does edit/status/delete, all PROJECT_MANAGER-only anyway)
// only makes sense to show them.
//
// Tasks are folded into the Sprints tab (SprintController and the task-by-
// sprint endpoint are both PROJECT_MANAGER-only), and Bugs are folded into
// Test cases (TestCaseController and BugController are both QA_ENGINEER-only).
//
// NOTE — known backend bug: DeploymentController, ReleaseController and
// RepositoryController check for authority 'BA' in @PreAuthorize, but the
// Role enum value (and the authority CustomUserDetailService actually grants)
// is 'BUSINESS_ANALYST'. Until that's fixed, a Business Analyst will get a
// 403 on Repositories and Releases & Deployments even though they're listed
// below — this list reflects the intended access, not the current bug.
export function visibleProjectTabs(role) {
  const all = [
    { key: 'overview', label: 'Overview', roles: ['PROJECT_MANAGER'] },
    { key: 'requirements', label: 'Requirements', roles: ['BUSINESS_ANALYST'] },
    { key: 'sprints', label: 'Sprints & tasks', roles: ['PROJECT_MANAGER'] },
    { key: 'testcases', label: 'Test cases & bugs', roles: ['QA_ENGINEER'] },
    { key: 'documents', label: 'Documents', roles: null },
    { key: 'reports', label: 'Reports', roles: null },
    {
      key: 'repositories',
      label: 'Repositories',
      roles: ['ADMIN', 'PROJECT_MANAGER', 'BUSINESS_ANALYST', 'DEVELOPER', 'DEVOPS_ENGINEER'],
    },
    {
      key: 'releases',
      label: 'Releases & deployments',
      roles: ['ADMIN', 'PROJECT_MANAGER', 'BUSINESS_ANALYST', 'DEVELOPER', 'DEVOPS_ENGINEER'],
    },
  ]

  if (!role) return all
  return all.filter((tab) => !tab.roles || tab.roles.includes(role))
}
