import * as storage from '@/utils/storage.js'

const MOCK_STORAGE_KEY = 'mock_messages'

const DEFAULT_MESSAGES = [
  { id: '1', title: '接单通知', content: '您有一笔新的订单已被接受', type: 'order', read: false, createTime: '2026-04-17 18:00' },
  { id: '2', title: '系统消息', content: '欢迎使用校园互助平台！请遵守平台规则。', type: 'system', read: true, createTime: '2026-04-17 17:00' },
  { id: '3', title: '评论通知', content: '您的帖子收到一条新评论', type: 'comment', read: false, createTime: '2026-04-17 16:30' }
]

function getMessages() {
  return storage.get(MOCK_STORAGE_KEY, DEFAULT_MESSAGES)
}

function saveMessages(messages) {
  storage.set(MOCK_STORAGE_KEY, messages)
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const messageMock = {
  async getMessages({ page = 1, type = 'all' } = {}) {
    await delay(250)
    let messages = getMessages()

    if (type !== 'all') {
      messages = messages.filter(m => m.type === type)
    }

    return {
      data: messages,
      total: messages.length,
      page
    }
  },

  async getUnreadCount() {
    await delay(150)
    const count = getMessages().filter(m => !m.read).length
    return { count }
  },

  async markAsRead(id) {
    await delay(200)
    const messages = getMessages()
    const msg = messages.find(m => m.id === id)
    if (msg) {
      msg.read = true
      saveMessages(messages)
    }
    return { success: true }
  },

  async markAllAsRead() {
    await delay(300)
    const messages = getMessages().map(m => ({ ...m, read: true }))
    saveMessages(messages)
    return { success: true }
  },

  async deleteMessage(id) {
    await delay(200)
    const messages = getMessages().filter(m => m.id !== id)
    saveMessages(messages)
    return { success: true }
  }
}
