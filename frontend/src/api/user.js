import { axiosClient } from './axiosClient'

// GET /user/profile
export function fetchProfile() {
  return axiosClient.get('/user/profile')
}

// DELETE /user/delete
export function deleteOwnAccount() {
  return axiosClient.delete('/user/delete')
}

// PUT /user/update/password
export function updatePassword({ oldPassword, newPassword, confirmedPassword }) {
  return axiosClient.put('/user/update/password', {
    oldPassword,
    newPassword,
    confirmedPassword,
  })
}

// PUT /user/update/profile
export function updateUserDetails({ name, email }) {
  return axiosClient.put('/user/update/profile', { name, email })
}
