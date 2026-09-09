import { useCallback, useEffect, useState } from 'react'

const KEY = 'nf-recent-projects'
const MAX = 6

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useRecentProjects() {
  const [recent, setRecent] = useState(read)

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setRecent(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const remember = useCallback((project) => {
    const next = [
      { id: project.id, title: project.title, visitedAt: Date.now() },
      ...read().filter((p) => p.id !== project.id),
    ].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
    setRecent(next)
  }, [])

  return { recent, remember }
}
