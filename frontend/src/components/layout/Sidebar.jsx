import { NavLink } from 'react-router-dom'
import { LayoutGrid, FolderKanban, ShieldCheck, UserRound, Flame, Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { canListProjects, isAdmin } from '../../constants/access'
import { ADMIN_RESOURCES } from '../../constants/adminResources'
import NavGroup from './NavGroup'

const linkBase =
  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors focus-ring'
const linkInactive = 'text-[var(--text-muted)] hover:bg-[var(--bg-sunken)] hover:text-[var(--text)]'
const linkActive = 'bg-ember-500/10 text-ember-500 font-medium'

const orgNavItems = ADMIN_RESOURCES.map((r) => ({
  to: `/admin/organization/${r.key}`,
  label: r.label,
  icon: r.icon,
}))

export default function Sidebar() {
  const { role, user } = useAuth()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-raised)] px-3 py-4 md:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ember-500 text-white">
          <Flame size={15} strokeWidth={2.5} />
        </div>
        <span className="font-display text-[15px] font-semibold tracking-tight">NeuroForge</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          <LayoutGrid size={16} />
          Dashboard
        </NavLink>

        {canListProjects(role) || !role ? (
          <NavLink
            to="/projects"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            <FolderKanban size={16} />
            Projects
          </NavLink>
        ) : null}

        {isAdmin(role) && (
          <>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
            >
              <ShieldCheck size={16} />
              Team &amp; roles
            </NavLink>

            <NavGroup
              icon={Building2}
              label="Organization"
              basePath="/admin/organization"
              items={orgNavItems}
            />
          </>
        )}

        <NavLink
          to="/profile"
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          <UserRound size={16} />
          Profile
        </NavLink>
      </nav>

      <div className="mt-4 rounded-md border border-[var(--border)] bg-[var(--bg-sunken)] px-3 py-2.5">
        <p className="truncate text-xs font-medium text-[var(--text)]">{user?.orgName || 'Workspace'}</p>
        <p className="mt-0.5 truncate font-mono text-[11px] text-[var(--text-muted)]">
          {user?.username || user?.email}
        </p>
      </div>
    </aside>
  )
}
