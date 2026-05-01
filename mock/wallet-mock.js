import * as storage from '@/utils/storage.js'

const MOCK_STORAGE_KEY = 'mock_wallet'

const MOCK_TRANSACTIONS = [
  { id: 't001', type: 'income', title: '帮取快递佣金', amount: 5.00, time: '2026-04-30 14:20', balance: 156.50 },
  { id: 't002', type: 'income', title: '代买零食佣金', amount: 3.50, time: '2026-04-30 10:15', balance: 151.50 },
  { id: 't003', type: 'income', title: '打印文件佣金', amount: 8.00, time: '2026-04-29 16:30', balance: 148.00 },
  { id: 't004', type: 'withdraw', title: '提现到微信', amount: -50.00, time: '2026-04-28 09:00', balance: 140.00 },
  { id: 't005', type: 'income', title: '送文件到宿舍佣金', amount: 6.00, time: '2026-04-27 15:45', balance: 190.00 },
  { id: 't006', type: 'income', title: '帮拿外卖佣金', amount: 4.50, time: '2026-04-26 12:10', balance: 184.00 },
  { id: 't007', type: 'withdraw', title: '提现到银行卡', amount: -30.00, time: '2026-04-25 20:30', balance: 179.50 },
  { id: 't008', type: 'income', title: '代排队佣金', amount: 10.00, time: '2026-04-24 08:20', balance: 209.50 },
  { id: 't009', type: 'income', title: '帮借图书佣金', amount: 5.00, time: '2026-04-23 14:00', balance: 199.50 },
  { id: 't010', type: 'refund', title: '订单取消退款', amount: 3.00, time: '2026-04-22 11:30', balance: 194.50 }
]

const DEFAULT_WALLET = { balance: 156.50, weekIncome: 23.00, monthIncome: 89.00, totalIncome: 156.50, transactions: MOCK_TRANSACTIONS }

function getWallet() {
  return storage.get(MOCK_STORAGE_KEY, DEFAULT_WALLET)
}

function saveWallet(wallet) {
  storage.set(MOCK_STORAGE_KEY, wallet)
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const walletMock = {
  async getBalance() {
    await delay(200)
    return { balance: getWallet().balance }
  },

  async getTransactions({ page = 1, type = 'all' } = {}) {
    await delay(300)
    const wallet = getWallet()
    let transactions = wallet.transactions || MOCK_TRANSACTIONS

    if (type !== 'all') {
      transactions = transactions.filter(t => t.type === type)
    }

    return {
      data: transactions,
      total: transactions.length,
      page
    }
  },

  async recharge(amount, paymentMethod) {
    await delay(500)
    const wallet = getWallet()
    wallet.balance += amount
    saveWallet(wallet)
    return { success: true, amount, transactionId: 'tx_' + Date.now() }
  },

  async withdraw(amount, accountInfo) {
    await delay(600)
    const wallet = getWallet()
    if (wallet.balance < amount) {
      throw new Error('余额不足')
    }
    wallet.balance -= amount
    saveWallet(wallet)
    return { success: true, amount, transactionId: 'tx_' + Date.now() }
  }
}
