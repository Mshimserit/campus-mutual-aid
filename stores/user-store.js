import { defineStore } from 'pinia'
import { userService } from '@/services/user-service'
import * as storage from '@/utils/storage'
import { ROLES, hasPermission, hasAllPermissions, hasAnyPermission, getPermissionsByRole, isAdmin } from '@/utils/rbac'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: storage.get('userInfo', null),
    isLoggedIn: !!storage.get('userInfo', null),
    loginError: '',
    loading: false
  }),

  getters: {
    userRole: (state) => state.userInfo?.role || ROLES.STUDENT,
    isStudent: (state) => state.userInfo?.role === ROLES.STUDENT,
    isAdmin: (state) => isAdmin(state.userInfo?.role),
    permissions: (state) => getPermissionsByRole(state.userInfo?.role || ROLES.STUDENT)
  },

  actions: {
    setUserInfo(user) {
      this.userInfo = { ...this.userInfo, ...user }
      storage.set('userInfo', this.userInfo)
    },

    async login(username, password) {
      this.loginError = ''
      this.loading = true

      try {
        if (!username || !password) {
          this.loginError = '请输入用户名和密码'
          return false
        }

        const result = await userService.login(username, password)
        if (result.success) {
          this.userInfo = result.user
          this.isLoggedIn = true
          storage.set('userInfo', result.user)
          return true
        }
      } catch (error) {
        this.loginError = error.message || '登录失败'
      } finally {
        this.loading = false
      }

      return false
    },

    async logout() {
      try {
        await userService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      }
      
      this.userInfo = null
      this.isLoggedIn = false
      this.loginError = ''
      storage.remove('userInfo')

      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/login/login',
          fail: () => {
            uni.reLaunch({
              url: '/pages/login/login'
            })
          }
        })
      }, 100)
    },

    async fetchProfile() {
      try {
        const userInfo = await userService.getProfile()
        this.userInfo = userInfo
        storage.set('userInfo', userInfo)
      } catch (error) {
        console.error('Fetch profile error:', error)
      }
    },

    async updateProfile(data) {
      try {
        const result = await userService.updateProfile(data)
        if (result.success && result.user) {
          this.userInfo = result.user
          storage.set('userInfo', result.user)
        }
        return result
      } catch (error) {
        console.error('Update profile error:', error)
        throw error
      }
    },

    hasPermission(permission) {
      return hasPermission(this.userRole, permission)
    },

    hasAllPermissions(permissions) {
      return hasAllPermissions(this.userRole, permissions)
    },

    hasAnyPermission(permissions) {
      return hasAnyPermission(this.userRole, permissions)
    },

    clearError() {
      this.loginError = ''
    }
  }
})
