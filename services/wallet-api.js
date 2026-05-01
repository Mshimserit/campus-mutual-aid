import { post, get } from '@/utils/request'

export const walletApi = {
  async getBalance() {
    return get('/api/wallet/balance')
  },

  async getTransactions({ page = 1, type = 'all' } = {}) {
    return get('/api/wallet/transactions', { page, type })
  },

  async recharge(amount, paymentMethod) {
    return post('/api/wallet/recharge', { amount, paymentMethod })
  },

  async withdraw(amount, accountInfo) {
    return post('/api/wallet/withdraw', { amount, accountInfo })
  }
}