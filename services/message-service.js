import { mockMessages } from '@/mock/message'
import { USE_MOCK } from '@/config'
import { post } from '@/utils/request'

export const messageService = {
  async getMessages() {
    if (USE_MOCK) {
      await delay(200)
      return mockMessages
    }
    return post('/api/messages')
  },

  async getUnreadCount() {
    if (USE_MOCK) {
      const count = mockMessages.filter(m => !m.read).length
      return count
    }
    return post('/api/messages/unread')
  },

  async markAllRead() {
    if (USE_MOCK) {
      await delay(100)
      mockMessages.forEach(m => m.read = true)
      return { success: true }
    }
    return post('/api/messages/read-all')
  },

  async deleteMessage(id) {
    if (USE_MOCK) {
      await delay(100)
      return { success: true }
    }
    return post(`/api/messages/${id}/delete`)
  }
}
