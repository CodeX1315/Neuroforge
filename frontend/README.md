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

## How @PreAuthorize maps to the frontend

`@PreAuthorize` on the backend is the actual security boundary — Spring Security
checks the JWT's authority against it before your controller method ever runs, no
matter what the frontend does. `constants/access.js` is a hand-maintained mirror of
those checks, used only to decide what to *render* (nav links, tabs, buttons) so
people don't see options that would just 403. If you add or change a
`@PreAuthorize` on the backend, update `access.js` to match — there's no automatic
link between the two, but a mismatch is a UX bug (a confusing 403 toast), not a
security hole, since the backend enforces the real rule either way.

`CustomUserDetailService` grants the authority as `user.getRole().name()` — the
exact `Role` enum value (`PROJECT_MANAGER`, `BUSINESS_ANALYST`, etc.) — so every
`hasAuthority(...)`/`hasAnyAuthority(...)` string must match an enum name exactly.
See the bug noted below (`'BA'` vs `'BUSINESS_ANALYST'`) for what happens when it doesn't.

## How auth works here

1. `POST /auth/login` returns a raw JWT string. It's stored in `localStorage` under
   `nf-token` and attached to every request as `Authorization: Bearer <token>`.
2. After login, `GET /user/profile` loads the user's name/email/org/**role**.
3. `constants/access.js` uses that role to route to the right dashboard
   (`pages/Dashboard.jsx`) and to gate project-workspace tabs.
4. New signups get `Role.USER` by default (`AuthenticationService.registerUser`)
   and land on `PendingRoleDashboard` until an admin assigns a real role from
   Team & roles.
5. Tokens expire after **10 minutes** with no refresh endpoint. When a request
   comes back 401, the app clears the session and redirects to `/login` with a
   toast.

## Current backend gaps/bugs (as of the version I read)

1. **`'BA'` vs `'BUSINESS_ANALYST'` authority mismatch.** `DeploymentController`,
   `ReleaseController`, and `RepositoryController` all check
   `hasAnyAuthority(..., 'BA', ...)`, but the real granted authority for a business
   analyst is `'BUSINESS_ANALYST'` (the `Role` enum name). Until this is fixed,
   Business Analysts get a 403 on Repositories, Releases & Deployments — the
   frontend's `access.js` reflects the *intended* access (with a comment explaining
   this), so once you fix the backend, the frontend needs no changes.
2. **`GET /project/project/{id}` is `PROJECT_MANAGER`-only — not even `ADMIN`.**
   Meanwhile `GET /project/all-projects` allows both `PROJECT_MANAGER` and `ADMIN`,
   but its query filters to "projects where I am the project manager," so an admin
   who isn't literally a project's PM sees an empty list either way. Net effect:
   **Admin accounts can't meaningfully use the Projects section.** `AdminDashboard`
   is built around this reality (team management, not projects) rather than
   pretending otherwise, and `ProjectWorkspace.jsx` falls back to a minimal
   "Project #id" header (no title/description/status) for every role that can't
   call the restricted endpoint, so the tabs they *do* have access to still work.
3. **10-minute JWT expiry, no refresh endpoint.** Worth adding refresh tokens or
   raising the expiry — as-is, active users get logged out often.
4. **`BugController.deleteBug`** has no `@PreAuthorize`, unlike every other bug
   endpoint (all `QA_ENGINEER`-only). Any authenticated user can currently delete
   a bug report. Probably an oversight.
5. **No "my tasks" endpoint for developers.** `TaskController` is entirely
   `PROJECT_MANAGER`-only (plus `ADMIN` on `getTaskById`). A developer has no way
   to query which tasks are assigned to them — `DeveloperDashboard` says this
   explicitly rather than showing an empty list that looks broken.
6. **No task directory for QA.** Test cases only load per task ID
   (`GET /testcase/get/testcase/task/{taskId}`), and there's no endpoint listing
   tasks ready for testing. `TestCasesTab` requires typing in a task ID someone
   gave you — again, that's a backend gap being surfaced honestly, not a UI
   shortcut. `useRecentProjects` at least remembers project IDs across visits so
   people aren't retyping those.
7. **Accounts hold exactly one role**, so an admin who also needs to run a project
   would need a second, separate `PROJECT_MANAGER` account — there's no
   multi-role support.

## Notes on the UI

- **Dashboards are role-specific**, not a single generic page — see `pages/dashboard/`.
  Each one only shows what that role's backend permissions actually support;
  where the backend has a real gap (developer task list, QA task directory), the
  dashboard says so in plain language instead of rendering something broken.
