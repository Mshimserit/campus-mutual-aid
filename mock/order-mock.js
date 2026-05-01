import * as storage from '@/utils/storage.js'

const DEFAULT_MOCK_ORDERS = [
  {
    id: 'e2026041717493264',
    orderNo: 'e2026041717493264',
    description: '北区两个小快递送到南9',
    helpTime: '2026-04-17 20:00',
    campus: '江宁校区',
    amount: 5,
    commission: 4.5,
    phone: '187****8429',
    publisherId: 'user002',
    publisherNickname: '神秘同学1535122561',
    publisherAvatar: '/static/logo.png',
    acceptorId: '',
    acceptorNickname: '',
    status: 'PENDING',
    paid: true,
    accepted: false,
    createTime: '2026-04-17 17:49'
  },
  {
    id: 'e2026041716582315',
    orderNo: 'e2026041716582315',
    description: '代取南门外卖到宿舍3栋502',
    helpTime: '2026-04-17 18:30',
    campus: '江宁校区',
    amount: 3,
    commission: 2.7,
    phone: '138****5678',
    publisherId: 'user003',
    publisherNickname: '神秘同学9876543210',
    publisherAvatar: '/static/logo.png',
    acceptorId: 'user001',
    acceptorNickname: '神秘同学2054826543',
    status: 'IN_PROGRESS',
    paid: true,
    accepted: true,
    createTime: '2026-04-17 16:58'
  },
  {
    id: 'e2026041715421189',
    orderNo: 'e2026041715421189',
    description: '帮忙打印50页资料，A4双面',
    helpTime: '2026-04-18 10:00',
    campus: '幕府校区',
    amount: 10,
    commission: 9,
    phone: '159****1234',
    publisherId: 'user001',
    publisherNickname: '神秘同学2054826543',
    publisherAvatar: '/static/logo.png',
    acceptorId: 'user004',
    acceptorNickname: '神秘同学628190',
    status: 'WAITING_CONFIRM',
    paid: true,
    accepted: true,
    createTime: '2026-04-17 15:42'
  },
  {
    id: 'e2026041714315678',
    orderNo: 'e2026041714315678',
    description: '图书馆三楼占座，需要靠窗位置',
    helpTime: '2026-04-18 08:00',
    campus: '江宁校区',
    amount: 4,
    commission: 3.6,
    phone: '186****9012',
    publisherId: 'user005',
    publisherNickname: '神秘同学1122334455',
    publisherAvatar: '/static/logo.png',
    acceptorId: '',
    acceptorNickname: '',
    status: 'PENDING',
    paid: true,
    accepted: false,
    createTime: '2026-04-17 14:31'
  },
  {
    id: 'e2026041713254890',
    orderNo: 'e2026041713254890',
    description: '帮忙去教务处交一份材料',
    helpTime: '2026-04-17 16:00',
    campus: '江宁校区',
    amount: 6,
    commission: 5.4,
    phone: '177****3456',
    publisherId: 'user006',
    publisherNickname: '神秘同学6677889900',
    publisherAvatar: '/static/logo.png',
    acceptorId: 'user001',
    acceptorNickname: '神秘同学2054826543',
    status: 'COMPLETED',
    paid: true,
    accepted: true,
    createTime: '2026-04-17 13:25'
  }
]

const MOCK_STORAGE_KEY = 'mock_orders'

function getMockOrders() {
  const orders = storage.get(MOCK_STORAGE_KEY, null)
  if (orders) return orders
  const initial = JSON.parse(JSON.stringify(DEFAULT_MOCK_ORDERS))
  storage.set(MOCK_STORAGE_KEY, initial)
  return initial
}

function saveMockOrders(orders) {
  storage.set(MOCK_STORAGE_KEY, orders)
}

