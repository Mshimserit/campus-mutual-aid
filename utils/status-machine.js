export const ORDER_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_CONFIRM: 'WAITING_CONFIRM',
  COMPLETED: 'COMPLETED'
}

export const STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: {
    text: '未被接单',
    color: '#FF9500',
    bgColor: '#FFF3E0'
  },
  [ORDER_STATUS.IN_PROGRESS]: {
    text: '进行中',
    color: '#1890ff',
    bgColor: '#E6F7FF'
  },
  [ORDER_STATUS.WAITING_CONFIRM]: {
    text: '送达待确认',
    color: '#722ed1',
    bgColor: '#F9F0FF'
  },
  [ORDER_STATUS.COMPLETED]: {
    text: '已完成',
    color: '#52c41a',
    bgColor: '#F6FFED'
  }
}

export const STATUS_TRANSITIONS = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.IN_PROGRESS],
  [ORDER_STATUS.IN_PROGRESS]: [ORDER_STATUS.WAITING_CONFIRM],
  [ORDER_STATUS.WAITING_CONFIRM]: [ORDER_STATUS.COMPLETED],
  [ORDER_STATUS.COMPLETED]: []
}

export const STATUS_STEP_MAP = {
  [ORDER_STATUS.PENDING]: 0,
  [ORDER_STATUS.IN_PROGRESS]: 1,
  [ORDER_STATUS.WAITING_CONFIRM]: 2,
  [ORDER_STATUS.COMPLETED]: 3
}

export function canTransition(fromStatus, toStatus) {
  const allowedTransitions = STATUS_TRANSITIONS[fromStatus]
  if (!allowedTransitions) return false
  return allowedTransitions.includes(toStatus)
}

export function getStatusStep(status) {
  return STATUS_STEP_MAP[status] ?? 0
}
