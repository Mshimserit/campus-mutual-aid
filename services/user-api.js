import { post, get, put } from '@/utils/request'

export const userApi = {
  async login(username, password) {
    return post('/api/auth/login', { username, password })
  },

  async register(data) {
    return post('/api/auth/register', data)
  },

  async logout() {
    return post('/api/auth/logout')
  },

  async getProfile() {
    return get('/api/user/profile')
  },

  async updateProfile(data) {
    return put('/api/user/profile', data)
  },

  async changePassword(oldPassword, newPassword) {
    return post('/api/user/password', { oldPassword, newPassword })
  }
}