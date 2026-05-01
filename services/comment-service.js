import { USE_MOCK } from '@/config'
import { post } from '@/utils/request'

export const commentService = {
  async getCommentsByUser(userId, page = 1) {
    if (USE_MOCK) {
      await delay(300)
      return { success: true, data: [], total: 0 }
    }
    return post('/api/comments/user', { userId, page })
  },

  async deleteComment(id) {
    if (USE_MOCK) {
      await delay(200)
      return { success: true }
    }
    return post(`/api/comments/${id}/delete`)
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
