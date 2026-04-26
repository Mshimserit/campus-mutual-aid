import { defineStore } from 'pinia'
import { mockWallet } from '@/mock/wallet'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    balance: mockWallet.balance,
    weekIncome: mockWallet.weekIncome,
    monthIncome: mockWallet.monthIncome,
    totalIncome: mockWallet.totalIncome,
    frozenAmount: 0
  }),

  getters: {
    withdrawable: (state) => state.balance
  },

  actions: {
    updateBalance(amount) {
      this.balance += amount
    },

    updateIncome(week, month, total) {
      this.weekIncome = week
      this.monthIncome = month
      this.totalIncome = total
    },

    withdraw(amount) {
      if (this.balance >= amount) {
        this.balance -= amount
      }
    },

    freezeAmount(amount) {
      this.balance -= amount
      this.frozenAmount += amount
    },

    unfreezeAmount(amount) {
      this.frozenAmount -= amount
      this.balance += amount
    }
  }
})
