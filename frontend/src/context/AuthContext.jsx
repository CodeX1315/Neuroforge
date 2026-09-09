import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'
import { registerUnauthorizedHandler, extractErrorMessage } from '../api/axiosClient'
import { loginUser, registerUser, registerWorkspace } from '../api/auth'
import { fetchProfile } from '../api/user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('nf-token'))
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  const clearSession = useCallback(() => {
    localStorage.removeItem('nf-token')
    setToken(null)
    setUser(null)
  }, [])

  // Wire the axios interceptor to our logout logic (avoids a circular import).
  useEffect(() => {
    registerUnauthorizedHandler(clearSession)
  }, [clearSession])

  const loadProfile = useCallback(async () => {
    try {
      const { data } = await fetchProfile()
      // `role` isn't returned by the backend today (see UserRegisterResponse) —
      // this reads it defensively in case it gets added later.
      setUser(data)
      return data
    } catch (error) {
      clearSession()
      throw error
    }
  }, [clearSession])

  useEffect(() => {
    async function init() {
      if (!token) {
        setInitializing(false)
        return
      }
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          clearSession()
          setInitializing(false)
          return
        }
        await loadProfile()
      } catch {
        clearSession()
      } finally {
        setInitializing(false)
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(
    async ({ email, password }) => {
      const { data: jwt } = await loginUser({ email, password })
      localStorage.setItem('nf-token', jwt)
      setToken(jwt)
      const profile = await loadProfile()
      return profile
    },
    [loadProfile]
  )

  const signup = useCallback(async (payload) => {
    const { data } = await registerUser(payload)
    return data
  }, [])

  const createWorkspace = useCallback(async (payload) => {
    const { data } = await registerWorkspace(payload)
    return data
  }, [])

  const logout = useCallback(() => {
    clearSession()
    toast.success('Signed out')
  }, [clearSession])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      initializing,
      role: user?.role ?? null,
      login,
      signup,
      createWorkspace,
      logout,
      refreshProfile: loadProfile,
    }),
    [token, user, initializing, login, signup, createWorkspace, logout, loadProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { extractErrorMessage }
