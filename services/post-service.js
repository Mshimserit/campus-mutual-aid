import { mockPosts, mockHotList } from '@/mock/post'
import { USE_MOCK } from '@/config'
import { post } from '@/utils/request'

export const postService = {
  async getPosts({ type = 'all', page = 1 } = {}) {
    if (USE_MOCK) {
      await delay(300)
      return mockPosts
    }
    return post('/api/posts', { type, page })
  },

  async getHotList() {
    if (USE_MOCK) {
      await delay(200)
      return mockHotList
    }
    return post('/api/posts/hot')
  },

  async createPost(data) {
    if (USE_MOCK) {
      await delay(300)
      return { success: true, id: 'p_' + Date.now() }
    }
    return post('/api/posts', data)
  },

  async likePost(id) {
    if (USE_MOCK) {
      await delay(100)
      return { success: true }
    }
    return post(`/api/posts/${id}/like`)
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
