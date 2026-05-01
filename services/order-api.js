import { post, get } from '@/utils/request'

export const orderApi = {
  async getOrders({ filter = 'all', page = 1, pageSize = 10 } = {}) {
    return get('/api/orders', { filter, page, pageSize })
  },

  async getOrderDetail(id) {
    return get(`/api/orders/${id}`)
  },

  async createOrder(data) {
    return post('/api/orders', data)
  },

  async acceptOrder(id) {
    return post(`/api/orders/${id}/accept`)
  },

  async cancelOrder(id, reason = '') {
    return post(`/api/orders/${id}/cancel`, { reason })
  },

  async confirmOrder(id) {
    return post(`/api/orders/${id}/confirm`)
  },

  async deliverOrder(id) {
    return post(`/api/orders/${id}/deliver`)
  },

  async payOrder(id, paymentInfo) {
    return post(`/api/orders/${id}/pay`, paymentInfo)
  },

  async startOrder(id) {
    return post(`/api/orders/${id}/start`)
  },

  async arriveOrder(id) {
    return post(`/api/orders/${id}/arrive`)
  },

  async disputeOrder(id, reason) {
    return post(`/api/orders/${id}/dispute`, { reason })
  },

  async refundOrder(id, reason) {
    return post(`/api/orders/${id}/refund`, { reason })
  },

  async getMyOrders(type = 'all', page = 1) {
    return get('/api/orders/my', { type, page })
  }
}