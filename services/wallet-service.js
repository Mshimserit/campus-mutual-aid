import { mockWallet } from '@/mock/wallet'
import { USE_MOCK } from '@/config'
import { post } from '@/utils/request'
import { useWalletStore } from '@/stores/wallet-store'

export const walletService = {
  async getWalletInfo() {
    if (USE_MOCK) {
      return mockWallet
    }
    return post('/api/wallet/info')
  },

  async getBills() {
    if (USE_MOCK) {
      await delay(200)
      return mockWallet.bills
    }
    return post('/api/wallet/bills')
  },

  async withdraw(amount) {
    if (USE_MOCK) {
      await delay(500)
      const wallet = useWalletStore()
      wallet.updateBalance(-amount)
      return { success: true }
    }
    return post('/api/wallet/withdraw', { amount })
  },

  async getWithdrawRecords() {
    if (USE_MOCK) {
      return mockWallet.withdrawRecords
    }
    return post('/api/wallet/withdraws')
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
