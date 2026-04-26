import { defineStore } from 'pinia'
import { mockUsers } from '@/mock/user'
import * as storage from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: storage.get('userInfo', null),
    isLoggedIn: !!storage.get('userInfo', null),
    loginError: ''
  }),

  getters: {
    userRole: (state) => state.userInfo?.role || 'guest',
    isAdmin: (state) => state.userInfo?.role === 'admin',
    isRunner: (state) => state.userInfo?.role === 'runner',
    isStudent: (state) => state.userInfo?.role === 'student'
  },

  actions: {
    setUserInfo(user) {
      this.userInfo = { ...this.userInfo, ...user }
      storage.set('userInfo', this.userInfo)
    },

    async login(username, password) {
      this.loginError = ''

      if (!username || !password) {
        this.loginError = '请输入用户名和密码'
        return false
      }

      const user = mockUsers.find(u => u.username === username && u.password === password)

      if (!user) {
        this.loginError = '用户名或密码错误'
        return false
      }

      const { password: pwd, ...userInfo } = user

      this.userInfo = userInfo
      this.isLoggedIn = true
      storage.set('userInfo', userInfo)

      return true
    },

    logout() {
      this.userInfo = null
      this.isLoggedIn = false
      this.loginError = ''
      storage.remove('userInfo')

      uni.reLaunch({
        url: '/pages/login/login'
      })
    },

    clearError() {
      this.loginError = ''
    }
  }
})
