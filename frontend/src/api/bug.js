import { axiosClient } from './axiosClient'

// POST /bug/create
export function createBug(payload) {
  return axiosClient.post('/bug/create', payload)
}

// GET /bug/get-bug?bugId=&testcaseId= — note the backend's query param is
// "testcaseId" (lowercase c), not "testCaseId".
export function fetchBugByIdAndTestCase(bugId, testCaseId) {
  return axiosClient.get('/bug/get-bug', { params: { bugId, testcaseId: testCaseId } })
}

// GET /bug/get-all/{testCaseId}
export function fetchAllBugsOfTestCase(testCaseId) {
  return axiosClient.get(`/bug/get-all/${testCaseId}`)
}

// PUT /bug/update/status/{bugId}
export function updateBugStatus(bugId, bugStatus) {
  return axiosClient.put(`/bug/update/status/${bugId}`, { bugStatus })
}

// PUT /bug/update/severity/{bugId}
export function updateBugSeverity(bugId, bugSeverity) {
  return axiosClient.put(`/bug/update/severity/${bugId}`, { bugSeverity })
}

// DELETE /bug/delete/{bugId}
export function deleteBug(bugId) {
  return axiosClient.delete(`/bug/delete/${bugId}`)
}
