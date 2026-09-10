# Enterprise Software Life Cycle and Devops Management System

**NeuroForge** is a unified platform that brings the entire software development
lifecycle — requirements, sprints, tasks, testing, bugs, documentation,
reporting, source control, releases, and deployments — into a single
workspace. Instead of a team spreading its work across a project tracker, a
requirements tool, a test management system, and a deployment dashboard,
everyone works from one connected platform, scoped to their role.

It's built as a full-stack application: a Spring Boot REST API backed by
MySQL, and a React single-page frontend consuming it.

---

## Why this exists

Most engineering teams stitch together 4–6 separate tools to run a single
project — one for requirements, one for sprints/tasks, one for test cases and
bugs, one for docs, one for releases. Context gets lost at every handoff.
NeuroForge's premise is simple: **one data model, one login, one workspace**,
with every role seeing exactly the slice of it relevant to their job.

## Core modules

| Module | What it covers |
|---|---|
| **Auth & Organizations** | JWT-based login; a workspace is created by an admin, and teammates join it with an invite code |
| **Admin** | Team management, role assignment, and read-only organization-wide oversight of every resource below |
| **Projects** | The top-level container everything else belongs to |
| **Requirements** | What needs to be built, with priority and status tracking |
| **Sprints** | Time-boxed iterations a project's work is organized into |
| **Tasks** | Actionable work items, assigned to developers, scoped to a sprint and a requirement |
| **Test Cases** | QA-authored test coverage against a task |
| **Bugs** | Defects logged against a test case, tracked through severity and resolution |
| **Documents** | Structured project documentation (SRS, BRD, design docs, release notes, etc.) |
| **Reports** | Structured reporting per project (status, test, deployment, requirement reports) |
| **Repositories** | Source repositories linked to a project |
| **Releases** | Versioned releases cut from a sprint and a repository, with changelogs |
| **Deployments** | Environment-by-environment deployment tracking for a release |

## Roles & access

Every account belongs to exactly one role, enforced server-side with Spring
Security (`@PreAuthorize`) and mirrored in the frontend so people only see
what they can actually use.

| Role | What they do |
|---|---|
| **Admin** | Manages team membership and role assignment; has read-only oversight across every project, requirement, sprint, task, test case, bug, document, report, repository, release, and deployment in the organization |
| **Project Manager** | Owns the project lifecycle — creates and manages projects, sprints, and tasks; assigns developers |
| **Business Analyst** | Authors and maintains requirements for a project |
| **Developer** | Looks up tasks assigned to them (by sprint or requirement) and updates task status; views repositories, releases, and deployments |
| **QA Engineer** | Looks up a task, writes test cases against it, and logs/tracks bugs |
| **DevOps Engineer** | Manages releases and runs/tracks deployments across environments |
| **(unassigned)** | New signups start here until an admin assigns a real role — a deliberate design choice, so nobody can self-grant elevated access on signup |

## How the pieces connect

```mermaid
graph LR
    Project --> Requirement
    Project --> Sprint
    Sprint --> Task
    Requirement --> Task
    Task --> TestCase[Test Case]
    TestCase --> Bug
    Project --> Repository
    Repository --> Release
    Sprint --> Release
    Release --> Deployment
    Project --> Document
    Project --> Report
```

A project is the root of two parallel tracks: a **delivery track**
(requirements → sprints → tasks → test cases → bugs) and a **shipping track**
(repositories → releases → deployments) — with documents and reports
attached at the project level throughout.

## Tech stack

**Backend**
- Java, Spring Boot
- Spring Security with JWT bearer authentication
- Spring Data JPA / Hibernate
- MySQL

**Frontend**
- React 18 + Vite
- Tailwind CSS (light/dark mode)
- React Router v6
- Axios
- React Hot Toast (notifications)
- Lucide (icons)

## Key features

- **Role-based dashboards** — each role lands on a view built around what they
  actually need: a Project Manager sees a portfolio; a Developer sees task
  lookups; an Admin sees organization-wide stats and drill-down tables for
  every resource.
