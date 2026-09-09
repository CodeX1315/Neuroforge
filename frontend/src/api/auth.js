import { axiosClient } from './axiosClient'

// POST /auth/workspace/admin — creates a new organization + its ADMIN user
export function registerWorkspace({ organizationName, adminName, email, password }) {
  return axiosClient.post('/auth/workspace/admin', {
    organizationName,
    adminName,
    email,
    password,
  })
}

// POST /auth/user/signup — joins an existing organization via invite code, role starts as USER
export function registerUser({ name, email, password, inviteCode }) {
  return axiosClient.post('/auth/user/signup', { name, email, password, inviteCode })
}

// POST /auth/login — response body is the raw JWT string (text), not JSON
export function loginUser({ email, password }) {
  return axiosClient.post('/auth/login', { email, password }, { responseType: 'text' })
}
