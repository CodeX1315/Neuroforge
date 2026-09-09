import { axiosClient } from './axiosClient'

// POST /report/create
export function createReport(payload) {
  return axiosClient.post('/report/create', payload)
}

// GET /report/get/{id}
export function fetchReportById(id) {
  return axiosClient.get(`/report/get/${id}`)
}

// GET /report/get-all?projectId=&type=
export function fetchReportsByProjectAndType(projectId, reportType) {
  return axiosClient.get('/report/get-all', { params: { projectId, type: reportType } })
}

// GET /report/get-all/creator?projectId=&type=
export function fetchReportsCreatedByUser(projectId, reportType) {
  return axiosClient.get('/report/get-all/creator', { params: { projectId, type: reportType } })
}

// PUT /report/update/{reportId}
export function updateReport(reportId, data) {
  return axiosClient.put(`/report/update/${reportId}`, { data })
}

// DELETE /report/delete/{reportId}
export function deleteReport(reportId) {
  return axiosClient.delete(`/report/delete/${reportId}`)
}
