import { axiosClient } from './axiosClient'

// POST /task/create
export function createTask(payload) {
  return axiosClient.post('/task/create', payload)
}

// GET /task/get/{taskId} — PROJECT_MANAGER or ADMIN
export function fetchTaskById(taskId) {
  return axiosClient.get(`/task/get/${taskId}`)
}

// GET /task/get/sprint/{sprintId}
export function fetchTasksBySprint(sprintId) {
  return axiosClient.get(`/task/get/sprint/${sprintId}`)
}

// GET /task/get/req/{requirementId}
export function fetchTasksByRequirement(requirementId) {
  return axiosClient.get(`/task/get/req/${requirementId}`)
}

// GET /task/get/sprint?developerId=&sprintId=
export function fetchTasksBySprintAndDeveloper(developerId, sprintId) {
  return axiosClient.get('/task/get/sprint', { params: { developerId, sprintId } })
}

// GET /task/get/req?developerId=&reqId=
export function fetchTasksByRequirementAndDeveloper(developerId, reqId) {
  return axiosClient.get('/task/get/req', { params: { developerId, reqId } })
}

// DELETE /task/delete-sprint — body: { taskId, sprintId }
export function deleteTaskBySprint(taskId, sprintId) {
  return axiosClient.delete('/task/delete-sprint', { data: { taskId, sprintId } })
}

// DELETE /task/delete-req — body: { taskId, requirementId }
export function deleteTaskByRequirement(taskId, requirementId) {
  return axiosClient.delete('/task/delete-req', { data: { taskId, requirementId } })
}

// PUT /task/update/status/{taskId}
export function updateTaskStatus(taskId, taskStatus) {
  return axiosClient.put(`/task/update/status/${taskId}`, { taskStatus })
}

// PUT /task/update/priority/{taskId}
export function updateTaskPriority(taskId, taskPriority) {
  return axiosClient.put(`/task/update/priority/${taskId}`, { taskPriority })
}

// PUT /task/update/description/{taskId}
export function updateTaskDescription(taskId, description) {
  return axiosClient.put(`/task/update/description/${taskId}`, { description })
}
