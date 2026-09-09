import { Flame } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* Brand panel */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-forge-950 px-10 py-10 text-forge-100 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #e8590c 0%, transparent 45%), radial-gradient(circle at 85% 75%, #fb7a30 0%, transparent 40%)',
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ember-500 text-white">
            <Flame size={17} strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            NeuroForge
          </span>
        </div>

        <div className="relative max-w-sm">
          <p className="font-display text-3xl font-semibold leading-[1.15] text-white">
            One workspace for the whole software lifecycle.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-forge-300">
            Requirements, sprints, tasks, testing, bugs, releases and deployments — tracked
            together, without switching tools.
          </p>
        </div>

        <p className="relative font-mono text-[11px] text-forge-400">
          requirements → sprints → tasks → testing → release → deploy
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-end px-6 py-5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="focus-ring rounded-md p-2 text-[var(--text-muted)] hover:bg-[var(--bg-sunken)] hover:text-[var(--text)]"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-sm">
            {eyebrow && (
              <p className="mb-2 font-mono text-[11px] text-[var(--text-muted)]">{eyebrow}</p>
            )}
            <h1 className="font-display text-2xl font-semibold text-[var(--text)]">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-[var(--text-muted)]">{subtitle}</p>}
            <div className="mt-7">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
