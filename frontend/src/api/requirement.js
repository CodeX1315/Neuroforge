import { axiosClient } from './axiosClient'

// POST /requirement/create
export function createRequirement(payload) {
  return axiosClient.post('/requirement/create', payload)
}

// GET /requirement/get-requirement/{id}
export function fetchRequirementById(id) {
  return axiosClient.get(`/requirement/get-requirement/${id}`)
}

// GET /requirement/all-requirements — BUSINESS_ANALYST or ADMIN, org-wide
export function fetchAllRequirements() {
  return axiosClient.get('/requirement/all-requirements')
}

// GET /requirement/all-requirements/ba/{projectId} — requirements the current BA created for a project
export function fetchRequirementsByProject(projectId) {
  return axiosClient.get(`/requirement/all-requirements/ba/${projectId}`)
}

// PUT /requirement/update/{id}/status
export function updateRequirementStatus(id, requirementStatus) {
  return axiosClient.put(`/requirement/update/${id}/status`, { requirementStatus })
}

// PATCH /requirement/update/edit/{requirementId}
export function editRequirement(requirementId, payload) {
  return axiosClient.patch(`/requirement/update/edit/${requirementId}`, payload)
}

// DELETE /requirement/delete/{id}
export function deleteRequirement(id) {
  return axiosClient.delete(`/requirement/delete/${id}`)
}
