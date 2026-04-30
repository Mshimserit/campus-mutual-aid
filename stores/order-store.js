import { defineStore } from 'pinia'
import { mockOrders } from '@/mock/order'
import { canTransition } from '@/utils/status-machine'
import { handleError, ErrorTypes, createAppError } from '@/utils/error-handler'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [...mockOrders],
    filters: { type: 'all', campus: '' },
    loading: false,
    error: null
  }),

  getters: {
    pendingOrders: (state) => state.orders.filter(o => o.status === 'PENDING'),
    inProgressOrders: (state) => state.orders.filter(o => o.status === 'IN_PROGRESS'),
    completedOrders: (state) => state.orders.filter(o => o.status === 'COMPLETED'),
    getOrderById: (state) => (id) => state.orders.find(o => o.id === id)
  },

  actions: {
    setLoading(value) {
      this.loading = value
    },

    clearError() {
      this.error = null
    },

    updateOrderStatus(orderId, newStatus) {
      try {
        const order = this.orders.find(item => item.id === orderId)
        if (!order) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '订单不存在')
        }

        if (!canTransition(order.status, newStatus)) {
          throw createAppError(
            ErrorTypes.BUSINESS_ERROR,
            `不允许从 ${order.status} 转换到 ${newStatus}`
          )
        }

        order.status = newStatus
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      }
    },

    acceptOrder(orderId, acceptorInfo) {
      try {
        const order = this.orders.find(item => item.id === orderId)
        if (!order) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '订单不存在')
        }

        if (order.status !== 'PENDING') {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '订单已被接单')
        }

        if (!order.paid) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '订单未支付')
        }

        order.status = 'IN_PROGRESS'
        order.accepted = true
        order.acceptorId = acceptorInfo?.id || ''
        order.acceptorNickname = acceptorInfo?.nickname || '接单人'
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      }
    },

    markOrderAsPaid(orderId) {
      try {
        const order = this.orders.find(item => item.id === orderId)
        if (!order) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '订单不存在')
        }

        order.paid = true
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      }
    },

    addOrder(order) {
      try {
        if (!order) {
          throw createAppError(ErrorTypes.VALIDATION_ERROR, '订单数据不能为空')
        }

        this.orders.unshift(order)
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      }
    },

    setFilters(filters) {
      try {
        this.filters = { ...this.filters, ...filters }
      } catch (error) {
        this.error = error.message
        console.error('[OrderStore] Set filters failed:', error)
      }
    },

    removeOrder(orderId) {
      try {
        const index = this.orders.findIndex(item => item.id === orderId)
        if (index === -1) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '订单不存在')
        }

        this.orders.splice(index, 1)
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      }
    }
  }
})
