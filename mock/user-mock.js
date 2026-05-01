import { mockUser } from './user.js'
import * as storage from '@/utils/storage.js'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const userMock = {
  async login(username, password) {
    await delay(400)
    
    if (username === mockUser.username && password === mockUser.password) {
      const { password: pwd, ...userInfo } = mockUser
      storage.set('userInfo', userInfo)
      return { success: true, user: userInfo, token: 'mock_token_' + Date.now() }
    }
    
    throw new Error('用户名或密码错误')
  },

  async register(data) {
    await delay(500)
    return { success: true, userId: 'new_user_' + Date.now() }
  },

  async logout() {
    await delay(200)
    storage.remove('userInfo')
    return { success: true }
  },

  async getProfile() {
    await delay(200)
    const userInfo = storage.get('userInfo', mockUser)
    return userInfo
  },

  async updateProfile(data) {
    await delay(300)
    const currentUser = storage.get('userInfo', mockUser)
    const updatedUser = { ...currentUser, ...data }
    storage.set('userInfo', updatedUser)
    return { success: true, user: updatedUser }
  },

  async changePassword(oldPassword, newPassword) {
    await delay(300)
    if (oldPassword === mockUser.password) {
      return { success: true }
    }
    throw new Error('原密码错误')
  }
}