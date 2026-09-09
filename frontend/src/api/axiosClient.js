import axios from 'axios'
import toast from 'react-hot-toast'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// The AuthContext registers a handler here so the interceptor can log the
// user out without creating a circular import between axiosClient <-> AuthContext.
let onUnauthorized = () => {}
export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nf-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      onUnauthorized()
      toast.error('Your session expired. Please sign in again.')
    } else if (status === 403) {
      toast.error("You don't have permission to do that.")
    } else if (status >= 500) {
      toast.error('Something went wrong on the server. Try again shortly.')
    } else if (!error.response) {
      toast.error('Cannot reach the server. Is the backend running?')
    }

    return Promise.reject(error)
  }
)

// Backend error bodies are usually plain-text strings, occasionally JSON.
// This normalizes both into a readable message for toasts/forms.
export function extractErrorMessage(error, fallback = 'Something went wrong') {
  const data = error?.response?.data
  if (!data) return error?.message || fallback
  if (typeof data === 'string') return data
  if (typeof data === 'object' && data.message) return data.message
  return fallback
}
