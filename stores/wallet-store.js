import { defineStore } from 'pinia'
import { mockWallet } from '@/mock/wallet'
import { handleError, ErrorTypes, createAppError } from '@/utils/error-handler'

const MIN_WITHDRAW = 1
const MAX_WITHDRAW_PER_DAY = 3

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    balance: mockWallet.balance,
    weekIncome: mockWallet.weekIncome,
    monthIncome: mockWallet.monthIncome,
    totalIncome: mockWallet.totalIncome,
    frozenAmount: 0,
    withdrawCount: 0,
    loading: false,
    error: null
  }),

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

    updateBalance(amount) {
      try {
        if (typeof amount !== 'number') {
          throw createAppError(ErrorTypes.VALIDATION_ERROR, '金额必须为数字')
        }
        this.balance += amount
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      }
    },

    updateIncome(week, month, total) {
      try {
        this.weekIncome = week
        this.monthIncome = month
        this.totalIncome = total
      } catch (error) {
        this.error = error.message
        console.error('[WalletStore] Update income failed:', error)
      }
    },

    withdraw(amount) {
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

        this.balance -= amount
        this.withdrawCount += 1
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      }
    },

    freezeAmount(amount) {
      try {
        if (amount <= 0) {
          throw createAppError(ErrorTypes.VALIDATION_ERROR, '冻结金额必须大于0')
        }

        if (this.balance < amount) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '余额不足')
        }

        this.balance -= amount
        this.frozenAmount += amount
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      }
    },

    unfreezeAmount(amount) {
      try {
        if (amount <= 0) {
          throw createAppError(ErrorTypes.VALIDATION_ERROR, '解冻金额必须大于0')
        }

        if (this.frozenAmount < amount) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '冻结金额不足')
        }

        this.frozenAmount -= amount
        this.balance += amount
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      }
    },

    resetDailyWithdrawCount() {
      this.withdrawCount = 0
    }
  }
})