- **Project workspace** — once inside a project, every relevant tool
  (requirements, sprints, test cases, documents, releases, etc.) is a tab
  away, gated by role, instead of a separate page or a separate app.
- **JWT authentication**, organization-scoped signup via invite codes.
- **Light & dark mode**, responsive layout, toast notifications, and skeleton
  loading states throughout.
- **Traceable IDs** — every list surfaces the record's ID, since several
  workflows (a developer looking up their tasks, QA looking up a task to test)
  are ID-driven by design.

## Screenshots

## Authentication Module

### Create workspace and admin
![Register Organization]<img width="1904" height="971" alt="Register_Organization" src="https://github.com/user-attachments/assets/a2e469a4-0053-4f7f-9699-3b69d53cfbbb" />
### Register new user using INVITE CODE
![Register new user using INVITE_CODE]<img width="1905" height="973" alt="Register_New_User" src="https://github.com/user-attachments/assets/a3feb413-a91e-4dd6-afc4-6e4c8d294f34" />
### Login user
![Login user]<img width="1905" height="973" alt="Login_user" src="https://github.com/user-attachments/assets/2f82bb92-533c-42b5-b1af-b2d616a330e7" />

## User Profile for every user
![User profile]<img width="1907" height="973" alt="User_Profile" src="https://github.com/user-attachments/assets/3476d9df-e9c9-49ec-b355-c55c916e7ce1" />

## Project, Sprint, Task, Document, Repository Module

### Project Manager Dashboard
![PM Dashboard]<img width="1907" height="969" alt="PM_Dashboard" src="https://github.com/user-attachments/assets/d0562a68-fb62-4c67-bac4-4bc77af80d66" />
### Project Manager Dashboard Light Theme
![PM dashboard light theme]<img width="1906" height="970" alt="PM_Dashboard_LightTheme" src="https://github.com/user-attachments/assets/aaba9afd-8f37-4bf9-8cbf-4144c63674fa" />
### Create project
![create project]<img width="1909" height="971" alt="PM_CreateTask" src="https://github.com/user-attachments/assets/d8167ea9-94f3-4081-bea5-151427c98262" />
### Project overview
![PM project overview]<img width="1909" height="971" alt="PM_project_overview" src="https://github.com/user-attachments/assets/44a98761-713d-4a70-8c05-91053ee35372" />
### Sprint and task
![PM sprint & task]<img width="1906" height="973" alt="PM_Sprint Task" src="https://github.com/user-attachments/assets/906373a7-43ca-4926-b0dd-bfc0e0c157a0" />
### project section
![PM project section]<img width="1905" height="973" alt="PM_Project_Section" src="https://github.com/user-attachments/assets/5df97dc7-830b-425f-924b-947593bb2f15" />
### Repository
![PM repo]<img width="1906" height="973" alt="PM_Repo" src="https://github.com/user-attachments/assets/61f7f3c1-3a2d-4e65-b6e0-846d33831ef9" />
### Release and Deployment
![PM Release and Deployments]<img width="1909" height="973" alt="PM_Release Deployments" src="https://github.com/user-attachments/assets/afe11174-d4bc-42bc-9bef-6bab92d09535" />

## Requirement Module

### Business Analyst Dashboard
![BA Dashboard]<img width="1905" height="971" alt="BA_Dashboard" src="https://github.com/user-attachments/assets/434a249a-5cb1-45e3-8022-71936470d0d2" />
### Requirements
![BA req]<img width="1909" height="971" alt="BA_Req" src="https://github.com/user-attachments/assets/c5074ca6-028a-4f1c-9049-31f5eb48d749" />
### Create Requirement
![create requirement]<img width="1906" height="973" alt="BA_CreateReq" src="https://github.com/user-attachments/assets/907658fb-011d-4733-9fd1-13ac3de662e2" />

## Task Module

