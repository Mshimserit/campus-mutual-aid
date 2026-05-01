import { defineStore } from 'pinia'
import { orderService } from '@/services/order-service'
import { canTransition, ORDER_STATUS } from '@/utils/status-machine'
import { handleError, ErrorTypes, createAppError } from '@/utils/error-handler'
import * as storage from '@/utils/storage'
import { useUserStore } from '@/stores/user-store'

const STORAGE_KEY = 'campus_orders'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: storage.get(STORAGE_KEY, []),
    filters: { type: 'all', campus: '' },
    loading: false,
    error: null,
    currentPage: 1,
    hasMore: true,
    pageSize: 10
  }),

  getters: {
    pendingOrders: (state) => state.orders.filter(o => o.status === ORDER_STATUS.PENDING),
    inProgressOrders: (state) => state.orders.filter(o => o.status === ORDER_STATUS.IN_PROGRESS),
    completedOrders: (state) => state.orders.filter(o => o.status === ORDER_STATUS.COMPLETED),
    getOrderById: (state) => (id) => {
      const order = state.orders.find(o => o.id === id)
      return order ? JSON.parse(JSON.stringify(order)) : null
    },
    filteredOrders: (state) => (filter) => {
      const userStore = useUserStore()
      const currentUserId = userStore.userInfo?.id

      let result = []
      switch (filter) {
        case 'pending':
          result = state.orders.filter(o => o.paid && o.status === ORDER_STATUS.PENDING && !o.accepted)
          break
        case 'myPublished':
          result = state.orders.filter(o => o.paid && o.publisherId === currentUserId)
          break
        case 'myHelped':
          result = state.orders.filter(o => o.paid && o.acceptorId === currentUserId)
          break
        default:
          result = state.orders.filter(o => o.paid)
          break
      }
      return JSON.parse(JSON.stringify(result))
    }
  },

  actions: {
    setLoading(value) {
      this.loading = value
    },

    clearError() {
      this.error = null
    },

    saveToStorage() {
      const plainOrders = JSON.parse(JSON.stringify(this.orders))
      storage.set(STORAGE_KEY, plainOrders)
    },

    async loadOrders({ filter = 'all', page = 1, refresh = false } = {}) {
      this.loading = true
      this.error = null

      try {
        if (refresh) {
          this.currentPage = 1
          this.hasMore = true
          this.orders = []
          storage.remove(STORAGE_KEY)
        }

        const result = await orderService.getOrders({ filter, page, pageSize: this.pageSize })

        const data = result.data ? result.data : result
        const plainData = JSON.parse(JSON.stringify(data))

        if (result.data) {
          if (page === 1) {
            this.orders = plainData
          } else {
            this.orders = [...this.orders, ...plainData]
          }
          this.hasMore = plainData.length >= this.pageSize
        } else {
          this.orders = plainData
          this.hasMore = false
        }

        this.saveToStorage()
        return JSON.parse(JSON.stringify(this.orders))
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadOrderDetail(orderId) {
      this.loading = true
      try {
        const order = await orderService.getOrderDetail(orderId)
        if (order) {
          const plainOrder = JSON.parse(JSON.stringify(order))
          const index = this.orders.findIndex(o => o.id === orderId)
          if (index >= 0) {
            this.orders[index] = plainOrder
          } else {
            this.orders.unshift(plainOrder)
          }
          this.saveToStorage()
        }
        return JSON.parse(JSON.stringify(order))
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      } finally {
        this.loading = false
      }
    },

    async createOrder(orderData) {
      this.loading = true
      try {
        const newOrder = await orderService.createOrder(orderData)
        const plainOrder = JSON.parse(JSON.stringify(newOrder))
        this.orders.unshift(plainOrder)
        this.saveToStorage()
        return JSON.parse(JSON.stringify(newOrder))
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      } finally {
        this.loading = false
      }
    },

    async acceptOrder(orderId, acceptorInfo) {
      this.loading = true
      try {
        const order = this.orders.find(item => item.id === orderId)
        if (!order) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '订单不存在')
        }

        if (!canTransition(order.status, ORDER_STATUS.ACCEPTED)) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '当前状态无法接单')
        }

        await orderService.acceptOrder(orderId)

        order.status = ORDER_STATUS.IN_PROGRESS
        order.accepted = true
        order.acceptorId = acceptorInfo?.id || ''
        order.acceptorNickname = acceptorInfo?.nickname || '接单人'

        this.saveToStorage()
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateOrderStatus(orderId, newStatus) {
      this.loading = true
      try {
        const order = this.orders.find(item => item.id === orderId)
        if (!order) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '订单不存在')
        }

        if (!canTransition(order.status, newStatus)) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, `不允许从 ${order.status} 转换到 ${newStatus}`)
        }

        const statusActions = {
          [ORDER_STATUS.CANCELLED]: () => orderService.cancelOrder(orderId),
          [ORDER_STATUS.COMPLETED]: () => orderService.confirmOrder(orderId),
          [ORDER_STATUS.IN_PROGRESS]: () => orderService.startOrder(orderId),
          [ORDER_STATUS.WAITING_CONFIRM]: () => orderService.deliverOrder(orderId),
          [ORDER_STATUS.DISPUTING]: () => orderService.disputeOrder(orderId)
        }

        if (statusActions[newStatus]) {
          await statusActions[newStatus]()
        }

        order.status = newStatus
        this.saveToStorage()
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      } finally {
        this.loading = false
      }
    },

    async payOrder(orderId, paymentInfo) {
      this.loading = true
      try {
        const result = await orderService.payOrder(orderId, paymentInfo)
        const order = this.orders.find(o => o.id === orderId)
        if (order) {
          order.paid = true
          order.status = ORDER_STATUS.PENDING
        }
        this.saveToStorage()
        return result
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadMoreOrders(filter) {
      if (this.loading || !this.hasMore) return

      this.currentPage += 1
      await this.loadOrders({ filter, page: this.currentPage })
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    clearOrders() {
      this.orders = []
      this.currentPage = 1
      this.hasMore = true
      storage.remove(STORAGE_KEY)
      storage.remove('mock_orders')
    }
  }
})
