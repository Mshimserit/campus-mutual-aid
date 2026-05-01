import { defineStore } from 'pinia'
import { walletService } from '@/services/wallet-service'
import { handleError, ErrorTypes, createAppError } from '@/utils/error-handler'
import * as storage from '@/utils/storage'

const STORAGE_KEY = 'campus_wallet'
const TRANSACTIONS_STORAGE_KEY = 'campus_wallet_transactions'
const LAST_RESET_DATE_KEY = 'wallet_last_reset_date'
const MIN_WITHDRAW = 1
const MAX_WITHDRAW_PER_DAY = 3

const defaultTransactions = [
  { id: 't001', type: 'income', title: '帮取快递佣金', amount: 5.00, time: '2026-04-30 14:20', balance: 156.50, icon: 'wallet' },
  { id: 't002', type: 'income', title: '代买零食佣金', amount: 3.50, time: '2026-04-30 10:15', balance: 151.50, icon: 'wallet' },
  { id: 't003', type: 'income', title: '打印文件佣金', amount: 8.00, time: '2026-04-29 16:30', balance: 148.00, icon: 'wallet' },
  { id: 't004', type: 'withdraw', title: '提现到微信', amount: -50.00, time: '2026-04-28 09:00', balance: 140.00, icon: 'arrowup', status: 'success' },
  { id: 't005', type: 'income', title: '送文件到宿舍佣金', amount: 6.00, time: '2026-04-27 15:45', balance: 190.00, icon: 'wallet' },
  { id: 't006', type: 'income', title: '帮拿外卖佣金', amount: 4.50, time: '2026-04-26 12:10', balance: 184.00, icon: 'wallet' },
  { id: 't007', type: 'withdraw', title: '提现到银行卡', amount: -30.00, time: '2026-04-25 20:30', balance: 179.50, icon: 'arrowup', status: 'success' },
  { id: 't008', type: 'income', title: '代排队佣金', amount: 10.00, time: '2026-04-24 08:20', balance: 209.50, icon: 'wallet' },
  { id: 't009', type: 'income', title: '帮借图书佣金', amount: 5.00, time: '2026-04-23 14:00', balance: 199.50, icon: 'wallet' },
  { id: 't010', type: 'refund', title: '订单取消退款', amount: 3.00, time: '2026-04-22 11:30', balance: 194.50, icon: 'undo', status: 'success' }
]

function getStoredData() {
  const defaultData = { balance: 156.50, weekIncome: 23.00, monthIncome: 89.00, totalIncome: 156.50 }
  const stored = storage.get(STORAGE_KEY, defaultData)

  if (!storage.get(STORAGE_KEY, null)) {
    storage.set(STORAGE_KEY, defaultData)
    return defaultData
  }

  return stored
}

function getDefaultTransactions() {
  const stored = storage.get(TRANSACTIONS_STORAGE_KEY, null)
  if (!stored) {
    storage.set(TRANSACTIONS_STORAGE_KEY, defaultTransactions)
    return defaultTransactions
  }
  return stored
}

function checkAndResetDailyCount() {
  const today = new Date().toDateString()
  const lastResetDate = storage.get(LAST_RESET_DATE_KEY, null)

  if (lastResetDate !== today) {
    storage.set(LAST_RESET_DATE_KEY, today)
    return 0
  }

  return storage.get(STORAGE_KEY + '_withdraw_count', 0)
}

export const useWalletStore = defineStore('wallet', {
  state: () => {
    const storedData = getStoredData()
    return {
      balance: storedData.balance || 0,
      weekIncome: storedData.weekIncome || 0,
      monthIncome: storedData.monthIncome || 0,
      totalIncome: storedData.totalIncome || 0,
      frozenAmount: 0,
      withdrawCount: checkAndResetDailyCount(),
      transactions: getDefaultTransactions(),
      loading: false,
      error: null
    }
  },

  getters: {
    withdrawable: (state) => state.balance,
    canWithdraw: (state) => state.balance >= MIN_WITHDRAW && state.withdrawCount < MAX_WITHDRAW_PER_DAY
  },

  actions: {
    setLoading(value) {
      this.loading = value
    },

    clearError() {
      this.error = null
    },

    saveToStorage() {
      storage.set(STORAGE_KEY, {
        balance: this.balance,
        weekIncome: this.weekIncome,
        monthIncome: this.monthIncome,
        totalIncome: this.totalIncome
      })
      storage.set(STORAGE_KEY + '_withdraw_count', this.withdrawCount)
    },

    async loadWalletData() {
      this.loading = true
      try {
        const data = await walletService.getBalance()
        this.balance = data.balance
        this.saveToStorage()
        return data
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadTransactions({ page = 1, type = 'all' } = {}) {
      this.loading = true
      try {
        const result = await walletService.getTransactions({ page, type })
        if (result.data) {
          this.transactions = result.data
        } else {
          this.transactions = result
        }
        return this.transactions
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      } finally {
        this.loading = false
      }
    },

    async recharge(amount, paymentMethod) {
      this.loading = true
      try {
        const result = await walletService.recharge(amount, paymentMethod)
        this.balance += amount
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

    async withdraw(amount, accountInfo) {
      this.loading = true
      try {
        if (amount < MIN_WITHDRAW) {
          throw createAppError(ErrorTypes.VALIDATION_ERROR, `最低提现金额为${MIN_WITHDRAW}元`)
        }

        if (this.withdrawCount >= MAX_WITHDRAW_PER_DAY) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, `每日最多提现${MAX_WITHDRAW_PER_DAY}次`)
        }

        if (this.balance < amount) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '余额不足')
        }

        const result = await walletService.withdraw(amount, accountInfo)
        this.balance -= amount
        this.withdrawCount += 1
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

    async freezeAmount(amount) {
      this.loading = true
      try {
        if (amount <= 0) {
          throw createAppError(ErrorTypes.VALIDATION_ERROR, '冻结金额必须大于0')
        }

        if (this.balance < amount) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '余额不足')
        }

        this.balance -= amount
        this.frozenAmount += amount
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

    async unfreezeAmount(amount) {
      this.loading = true
      try {
        if (amount <= 0) {
          throw createAppError(ErrorTypes.VALIDATION_ERROR, '解冻金额必须大于0')
        }

        if (this.frozenAmount < amount) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '冻结金额不足')
        }

        this.frozenAmount -= amount
        this.balance += amount
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

    updateIncome(week, month, total) {
      this.weekIncome = week
      this.monthIncome = month
      this.totalIncome = total
      this.saveToStorage()
    },

    resetDailyWithdrawCount() {
      this.withdrawCount = 0
    }
  }
})