### Developer Dashboard
![Developer dahboard]<img width="1907" height="970" alt="Dev_Dashboard" src="https://github.com/user-attachments/assets/1dc398de-4186-4e17-8728-5e5000ab9316" />
### Developer View Task 
![Developer task]<img width="1905" height="973" alt="Dev_ViewTask" src="https://github.com/user-attachments/assets/e0ff63b0-c1a6-4d87-9320-008fabe86f5b" />

## Test Case Module

### QA Dashboard
![QA Dashboard]<img width="1907" height="971" alt="QA_Dashboard" src="https://github.com/user-attachments/assets/f99cbc76-be69-4ffe-b9c1-ef2af608c0a4" />
### QA Create test case from tasks
![QA create test case]<img width="1909" height="974" alt="QA_CreateTestCase" src="https://github.com/user-attachments/assets/9c3016dc-8058-49a7-a08d-f8f7ae9627e4" />
### QA test Case
![QA Test Case]<img width="1903" height="971" alt="QA_TestCase" src="https://github.com/user-attachments/assets/bffed579-ff48-4b73-9922-e942bc35b551" />

## Deployment Module

### DEVOPS Dashboard
![DevOps Dashboard]<img width="1909" height="973" alt="DevOps_Dashboard" src="https://github.com/user-attachments/assets/0c1e9573-9ea3-4b29-9706-f184631d08c4" />
### DEVOPS Releases
![DevOps Releases]<img width="1907" height="973" alt="DevOps_Release" src="https://github.com/user-attachments/assets/d90891e0-3510-47d2-818a-74e95356c021" />

## Admin 

### Admin Dashboard
![Admin Dashboard]<img width="1906" height="973" alt="ADMIN_Dashboard1" src="https://github.com/user-attachments/assets/5b7d4ead-289c-4817-aba1-7a06daae7d66" />
### Team and Updating role
![Team role]<img width="1910" height="971" alt="ADMIN_TeamRoles" src="https://github.com/user-attachments/assets/46c39bc4-13b5-4f6f-8bd2-91e0b1f69924" />
### All Projects
![All projects]<img width="1906" height="974" alt="ADMIN_AllProject" src="https://github.com/user-attachments/assets/182b00a4-f2bd-4e8d-8dc6-5c423dc4e8f2" />
### All Requirements
![All requirements]<img width="1906" height="973" alt="ADMIN_req" src="https://github.com/user-attachments/assets/7dcf4521-3929-4fba-82a6-a1f19c9a7282" />
### All Sprints
![All sprints]<img width="1905" height="973" alt="ADMIN_sprint" src="https://github.com/user-attachments/assets/9d728e36-148a-48c5-986c-8452ce6a58a6" />
### All Tasks
![All tasks]<img width="1907" height="970" alt="ADMIN_task" src="https://github.com/user-attachments/assets/29cca5a5-d110-43ad-9776-68c38d5bd602" />


## Getting started

### Backend

1. Configure `src/main/resources/application.yaml` with your MySQL
   connection details and a JWT secret.
2. Run the Spring Boot application — Hibernate will create the schema
   (`ddl-auto: update`) on first run.
3. The API listens on `http://localhost:8080` by default.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000` by default — this needs to match the CORS
origin configured on the backend. Copy `.env.example` to `.env` and point
`VITE_API_BASE_URL` at your backend if it isn't on `http://localhost:8080`.

### First-time setup flow

1. Register a new workspace (creates an organization and its first Admin
   account, plus an invite code).
2. Teammates sign up using that invite code — they start with no assigned
   role.
3. The Admin assigns each teammate a role from Team & Roles, after which
   they get access to the tools that role covers.

## Roadmap

- **Refresh tokens** — access tokens are currently short-lived with no
  refresh flow, so sessions expire quickly.
- **OAuth login** — social/enterprise SSO login options.
- **Email service** — notifications and transactional email (invites,
  password resets, activity digests).

## Known design constraints

- An account holds exactly one role — there's no multi-role support today.
- A few workflows are intentionally ID-driven (e.g. a developer entering a
  sprint or requirement ID to find their tasks) where no directory/listing
  endpoint exists yet for that role. The UI surfaces the ID wherever it's
  generated so the right person can hand it off.
