import { axiosClient } from './axiosClient'

// POST /sprint/create
export function createSprint(payload) {
  return axiosClient.post('/sprint/create', payload)
}

// GET /sprint/get-all/{id} — fixed on the backend; route now has the slash.
export function fetchAllSprints(projectId) {
  return axiosClient.get(`/sprint/get-all/${projectId}`)
}

// GET /sprint/get-sprint/{id}
export function fetchSprintById(id) {
  return axiosClient.get(`/sprint/get-sprint/${id}`)
}

// PUT /sprint/update/{id}
export function updateSprint(id, payload) {
  return axiosClient.put(`/sprint/update/${id}`, payload)
}

// DELETE /sprint/delete/{id}
export function deleteSprint(id) {
  return axiosClient.delete(`/sprint/delete/${id}`)
}
