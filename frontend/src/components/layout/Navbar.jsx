import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, LogOut, ChevronDown, Menu } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { humanizeEnum } from '../../constants/enums'

export default function Navbar({ onMenuClick, title }) {
  const { theme, toggleTheme } = useTheme()
  const { user, role, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-raised)] px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="focus-ring rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-sunken)] md:hidden"
        >
          <Menu size={18} />
        </button>
        <h1 className="font-display text-[15px] font-semibold text-[var(--text)]">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="focus-ring rounded-md p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-sunken)] hover:text-[var(--text)]"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="focus-ring flex items-center gap-2 rounded-md border border-[var(--border)] py-1.5 pl-2 pr-2.5 hover:bg-[var(--bg-sunken)]"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ember-500/15 font-display text-[11px] font-semibold text-ember-500">
              {(user?.username || user?.email || '?')[0]?.toUpperCase()}
            </div>
            <span className="hidden text-xs font-medium text-[var(--text)] sm:inline">
              {user?.username || 'Account'}
            </span>
            <ChevronDown size={14} className="text-[var(--text-muted)]" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-20 w-52 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-raised)] shadow-xl">
              <div className="border-b border-[var(--border)] px-3 py-2.5">
                <p className="truncate text-xs font-medium text-[var(--text)]">{user?.email}</p>
                <p className="mt-0.5 font-mono text-[11px] text-[var(--text-muted)]">
                  {role ? humanizeEnum(role) : 'Role pending assignment'}
                </p>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/profile')
                }}
                className="block w-full px-3 py-2 text-left text-xs text-[var(--text)] hover:bg-[var(--bg-sunken)]"
              >
                View profile
              </button>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#c4432e] hover:bg-[#c4432e]/10"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
