import { defineStore } from 'pinia'
import { mockUser } from '@/mock/user'
import * as storage from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: storage.get('userInfo', mockUser),
    isLoggedIn: !!storage.get('userInfo', null)
  }),

  actions: {
    setUserInfo(user) {
      this.userInfo = { ...this.userInfo, ...user }
      storage.set('userInfo', this.userInfo)
    },

    login(user) {
      this.userInfo = user
      this.isLoggedIn = true
      storage.set('userInfo', user)
    },

    logout() {
      this.userInfo = null
      this.isLoggedIn = false
      storage.remove('userInfo')
    }
  }
})
