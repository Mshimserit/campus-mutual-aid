import { USE_MOCK } from '@/config'
import { post } from '@/utils/request'
import { useWalletStore } from '@/stores/wallet-store'
import { useOrderStore } from '@/stores/order-store'

export const paymentService = {
  async createPayment(orderId, amount) {
    if (USE_MOCK) {
      await delay(500)
      return { success: true, payId: 'pay_' + Date.now() }
    }
    return post('/api/payment/create', { orderId, amount })
  },

  async mockWxPay(payRecord) {
    if (USE_MOCK) {
      await delay(800)
      return { success: true }
    }
    return post('/api/payment/wxpay', payRecord)
  },

  async freezeAmount(amount) {
    if (USE_MOCK) {
      useWalletStore().updateBalance(-amount)
      return { success: true }
    }
    return post('/api/payment/freeze', { amount })
  },

  async settleAmount(orderId, amount) {
    if (USE_MOCK) {
      useWalletStore().updateBalance(amount)
      useOrderStore().updateOrderStatus(orderId, 'COMPLETED')
      return { success: true }
    }
    return post('/api/payment/settle', { orderId, amount })
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
