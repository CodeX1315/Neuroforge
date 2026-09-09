import { axiosClient } from './axiosClient'

// POST /document/create
export function createDocument(payload) {
  return axiosClient.post('/document/create', payload)
}

// GET /document/get/{id}
export function fetchDocumentById(id) {
  return axiosClient.get(`/document/get/${id}`)
}

// GET /document/get-all?projectId=&type=
export function fetchDocumentsByProjectAndType(projectId, documentType) {
  return axiosClient.get('/document/get-all', { params: { projectId, type: documentType } })
}

// GET /document/get-all/creator?projectId=&type= — documents created by the current user
export function fetchDocumentsCreatedByUser(projectId, documentType) {
  return axiosClient.get('/document/get-all/creator', { params: { projectId, type: documentType } })
}

// PUT /document/update/{id}
export function updateDocument(id, data) {
  return axiosClient.put(`/document/update/${id}`, { data })
}

// DELETE /document/delete/{id}
export function deleteDocument(id) {
  return axiosClient.delete(`/document/delete/${id}`)
}
