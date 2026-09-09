# NeuroForge frontend

A React + Vite frontend for the NeuroForge Spring Boot backend. Covers auth (JWT),
projects, requirements, sprints, tasks, test cases, bugs, documents, reports,
repositories, releases and deployments — organized as role-specific dashboards
plus a single project workspace with tabs, so you don't jump between separate
pages for each SDLC tool.

## Stack

- React 18 + Vite
- Tailwind CSS (light/dark mode via a `dark` class + CSS variables)
- react-router-dom v6
- axios (JWT attached via interceptor)
- react-hot-toast (toast notifications)
- lucide-react (icons)

## Getting started

```bash
npm install
npm run dev
```

The app runs on **http://localhost:3000** — this matches the backend's CORS config
(`SecurityConfig.corsConfigurationSource`), which currently only allows that origin.
If you change the frontend's port, update `allowedOrigins` in the backend too.

Copy `.env.example` to `.env` (already done) and point `VITE_API_BASE_URL` at your
backend if it's not on `http://localhost:8080`.

## Project structure

```
src/
  api/            One file per backend controller — every request the UI makes
  components/
    common/       Reusable UI: Button, Field/Input/Select/Textarea, Panel, Badge,
                  Modal, ConfirmDialog, DataTable, Skeleton, Spinner/EmptyState/ErrorState
    layout/       Sidebar, Navbar, AppLayout, MobileSidebar, RouteGuards
  constants/      enums.js (mirrors backend enums), access.js (role-based UI rules
                  — the authoritative map of what each @PreAuthorize allows)
  context/        AuthContext (JWT/session), ThemeContext (light/dark), PageTitleContext
  hooks/          useRecentProjects — remembers recently opened project IDs in
                  localStorage, since most roles have no project-listing endpoint
  pages/
    auth/         Login, WorkspaceRegister (new org), UserSignup (join via invite code)
    admin/        AdminUsers — role assignment, user removal
    dashboard/    One dashboard per role (AdminDashboard, ProjectManagerDashboard,
                  BusinessAnalystDashboard, DeveloperDashboard, QaDashboard,
                  DevOpsDashboard, PendingRoleDashboard), routed by Dashboard.jsx
    project/
      ProjectsList.jsx       project list + create (PROJECT_MANAGER only)
      ProjectWorkspace.jsx   tab shell for a single project
      tabs/                  one file per tab (Overview, Requirements, Sprints & tasks,
                              Test cases & bugs, Documents, Reports, Repositories,
                              Releases & deployments), plus nested panels
                              (TasksPanel, BugsPanel, DeploymentsPanel) for resources
                              that only load through a parent ID
```