function generateId() {
  return 'e' + Date.now() + Math.floor(Math.random() * 1000)
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const ORDER_STATUS = {
  CREATED: 'CREATED',
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  ACCEPTED: 'ACCEPTED',
  WAITING_CONFIRM: 'WAITING_CONFIRM',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REFUNDING: 'REFUNDING',
  ARRIVED: 'ARRIVED',
  DISPUTING: 'DISPUTING',
  TIMEOUT: 'TIMEOUT',
  CLOSED: 'CLOSED',
  REFUNDED: 'REFUNDED',
  PENDING_PAYMENT: 'PENDING_PAYMENT'
}

export const orderMock = {
  async getOrders({ filter = 'all', page = 1, pageSize = 10 } = {}) {
    await delay(300)
    const allOrders = getMockOrders().filter(order => order.paid)

    let filtered = allOrders
    if (filter !== 'all') {
      filtered = allOrders.filter(o => o.status === filter)
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      pageSize
    }
  },

  async getOrderDetail(id) {
    await delay(200)
    const orders = getMockOrders()
    const order = orders.find(o => o.id === id)
    return order || null
  },

  async createOrder(data) {
    await delay(300)
    const orders = getMockOrders()
    const order = {
      ...data,
      id: generateId(),
      orderNo: generateId(),
      commission: (data.amount * 0.9).toFixed(2),
      publisherNickname: '校园用户',
      publisherAvatar: '/static/logo.png',
      publisherId: 'user001',
      acceptorId: '',
      acceptorNickname: '',
      status: ORDER_STATUS.CREATED,
      paid: false,
      accepted: false,
      createTime: new Date().toLocaleString()
    }
    orders.unshift(order)
    saveMockOrders(orders)
    return order
  },

  async acceptOrder(id) {
    await delay(300)
    const orders = getMockOrders()
    const order = orders.find(o => o.id === id)
    if (order) {
      order.status = ORDER_STATUS.IN_PROGRESS
      order.acceptorId = 'user001'
      order.acceptorNickname = '校园用户'
      order.accepted = true
      saveMockOrders(orders)
    }
    return { success: true }
  },

  async cancelOrder(id, reason = '') {
    await delay(300)
    const orders = getMockOrders()
    const order = orders.find(o => o.id === id)
    if (order) {
      order.status = ORDER_STATUS.CANCELLED
      saveMockOrders(orders)
    }
    return { success: true, reason }
  },

  async confirmOrder(id) {
    await delay(300)
    const orders = getMockOrders()
    const order = orders.find(o => o.id === id)
    if (order) {
      order.status = ORDER_STATUS.COMPLETED
      saveMockOrders(orders)
    }
    return { success: true }
  },

  async deliverOrder(id) {
    await delay(300)
    const orders = getMockOrders()
    const order = orders.find(o => o.id === id)
    if (order) {
      order.status = ORDER_STATUS.WAITING_CONFIRM
      saveMockOrders(orders)
    }
    return { success: true }
  },

  async payOrder(id, paymentInfo = {}) {
    await delay(500)
    const orders = getMockOrders()
    const order = orders.find(o => o.id === id)
    if (order) {
      order.paid = true
      order.status = ORDER_STATUS.PENDING
      saveMockOrders(orders)
    }
    return { success: true, paymentId: 'pay_' + Date.now() }
  },

  async startOrder(id) {
    await delay(300)
    const orders = getMockOrders()
    const order = orders.find(o => o.id === id)
    if (order) {
      order.status = ORDER_STATUS.IN_PROGRESS
      saveMockOrders(orders)
    }
    return { success: true }
  },

  async arriveOrder(id) {
    await delay(300)
    const orders = getMockOrders()
    const order = orders.find(o => o.id === id)
    if (order) {
      order.status = ORDER_STATUS.ARRIVED
      saveMockOrders(orders)
    }
    return { success: true }
  },

  async disputeOrder(id, reason) {
    await delay(300)
    const orders = getMockOrders()
    const order = orders.find(o => o.id === id)
    if (order) {
      order.status = ORDER_STATUS.DISPUTING
      saveMockOrders(orders)
    }
    return { success: true, reason }
  },

  async refundOrder(id, reason) {
    await delay(400)
    const orders = getMockOrders()
    const order = orders.find(o => o.id === id)
    if (order) {
      order.status = ORDER_STATUS.REFUNDING
      saveMockOrders(orders)
    }
    return { success: true, reason }
  },

  async getMyOrders(type = 'all', page = 1) {
    await delay(250)
    const allOrders = getMockOrders()
    let filtered = allOrders

    if (type === 'published') {
      filtered = allOrders.filter(o => o.publisherId === 'user001')
    } else if (type === 'accepted') {
      filtered = allOrders.filter(o => o.acceptorId === 'user001')
    }

    return {
      data: filtered,
      total: filtered.length,
      page
    }
  }
}
