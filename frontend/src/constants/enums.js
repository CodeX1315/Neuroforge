export const ROLES = [
  'USER',
  'PROJECT_MANAGER',
  'BUSINESS_ANALYST',
  'DEVELOPER',
  'QA_ENGINEER',
  'DEVOPS_ENGINEER',
  'ADMIN',
]

export const PROJECT_STATUSES = ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']

export const REQUIREMENT_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
export const REQUIREMENT_STATUSES = [
  'DRAFT',
  'APPROVED',
  'IN_PROGRESS',
  'IMPLEMENTED',
  'REJECTED',
  'DEPRECATED',
]

export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'TESTING', 'DONE', 'BLOCKED']
export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export const TEST_CASE_STATUSES = ['DRAFT', 'READY', 'ACTIVE', 'DEPRECATED']

export const BUG_SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'TRIVIAL']
export const BUG_STATUSES = [
  'NEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'RETEST',
  'VERIFIED',
  'CLOSED',
  'REOPENED',
  'REJECTED',
  'DEFERRED',
]

export const DOCUMENT_TYPES = [
  'SRS',
  'BRD',
  'DESIGN_DOCUMENT',
  'TEST_PLAN',
  'TEST_CASE_DOCUMENT',
  'USER_MANUAL',
  'RELEASE_NOTE',
  'API_DOCUMENTATION',
  'OTHER',
]

export const REPORT_TYPES = [
  'BUG_REPORT',
  'TEST_REPORT',
  'PROJECT_REPORT',
  'RELEASE_REPORT',
  'DEPLOYMENT_REPORT',
  'REQUIREMENT_REPORT',
  'TASK_REPORT',
]

export const RELEASE_STATUSES = [
  'DRAFT',
  'PLANNED',
  'IN_DEVELOPMENT',
  'TESTING',
  'READY_FOR_RELEASE',
  'RELEASED',
  'CANCELLED',
]

export const ENVIRONMENTS = ['DEVELOPMENT', 'STAGING', 'PRODUCTION']

export const DEPLOYMENT_STATUSES = [
  'PENDING',
  'IN_PROGRESS',
  'SUCCESS',
  'FAILED',
  'ROLLED_BACK',
  'CANCELLED',
]

// Turns "IN_PROGRESS" into "In progress" for display.
export function humanizeEnum(value) {
  if (!value) return ''
  return value
    .toLowerCase()
    .split('_')
    .map((w, i) => (i === 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}
