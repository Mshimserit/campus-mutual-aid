import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockWallet, mockTransactions } from '@/mock/wallet'

export const useWalletStore = defineStore('wallet', () => {
  const wallet = ref({ ...mockWallet })
  const transactions = ref([...mockTransactions])

  const balance = computed(() => wallet.value.balance)
  const withdrawable = computed(() => wallet.value.withdrawable)
  const frozen = computed(() => wallet.value.frozen)
  const totalIncome = computed(() => wallet.value.totalIncome)
  const totalExpense = computed(() => wallet.value.totalExpense)
  const todayWithdrawals = computed(() => wallet.value.todayWithdrawals)
  const canWithdraw = computed(() => withdrawable.value > 0 && todayWithdrawals.value < 3)
  const canMutual = computed(() => balance.value > 0)
  const withdrawalLimit = computed(() => withdrawable.value)

  const transactionStats = computed(() => {
    return {
      income: transactions.value.filter(t => t.type === 'income').length,
      expense: transactions.value.filter(t => t.type === 'expense').length,
      withdraw: transactions.value.filter(t => t.type === 'withdraw').length,
      reward: transactions.value.filter(t => t.type === 'reward').length
    }
  })

  async function recharge(amount, method = 'wechat') {
    try {
      wallet.value.balance += amount
      wallet.value.withdrawable += amount
      wallet.value.totalIncome += amount
      const transaction = {
        id: 'txn_' + Date.now(),
        type: 'recharge',
        amount,
        balance: wallet.value.balance,
        description: `充值 ${amount} 元`,
        status: 'success',
        time: new Date().toLocaleString('zh-CN')
      }
      transactions.value.unshift(transaction)
      mockWallet.balance = wallet.value.balance
      mockWallet.withdrawable = wallet.value.withdrawable
      mockWallet.totalIncome = wallet.value.totalIncome
      mockTransactions.unshift(transaction)
      return { success: true }
    } catch (e) {
      return { success: false, error: e }
    }
  }

  async function withdraw(amount) {
    try {
      if (amount > withdrawable.value) {
        return { success: false, error: '余额不足' }
      }
      wallet.value.balance -= amount
      wallet.value.withdrawable -= amount
      wallet.value.totalExpense += amount
      wallet.value.todayWithdrawals++
      const transaction = {
        id: 'txn_' + Date.now(),
        type: 'withdraw',
        amount,
        balance: wallet.value.balance,
        description: `提现 ${amount} 元`,
        status: 'pending',
        time: new Date().toLocaleString('zh-CN')
      }
      transactions.value.unshift(transaction)
      mockWallet.balance = wallet.value.balance
      mockWallet.withdrawable = wallet.value.withdrawable
      mockWallet.totalExpense = wallet.value.totalExpense
      mockWallet.todayWithdrawals = wallet.value.todayWithdrawals
      mockTransactions.unshift(transaction)
      return { success: true }
    } catch (e) {
      return { success: false, error: e }
    }
  }

  function getTransactionById(id) {
    return transactions.value.find(t => t.id === id)
  }

  function getTransactionsByType(type) {
    return transactions.value.filter(t => t.type === type)
  }

  function getTransactionsByStatus(status) {
    return transactions.value.filter(t => t.status === status)
  }

  return {
    wallet, transactions,
    balance, withdrawable, frozen, totalIncome, totalExpense,
    todayWithdrawals, canWithdraw, canMutual, withdrawalLimit, transactionStats,
    recharge, withdraw,
    getTransactionById, getTransactionsByType, getTransactionsByStatus
  }
})
