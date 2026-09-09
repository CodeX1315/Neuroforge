import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Info } from 'lucide-react'
import { usePageTitle } from '../../context/PageTitleContext'
import { useAuth, extractErrorMessage } from '../../context/AuthContext'
import { useRecentProjects } from '../../hooks/useRecentProjects'
import { fetchProjectById } from '../../api/project'
import { visibleProjectTabs } from '../../constants/access'
import Badge from '../../components/common/Badge'
import Panel from '../../components/common/Panel'
import { Spinner, ErrorState, EmptyState } from '../../components/common/Feedback'

import OverviewTab from './tabs/OverviewTab'
import RequirementsTab from './tabs/RequirementsTab'
import SprintsTab from './tabs/SprintsTab'
import TestCasesTab from './tabs/TestCasesTab'
import DocumentsTab from './tabs/DocumentsTab'
import ReportsTab from './tabs/ReportsTab'
import RepositoriesTab from './tabs/RepositoriesTab'
import ReleasesTab from './tabs/ReleasesTab'

const TAB_COMPONENTS = {
  overview: OverviewTab,
  requirements: RequirementsTab,
  sprints: SprintsTab,
  testcases: TestCasesTab,
  documents: DocumentsTab,
  reports: ReportsTab,
  repositories: RepositoriesTab,
  releases: ReleasesTab,
}

export default function ProjectWorkspace() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const { remember } = useRecentProjects()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fatalError, setFatalError] = useState(false)
  const tabs = visibleProjectTabs(role)
  const [activeTab, setActiveTab] = useState(tabs[0]?.key)

  usePageTitle(project ? project.title : 'Project')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setFatalError(false)
      try {
        // GET /project/project/{id} is PROJECT_MANAGER-only on the backend —
        // every other role hits a 403 here. Rather than dead-ending the page,
        // fall back to a minimal header so the tabs that role *does* have
        // access to (Documents, Repositories, Releases, etc.) still work.
        const { data } = await fetchProjectById(projectId)
        if (!cancelled) {
          setProject(data)
          remember(data)
        }
      } catch (err) {
        const status = err.response?.status
        if (status === 403) {
          if (!cancelled) {
            const stub = {
              id: Number(projectId),
              title: 'Project details restricted',
              description: '',
              projectStatus: null,
              restricted: true,
            }
            setProject(stub)
            remember(stub)
          }
        } else {
          if (!cancelled) {
            setFatalError(true)
            toast.error(extractErrorMessage(err, 'Could not load this project'))
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [projectId])

  const ActiveComponent = TAB_COMPONENTS[activeTab]

  if (loading) return <Spinner label="Loading project" />

  if (fatalError || !project) {
    return (
      <ErrorState
        title="Could not load this project"
        description="It may not exist, or the ID is wrong."
      />
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <button
          onClick={() => navigate('/')}
          className="focus-ring mb-3 inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          <ArrowLeft size={13} />
          Back to dashboard
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">{project.title}</h2>
          <span className="font-mono text-xs text-[var(--text-muted)]">#{project.id}</span>
          {project.projectStatus && <Badge value={project.projectStatus} />}
        </div>
        {project.description && (
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--text-muted)]">{project.description}</p>
        )}
      </div>

      {project.restricted && (
        <Panel className="flex items-start gap-2.5 border-[#3b6e8c]/30 bg-[#3b6e8c]/5 !py-3">
          <Info size={15} className="mt-0.5 shrink-0 text-[#3b6e8c]" />
          <p className="text-xs text-[var(--text-muted)]">
            Full project details (title, description, status) are only visible to this project's
            manager. You're seeing the tools available to your role below.
          </p>
        </Panel>
      )}

      {tabs.length === 0 ? (
        <EmptyState
          title="Nothing here for your role yet"
          description="Your account doesn't have access to any tools inside a project workspace right now."
        />
      ) : (
        <>
          <div className="border-b border-[var(--border)]">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`focus-ring whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-ember-500 font-medium text-ember-500'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {ActiveComponent && <ActiveComponent project={project} onProjectChange={setProject} />}
        </>
      )}
    </div>
  )
}
