import {
  FolderKanban,
  ClipboardList,
  CalendarRange,
  CheckSquare,
  FlaskConical,
  Bug,
  FileText,
  BarChart3,
  GitBranch,
  Rocket,
  Server,
} from 'lucide-react'
import Badge from '../components/common/Badge'
import {
  fetchAllProjectsOrgWide,
  fetchAllRequirementsOrgWide,
  fetchAllSprintsOrgWide,
  fetchAllTasksOrgWide,
  fetchAllTestCasesOrgWide,
  fetchAllBugsOrgWide,
  fetchAllDocumentsOrgWide,
  fetchAllReportsOrgWide,
  fetchAllRepositoriesOrgWide,
  fetchAllReleasesOrgWide,
  fetchAllDeploymentsOrgWide,
} from '../api/admin'

const ID_COLUMN = {
  key: 'id',
  header: 'ID',
  render: (r) => <span className="font-mono text-xs text-[var(--text-muted)]">#{r.id}</span>,
}

// Single source of truth for the 11 org-wide admin resources — used by the
// sidebar nav, the admin dashboard tiles, and AdminResourcePage. Add a new
// resource here once and it shows up everywhere automatically.
export const ADMIN_RESOURCES = [
  {
    key: 'projects',
    label: 'Projects',
    icon: FolderKanban,
    fetch: fetchAllProjectsOrgWide,
    columns: [
      ID_COLUMN,
      { key: 'title', header: 'Title' },
      { key: 'projectStatus', header: 'Status', render: (r) => <Badge value={r.projectStatus} /> },
      { key: 'start_date', header: 'Start' },
      { key: 'end_date', header: 'End' },
    ],
  },
  {
    key: 'requirements',
    label: 'Requirements',
    icon: ClipboardList,
    fetch: fetchAllRequirementsOrgWide,
    columns: [
      ID_COLUMN,
      { key: 'title', header: 'Title' },
      { key: 'requirementPriority', header: 'Priority', render: (r) => <Badge value={r.requirementPriority} /> },
      { key: 'requirementStatus', header: 'Status', render: (r) => <Badge value={r.requirementStatus} /> },
    ],
  },
  {
    key: 'sprints',
    label: 'Sprints',
    icon: CalendarRange,
    fetch: fetchAllSprintsOrgWide,
    columns: [
      ID_COLUMN,
      { key: 'name', header: 'Name' },
      { key: 'goal', header: 'Goal' },
      { key: 'start_date', header: 'Start' },
      { key: 'end_date', header: 'End' },
    ],
  },
  {
    key: 'tasks',
    label: 'Tasks',
    icon: CheckSquare,
    fetch: fetchAllTasksOrgWide,
    columns: [
      ID_COLUMN,
      { key: 'title', header: 'Title' },
      { key: 'estimatedHours', header: 'Est. hours' },
      { key: 'taskPriority', header: 'Priority', render: (r) => <Badge value={r.taskPriority} /> },
      { key: 'taskStatus', header: 'Status', render: (r) => <Badge value={r.taskStatus} /> },
    ],
  },
  {
    key: 'testCases',
    label: 'Test cases',
    icon: FlaskConical,
    fetch: fetchAllTestCasesOrgWide,
    columns: [
      ID_COLUMN,
      { key: 'title', header: 'Title' },
      { key: 'testCaseStatus', header: 'Status', render: (r) => <Badge value={r.testCaseStatus} /> },
    ],
  },
  {
    key: 'bugs',
    label: 'Bugs',
    icon: Bug,
    fetch: fetchAllBugsOrgWide,
    columns: [
      ID_COLUMN,
      { key: 'title', header: 'Title' },
      { key: 'bugSeverity', header: 'Severity', render: (r) => <Badge value={r.bugSeverity} /> },
      { key: 'bugStatus', header: 'Status', render: (r) => <Badge value={r.bugStatus} /> },
    ],
  },
  {
    key: 'documents',
    label: 'Documents',
    icon: FileText,
    fetch: fetchAllDocumentsOrgWide,
    columns: [
      ID_COLUMN,
      { key: 'title', header: 'Title' },
      { key: 'documentType', header: 'Type', render: (r) => <Badge value={r.documentType} /> },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: BarChart3,
    fetch: fetchAllReportsOrgWide,
    columns: [
      ID_COLUMN,
      { key: 'title', header: 'Title' },
      { key: 'reportType', header: 'Type', render: (r) => <Badge value={r.reportType} /> },
    ],
  },
  {
    key: 'repositories',
    label: 'Repositories',
    icon: GitBranch,
    fetch: fetchAllRepositoriesOrgWide,
    columns: [
      ID_COLUMN,
      { key: 'repositoryName', header: 'Repository' },
      {
        key: 'defaultBranch',
        header: 'Default branch',
        render: (r) => <span className="font-mono text-xs">{r.defaultBranch}</span>,
      },
      {
        key: 'url',
        header: 'URL',
        render: (r) => (
          <a
            href={r.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-ember-500 hover:underline"
          >
            Open
          </a>
        ),
      },
    ],
  },
  {
    key: 'releases',
    label: 'Releases',
    icon: Rocket,
    fetch: fetchAllReleasesOrgWide,
    columns: [
      ID_COLUMN,
      { key: 'version', header: 'Version', render: (r) => <span className="font-mono">{r.version}</span> },
      { key: 'releaseDate', header: 'Date' },
      { key: 'releaseStatus', header: 'Status', render: (r) => <Badge value={r.releaseStatus} /> },
    ],
  },
  {
    key: 'deployments',
    label: 'Deployments',
    icon: Server,
    fetch: fetchAllDeploymentsOrgWide,
    columns: [
      ID_COLUMN,
      { key: 'environment', header: 'Environment' },
      { key: 'deployAt', header: 'Deployed' },
      { key: 'deploymentStatus', header: 'Status', render: (r) => <Badge value={r.deploymentStatus} /> },
    ],
  },
]

export function getResourceConfig(key) {
  return ADMIN_RESOURCES.find((r) => r.key === key)
}
