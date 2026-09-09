import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, ArrowRight, Clock } from 'lucide-react'
import { useRecentProjects } from '../../hooks/useRecentProjects'
import Panel from '../../components/common/Panel'
import Button from '../../components/common/Button'
import { Field, Input } from '../../components/common/Field'

export default function ProjectJumpCard({ hint }) {
  const navigate = useNavigate()
  const { recent } = useRecentProjects()
  const [projectId, setProjectId] = useState('')

  return (
    <Panel>
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ember-500/10 text-ember-500">
          <FolderKanban size={16} />
        </div>
        <p className="font-display text-sm font-semibold text-[var(--text)]">Open a project</p>
      </div>
      <p className="mt-3 text-xs text-[var(--text-muted)]">
        {hint || "Your role doesn't have a project directory — ask your project manager for the project ID."}
      </p>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (projectId.trim()) navigate(`/projects/${projectId.trim()}`)
        }}
      >
        <Field className="flex-1">
          <Input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Project ID, e.g. 4"
            inputMode="numeric"
          />
        </Field>
        <Button type="submit" size="sm">
          Open
        </Button>
      </form>

      {recent.length > 0 && (
        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)]">
            <Clock size={12} />
            Recently opened
          </p>
          <div className="flex flex-col">
            {recent.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="focus-ring flex items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-[var(--text)] hover:bg-[var(--bg-sunken)]"
              >
                <span className="truncate">{p.title}</span>
                <ArrowRight size={12} className="shrink-0 text-[var(--text-muted)]" />
              </button>
            ))}
          </div>
        </div>
      )}
    </Panel>
  )
}
