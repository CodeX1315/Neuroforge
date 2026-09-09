import { axiosClient } from './axiosClient'

// POST /release/create
export function createRelease(payload) {
  return axiosClient.post('/release/create', payload)
}

// GET /release/project/{projectId}
export function fetchReleasesByProject(projectId) {
  return axiosClient.get(`/release/project/${projectId}`)
}

// GET /release/repository/{repositoryId}
export function fetchReleasesByRepository(repositoryId) {
  return axiosClient.get(`/release/repository/${repositoryId}`)
}

// GET /release/{releaseId}
export function fetchReleaseById(releaseId) {
  return axiosClient.get(`/release/${releaseId}`)
}

// PATCH /release/{releaseId}/status
export function updateReleaseStatus(releaseId, releaseStatus) {
  return axiosClient.patch(`/release/${releaseId}/status`, { releaseStatus })
}

// PATCH /release/{releaseId}/changelog
export function updateReleaseChangelog(releaseId, changelog) {
  return axiosClient.patch(`/release/${releaseId}/changelog`, { changelog })
}

// DELETE /release/{releaseId}
export function deleteRelease(releaseId) {
  return axiosClient.delete(`/release/${releaseId}`)
}
