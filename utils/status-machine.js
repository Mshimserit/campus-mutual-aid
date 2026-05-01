export const ORDER_STATUS = {
  CREATED: 'CREATED',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_CONFIRM: 'WAITING_CONFIRM',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REFUNDING: 'REFUNDING',
  REFUNDED: 'REFUNDED',
  DISPUTING: 'DISPUTING',
  TIMEOUT: 'TIMEOUT',
  CLOSED: 'CLOSED'
}

export const STATUS_CONFIG = {
  [ORDER_STATUS.CREATED]: {
    text: '待支付',
    color: '#FF9500',
    bgColor: '#FFF3E0'
  },
  [ORDER_STATUS.PENDING_PAYMENT]: {
    text: '支付中',
    color: '#1890ff',
    bgColor: '#E6F7FF'
  },
  [ORDER_STATUS.PENDING]: {
    text: '待接单',
    color: '#FA8C16',
    bgColor: '#FFF7E6'
  },
  [ORDER_STATUS.ACCEPTED]: {
    text: '已接单',
    color: '#13C2C2',
    bgColor: '#E6FFFB'
  },
  [ORDER_STATUS.IN_PROGRESS]: {
    text: '配送中',
    color: '#2F54EB',
    bgColor: '#F0F5FF'
  },
  [ORDER_STATUS.WAITING_CONFIRM]: {
    text: '待确认',
    color: '#722ED1',
    bgColor: '#F9F0FF'
  },
  [ORDER_STATUS.COMPLETED]: {
    text: '已完成',
    color: '#52C41A',
    bgColor: '#F6FFED'
  },
  [ORDER_STATUS.CANCELLED]: {
    text: '已取消',
    color: '#8C8C8C',
    bgColor: '#F5F5F5'
  },
  [ORDER_STATUS.REFUNDING]: {
    text: '退款中',
    color: '#FAAD14',
    bgColor: '#FFFBE6'
  },
  [ORDER_STATUS.REFUNDED]: {
    text: '已退款',
    color: '#FF4D4F',
    bgColor: '#FFF1F0'
  },
  [ORDER_STATUS.DISPUTING]: {
    text: '纠纷中',
    color: '#CF1322',
    bgColor: '#FFF1F0'
  },
  [ORDER_STATUS.TIMEOUT]: {
    text: '已超时',
    color: '#F5222D',
    bgColor: '#FFF1F0'
  },
  [ORDER_STATUS.CLOSED]: {
    text: '已关闭',
    color: '#434343',
    bgColor: '#F5F5F5'
  }
}

export const STATUS_TRANSITIONS = {
  [ORDER_STATUS.CREATED]: [ORDER_STATUS.PENDING_PAYMENT, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PENDING_PAYMENT]: [ORDER_STATUS.PENDING, ORDER_STATUS.CANCELLED, ORDER_STATUS.TIMEOUT],
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.ACCEPTED, ORDER_STATUS.CANCELLED, ORDER_STATUS.TIMEOUT],
  [ORDER_STATUS.ACCEPTED]: [ORDER_STATUS.IN_PROGRESS, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.IN_PROGRESS]: [ORDER_STATUS.WAITING_CONFIRM, ORDER_STATUS.DISPUTING],
  [ORDER_STATUS.WAITING_CONFIRM]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.DISPUTING],
  [ORDER_STATUS.COMPLETED]: [ORDER_STATUS.CLOSED],
  [ORDER_STATUS.CANCELLED]: [ORDER_STATUS.REFUNDING, ORDER_STATUS.CLOSED],
  [ORDER_STATUS.REFUNDING]: [ORDER_STATUS.REFUNDED],
  [ORDER_STATUS.REFUNDED]: [ORDER_STATUS.CLOSED],
  [ORDER_STATUS.DISPUTING]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.REFUNDING, ORDER_STATUS.CLOSED],
  [ORDER_STATUS.TIMEOUT]: [ORDER_STATUS.CANCELLED, ORDER_STATUS.CLOSED],
  [ORDER_STATUS.CLOSED]: []
}

export const STATUS_STEP_MAP = {
  [ORDER_STATUS.CREATED]: 0,
  [ORDER_STATUS.PENDING_PAYMENT]: 0,
  [ORDER_STATUS.PENDING]: 1,
  [ORDER_STATUS.ACCEPTED]: 2,
  [ORDER_STATUS.IN_PROGRESS]: 2,
  [ORDER_STATUS.WAITING_CONFIRM]: 3,
  [ORDER_STATUS.COMPLETED]: 4,
  [ORDER_STATUS.CANCELLED]: -1,
  [ORDER_STATUS.REFUNDING]: -1,
  [ORDER_STATUS.REFUNDED]: -1,
  [ORDER_STATUS.DISPUTING]: -1,
  [ORDER_STATUS.TIMEOUT]: -1,
  [ORDER_STATUS.CLOSED]: -1
}

export const ROLE_ACTIONS = {
  publisher: {
    [ORDER_STATUS.CREATED]: ['pay', 'cancel'],
    [ORDER_STATUS.PENDING_PAYMENT]: ['cancel'],
    [ORDER_STATUS.PENDING]: ['cancel'],
    [ORDER_STATUS.WAITING_CONFIRM]: ['confirm', 'dispute'],
    [ORDER_STATUS.COMPLETED]: ['close', 'review'],
    [ORDER_STATUS.DISPUTING]: ['provideEvidence']
  },
  acceptor: {
    [ORDER_STATUS.PENDING]: ['accept'],
    [ORDER_STATUS.ACCEPTED]: ['start', 'cancel'],
    [ORDER_STATUS.IN_PROGRESS]: ['arrive'],
    [ORDER_STATUS.DISPUTING]: ['provideEvidence']
  },
  admin: {
    '*': ['cancel', 'refund', 'close', 'mediateDispute']
  }
}

export function canTransition(fromStatus, toStatus) {
  if (typeof fromStatus !== 'string') return false
  const allowedTransitions = STATUS_TRANSITIONS[fromStatus]
  if (!allowedTransitions) return false
  return allowedTransitions.includes(toStatus)
}

export function getStatusStep(status) {
  return STATUS_STEP_MAP[status] ?? 0
}

export function getAvailableActions(status, role) {
  if (role === 'admin' && ROLE_ACTIONS.admin['*']) {
    return ROLE_ACTIONS.admin['*']
  }
  const roleActions = ROLE_ACTIONS[role]?.[status] || []
  return roleActions
}

export function isValidStatus(status) {
  return Object.values(ORDER_STATUS).includes(status)
}

export function getNextStatuses(currentStatus) {
  return STATUS_TRANSITIONS[currentStatus] || []
}

export function isFinalStatus(status) {
  return [
    ORDER_STATUS.COMPLETED,
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.REFUNDED,
    ORDER_STATUS.CLOSED
  ].includes(status)
}
