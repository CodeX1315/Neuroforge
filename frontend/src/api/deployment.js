import { axiosClient } from './axiosClient'

// POST /deployment/create
export function createDeployment(payload) {
  return axiosClient.post('/deployment/create', payload)
}

// GET /deployment/release/{releaseId}
export function fetchDeploymentsByRelease(releaseId) {
  return axiosClient.get(`/deployment/release/${releaseId}`)
}

// GET /deployment/{deploymentId}
export function fetchDeploymentById(deploymentId) {
  return axiosClient.get(`/deployment/${deploymentId}`)
}

// PATCH /deployment/{deploymentId}/status
export function updateDeploymentStatus(deploymentId, deploymentStatus) {
  return axiosClient.patch(`/deployment/${deploymentId}/status`, { deploymentStatus })
}

// DELETE /deployment/{deploymentId}
export function deleteDeployment(deploymentId) {
  return axiosClient.delete(`/deployment/${deploymentId}`)
}