- **Roles gate navigation and actions, not just tabs.** Beyond hiding whole tabs,
  `RepositoriesTab` and `ReleasesTab` also hide their create/edit/delete controls
  for roles that can view-but-not-manage (e.g. a Business Analyst sees releases
  read-only, since `POST /release/create` is `ADMIN`/`PROJECT_MANAGER`-only).
- **Numeric IDs you have to type in** (task ID for test cases, requirement ID and
  developer ID for tasks) aren't a UI limitation — they're because the backend has
  no endpoint to list those resources for the roles that need them. Once you add
  such endpoints, swap those `<Input type="number">` fields for `<select>`s the
  same way `ReleasesTab.jsx` does for sprint/repository (which *are* listable).

## Admin organization overview

`AdminDashboard` now pulls org-wide data from 11 new read-only endpoints
(`src/api/admin.js`, `src/hooks/useOrgOverview.js`) — assumed to be
`GET /admin/projects`, `/admin/requirements`, `/admin/sprints`, `/admin/tasks`,
`/admin/testcases`, `/admin/bugs`, `/admin/documents`, `/admin/reports`,
`/admin/repos`, `/admin/releases`, `/admin/deployments`, all under the same
`AdminController` as `/admin/users`. If your actual base path differs, update
the URLs in `src/api/admin.js` — everything else adapts automatically.

**Make sure these endpoints are restricted to `ADMIN`** (class-level or
per-method `@PreAuthorize`) — they return every project/task/bug/etc. across
the whole organization, so they're equivalent in sensitivity to `/admin/users`.

`useOrgOverview` loads all 11 in parallel with `Promise.allSettled`, so if one
endpoint isn't reachable yet (wrong path, still being built, etc.) the rest of
the dashboard still renders — a toast lists which resource(s) failed instead of
the whole page breaking.

This still doesn't give admins access to an individual project's full
workspace (`GET /project/project/{id}` is still `PROJECT_MANAGER`-only) — the
new dashboard is read-only org-wide reporting, not a way to edit projects as
admin. See gap #2 above, which is otherwise unchanged.

## Developer task lookup + IDs shown everywhere

`DeveloperDashboard` now has two lookup cards ("By sprint" / "By requirement")
that call `GET /task/get/sprint` and `GET /task/get/req` with the developer's
own ID (from the JWT-derived profile) plus whatever sprint/requirement ID they
enter — see `src/pages/dashboard/TaskLookupCard.jsx`.

**Fix needed on your side**: as pasted, both endpoints use
`@PreAuthorize("hasAuthority('PROJECT_MANAGER','DEVELOPER')")`. `hasAuthority`
only accepts one argument — this throws at request time for both roles. It
needs to be `hasAnyAuthority('PROJECT_MANAGER','DEVELOPER')` instead. This is
the same class of bug as the earlier `TaskController.getTaskById` issue —
worth a quick search across the codebase for other `hasAuthority(` calls with
more than one argument.

Since every ID-driven lookup in this app (developer's sprint/requirement
lookup, QA's task lookup, PM's "assigned developer" field) depends on someone
being able to *see* the ID they need to type in, every table that lists
Projects, Requirements, Sprints, Tasks, Test Cases, Bugs, Documents, Reports,
Repositories, Releases, Deployments, and Users now shows an `ID` column
(mono font, first column). The project workspace header also shows the
project's own ID next to its title. If a new list view gets added later,
give it an ID column too — it's the only way a non-PM role can act on
anything ID-scoped.

## QA task lookup now shows the task itself, and developers can update status

`GET /task/get/{taskId}` now allows `QA_ENGINEER` (alongside `PROJECT_MANAGER`/
`ADMIN`), so `TestCasesTab` fetches and displays the task's title, description,
priority and status before showing/creating its test cases — QA sees what
they're testing, not just a bare ID.

**Fix needed on your side**: as pasted, the check is
`hasAnyAuthority('PROJECT_MANAGER','ADMIN','QA_Engineer')`. Authority checks
are case-sensitive exact-string matches, and the `Role` enum value is
`QA_ENGINEER` (all caps) — `'QA_Engineer'` will never match what
`CustomUserDetailService` actually grants, so QA still gets a 403 as written.
Needs to be `'QA_ENGINEER'`.

`PUT /task/update/status/{taskId}` now allowing `DEVELOPER` (this one's
correct as written) means developers can update task status right from their
dashboard's sprint/requirement lookup — `TaskLookupCard` now renders status as
an editable dropdown instead of plain text, using the same optimistic-update-
with-rollback-on-error pattern used everywhere else in the app.
