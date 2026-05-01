import { post, get, put, del } from '@/utils/request'

export const messageApi = {
  async getMessages({ page = 1, type = 'all' } = {}) {
    return get('/api/messages', { page, type })
  },

  async getUnreadCount() {
    return get('/api/messages/unread')
  },

  async markAsRead(id) {
    return put(`/api/messages/${id}/read`)
  },

  async markAllAsRead() {
    return put('/api/messages/read-all')
  },

  async deleteMessage(id) {
    return del(`/api/messages/${id}`)
  }
}