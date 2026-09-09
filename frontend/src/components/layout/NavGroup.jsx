import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const linkBase =
  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors focus-ring'
const linkInactive = 'text-[var(--text-muted)] hover:bg-[var(--bg-sunken)] hover:text-[var(--text)]'
const linkActive = 'bg-ember-500/10 text-ember-500 font-medium'

// A sidebar section that expands to show sub-links, e.g. Organization ->
// Projects / Requirements / Sprints / ... Auto-expands if the current route
// is already inside it, so a page refresh doesn't hide where you are.
export default function NavGroup({ icon: Icon, label, basePath, items, onNavigate }) {
  const location = useLocation()
  const startsInside = location.pathname.startsWith(basePath)
  const [open, setOpen] = useState(startsInside)

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`${linkBase} w-full justify-between ${
          startsInside && !open ? linkActive : linkInactive
        }`}
      >
        <span className="flex items-center gap-2.5">
          <Icon size={16} />
          {label}
        </span>
        <ChevronRight size={14} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="mt-1 flex flex-col gap-0.5 border-l border-[var(--border)] pl-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `${linkBase} !py-1.5 text-[13px] ${isActive ? linkActive : linkInactive}`
              }
            >
              <item.icon size={14} />
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
