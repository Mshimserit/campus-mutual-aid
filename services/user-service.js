import { mockUser } from '@/mock/user'
import { USE_MOCK } from '@/config'
import { post } from '@/utils/request'
import { useUserStore } from '@/stores/user-store'

export const userService = {
  async getUserInfo() {
    if (USE_MOCK) {
      return mockUser
    }
    return post('/api/user/info')
  },

  async updateUserInfo(data) {
    if (USE_MOCK) {
      useUserStore().setUserInfo(data)
      return { success: true }
    }
    return post('/api/user/update', data)
  },

  async login(code) {
    if (USE_MOCK) {
      useUserStore().login(mockUser)
      return { success: true, user: mockUser }
    }
    return post('/api/user/login', { code })
  }
}
