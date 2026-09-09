import { axiosClient } from './axiosClient'

// POST /repository/create
export function createRepository(payload) {
  return axiosClient.post('/repository/create', payload)
}

// GET /repository/project/{projectId}
export function fetchRepositoriesByProject(projectId) {
  return axiosClient.get(`/repository/project/${projectId}`)
}

// GET /repository/{repositoryId}
export function fetchRepositoryById(repositoryId) {
  return axiosClient.get(`/repository/${repositoryId}`)
}
