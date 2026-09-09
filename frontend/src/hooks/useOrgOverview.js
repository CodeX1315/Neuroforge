import { useEffect, useState } from 'react'
import { ADMIN_RESOURCES } from '../constants/adminResources'

const EMPTY = Object.fromEntries(ADMIN_RESOURCES.map((r) => [r.key, []]))

// Loads every org-wide admin resource in parallel (used for the dashboard's
// stat tiles + breakdowns). Any individual endpoint that 404s/403s/fails
// doesn't take the rest of the dashboard down with it — its key just stays
// an empty array, and its label is returned in `failed` so the UI can say so
// instead of silently showing a wrong zero.
export function useOrgOverview() {
  const [data, setData] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      const results = await Promise.allSettled(ADMIN_RESOURCES.map((r) => r.fetch()))
      if (cancelled) return

      const next = { ...EMPTY }
      const failures = []
      results.forEach((res, i) => {
        const { key, label } = ADMIN_RESOURCES[i]
        if (res.status === 'fulfilled') {
          next[key] = res.value.data
        } else {
          failures.push(label)
        }
      })

      setData(next)
      setFailed(failures)
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, failed }
}
