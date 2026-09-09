import { axiosClient } from './axiosClient'

// POST /testcase/create
export function createTestCase(payload) {
  return axiosClient.post('/testcase/create', payload)
}

// GET /testcase/get/testcase/{testCaseId}
export function fetchTestCaseById(testCaseId) {
  return axiosClient.get(`/testcase/get/testcase/${testCaseId}`)
}

// GET /testcase/get/testcase/task/{taskId} — all test cases for a task
export function fetchTestCasesOfTask(taskId) {
  return axiosClient.get(`/testcase/get/testcase/task/${taskId}`)
}

// GET /testcase/get/testcase/qa-task/{taskId} — test cases created by the current QA for a task
export function fetchTestCasesCreatedByQA(taskId) {
  return axiosClient.get(`/testcase/get/testcase/qa-task/${taskId}`)
}

// PUT /testcase/update/status/{testCaseId} — body: { taskId, testCaseStatus }
export function updateTestCaseStatus(testCaseId, taskId, testCaseStatus) {
  return axiosClient.put(`/testcase/update/status/${testCaseId}`, { taskId, testCaseStatus })
}

// PUT /testcase/update/step-result/{testCaseId} — body: { taskId, steps, expectedResult }
export function updateTestCaseStepAndResult(testCaseId, taskId, steps, expectedResult) {
  return axiosClient.put(`/testcase/update/step-result/${testCaseId}`, {
    taskId,
    steps,
    expectedResult,
  })
}

// DELETE /testcase/delete — body: { testCaseId, taskId }
export function deleteTestCase(testCaseId, taskId) {
  return axiosClient.delete('/testcase/delete', { data: { testCaseId, taskId } })
}
