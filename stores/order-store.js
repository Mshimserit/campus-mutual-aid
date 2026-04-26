import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockOrders } from '@/mock/order'
import { canTransition, getNextStatus, getStatusColor, getStatusText } from '@/utils/status-machine'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([...mockOrders])
  const currentOrder = ref(null)

  const allOrders = computed(() => orders.value)
  const myPublished = computed(() => orders.value.filter(o => o.role === 'publisher'))
  const myAccepted = computed(() => orders.value.filter(o => o.role === 'runner'))
  const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'))
  const activeOrders = computed(() => orders.value.filter(o => ['accepted', 'running', 'delivered'].includes(o.status)))
  const completedOrders = computed(() => orders.value.filter(o => o.status === 'completed'))
  const cancelledOrders = computed(() => orders.value.filter(o => o.status === 'cancelled'))

  const orderStats = computed(() => {
    return {
      total: orders.value.length,
      pending: pendingOrders.value.length,
      active: activeOrders.value.length,
      completed: completedOrders.value.length,
      cancelled: cancelledOrders.value.length
    }
  })

  function getOrderById(id) {
    return orders.value.find(o => o.id === id)
  }

  function getOrderByStatus(status) {
    return orders.value.filter(o => o.status === status)
  }

  function getOrdersByType(type) {
    return orders.value.filter(o => o.type === type)
  }

  function createOrder(data) {
    const newOrder = {
      id: 'order_' + Date.now(),
      title: data.title,
      description: data.description,
      type: data.type || 'express',
      location: data.location,
      reward: data.reward,
      deadline: data.deadline,
      publisher: data.publisher,
      runner: null,
      status: 'pending',
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN'),
      ...data
    }
    orders.value.unshift(newOrder)
    mockOrders.unshift(newOrder)
    return newOrder
  }

  function acceptOrder(orderId, runner) {
    const order = orders.value.find(o => o.id === orderId)
    if (order && canTransition(order.status, 'accepted')) {
      order.status = 'accepted'
      order.runner = runner
      order.updateTime = new Date().toLocaleString('zh-CN')
      mockOrders.find(o => o.id === orderId).status = 'accepted'
      mockOrders.find(o => o.id === orderId).runner = runner
      return true
    }
    return false
  }

  function updateOrderStatus(orderId, newStatus) {
    const order = orders.value.find(item => item.id === orderId)
    if (order && canTransition(order.status, newStatus)) {
      order.status = newStatus
      order.updateTime = new Date().toLocaleString('zh-CN')
      const mockOrder = mockOrders.find(o => o.id === orderId)
      if (mockOrder) {
        mockOrder.status = newStatus
        mockOrder.updateTime = order.updateTime
      }
      return true
    }
    return false
  }

  function cancelOrder(orderId) {
    return updateOrderStatus(orderId, 'cancelled')
  }

  function confirmDelivery(orderId) {
    return updateOrderStatus(orderId, 'completed')
  }

  function setCurrentOrder(order) {
    currentOrder.value = order
  }

  function clearCurrentOrder() {
    currentOrder.value = null
  }

  return {
    orders, currentOrder,
    allOrders, myPublished, myAccepted, pendingOrders, activeOrders, completedOrders, cancelledOrders, orderStats,
    getOrderById, getOrderByStatus, getOrdersByType,
    createOrder, acceptOrder, updateOrderStatus, cancelOrder, confirmDelivery,
    setCurrentOrder, clearCurrentOrder
  }
})
