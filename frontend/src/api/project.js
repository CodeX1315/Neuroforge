import { axiosClient } from './axiosClient'

// POST /project/create
export function createProject(payload) {
  return axiosClient.post('/project/create', payload)
}

// PUT /project/update/{id} — body: { projectStatus }
export function updateProjectStatus(id, projectStatus) {
  return axiosClient.put(`/project/update/${id}`, { projectStatus })
}

// GET /project/all-projects — server derives the project manager from the JWT.
// PROJECT_MANAGER and ADMIN can both call this, but it filters by
// "projects where I am the project manager" — an admin who isn't literally a
// PM on anything will just get an empty list back.
export function fetchAllProjects() {
  return axiosClient.get('/project/all-projects')
}

// GET /project/project/{id} — PROJECT_MANAGER only (ADMIN is not allowed here,
// even though ADMIN can call all-projects above — that's a backend gap, not a
// frontend choice).
export function fetchProjectById(id) {
  return axiosClient.get(`/project/project/${id}`)
}

// PATCH /project/edit/{id}
export function editProject(id, payload) {
  return axiosClient.patch(`/project/edit/${id}`, payload)
}

// DELETE /project/delete/{id}
export function deleteProject(id) {
  return axiosClient.delete(`/project/delete/${id}`)
}
