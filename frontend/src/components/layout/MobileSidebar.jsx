import { NavLink } from 'react-router-dom'
import { LayoutGrid, FolderKanban, ShieldCheck, UserRound, Flame, X, Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { canListProjects, isAdmin } from '../../constants/access'
import { ADMIN_RESOURCES } from '../../constants/adminResources'
import NavGroup from './NavGroup'

const linkBase = 'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors focus-ring'
const linkInactive = 'text-[var(--text-muted)] hover:bg-[var(--bg-sunken)] hover:text-[var(--text)]'
const linkActive = 'bg-ember-500/10 text-ember-500 font-medium'

const orgNavItems = ADMIN_RESOURCES.map((r) => ({
  to: `/admin/organization/${r.key}`,
  label: r.label,
  icon: r.icon,
}))

export default function MobileSidebar({ open, onClose }) {
  const { role } = useAuth()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex w-64 flex-col bg-[var(--bg-raised)] px-3 py-4">
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ember-500 text-white">
              <Flame size={15} strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px] font-semibold">NeuroForge</span>
          </div>
          <button onClick={onClose} className="focus-ring rounded-md p-1 text-[var(--text-muted)]">
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            <LayoutGrid size={16} />
            Dashboard
          </NavLink>
          {(canListProjects(role) || !role) && (
            <NavLink
              to="/projects"
              onClick={onClose}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
            >
              <FolderKanban size={16} />
              Projects
            </NavLink>
          )}
          {isAdmin(role) && (
            <>
              <NavLink
                to="/admin/users"
                onClick={onClose}
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
                onNavigate={onClose}
              />
            </>
          )}
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            <UserRound size={16} />
            Profile
          </NavLink>
        </nav>
      </div>
    </div>
  )
}
