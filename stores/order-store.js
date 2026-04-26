import { defineStore } from 'pinia'
import { mockOrders } from '@/mock/order'
import { canTransition } from '@/utils/status-machine'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [...mockOrders],
    filters: { type: 'all', campus: '' }
  }),

  actions: {
    updateOrderStatus(orderId, newStatus) {
      const order = this.orders.find(item => item.id === orderId)
      if (order && canTransition(order.status, newStatus)) {
        order.status = newStatus
      }
    },

    acceptOrder(orderId, acceptorInfo) {
      const order = this.orders.find(item => item.id === orderId)
      if (order && order.status === 'PENDING' && order.paid) {
        order.status = 'IN_PROGRESS'
        order.accepted = true
        order.acceptorId = acceptorInfo?.id || ''
        order.acceptorNickname = acceptorInfo?.nickname || '接单人'
      }
    },

    markOrderAsPaid(orderId) {
      const order = this.orders.find(item => item.id === orderId)
      if (order) {
        order.paid = true
      }
    },

    addOrder(order) {
      this.orders.unshift(order)
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    }
  }
})
