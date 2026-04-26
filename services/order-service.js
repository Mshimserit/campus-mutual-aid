import { useOrderStore } from '@/stores/order-store'
import { USE_MOCK } from '@/config'
import { post } from '@/utils/request'

function generateId() {
  return 'e' + Date.now() + Math.floor(Math.random() * 1000)
}

export const orderService = {
  async getOrders({ filter = 'all', page = 1 } = {}) {
    if (USE_MOCK) {
      await delay(300)
      const allOrders = useOrderStore().orders
      return allOrders.filter(order => order.paid)
    }
    return post('/api/orders', { filter, page })
  },

  async getOrderDetail(id) {
    if (USE_MOCK) {
      await delay(200)
      const order = useOrderStore().orders.find(o => o.id === id)
      return order || null
    }
    return post(`/api/orders/${id}`)
  },

  async createOrder(data) {
    if (USE_MOCK) {
      await delay(300)
      const order = {
        ...data,
        id: generateId(),
        orderNo: generateId(),
        commission: (data.amount * 0.9).toFixed(2),
        publisherNickname: '神秘同学2054826543',
        publisherAvatar: '/static/logo.png',
        acceptorId: '',
        acceptorNickname: '',
        status: 'PENDING',
        paid: false,
        accepted: false,
        createTime: new Date().toLocaleString()
      }
      useOrderStore().addOrder(order)
      return order
    }
    return post('/api/orders', data)
  },

  async acceptOrder(id) {
    if (USE_MOCK) {
      await delay(300)
      useOrderStore().updateOrderStatus(id, 'IN_PROGRESS')
      return { success: true }
    }
    return post(`/api/orders/${id}/accept`)
  },

  async cancelOrder(id) {
    if (USE_MOCK) {
      await delay(300)
      useOrderStore().updateOrderStatus(id, 'CANCELLED')
      return { success: true }
    }
    return post(`/api/orders/${id}/cancel`)
  },

  async confirmOrder(id) {
    if (USE_MOCK) {
      await delay(300)
      useOrderStore().updateOrderStatus(id, 'COMPLETED')
      return { success: true }
    }
    return post(`/api/orders/${id}/confirm`)
  },

  async deliverOrder(id) {
    if (USE_MOCK) {
      await delay(300)
      useOrderStore().updateOrderStatus(id, 'WAITING_CONFIRM')
      return { success: true }
    }
    return post(`/api/orders/${id}/deliver`)
  },

  async payOrder(id) {
    if (USE_MOCK) {
      await delay(500)
      useOrderStore().markOrderAsPaid(id)
      return { success: true }
    }
    return post(`/api/orders/${id}/pay`)
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
