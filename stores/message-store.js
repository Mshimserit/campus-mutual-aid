import { defineStore } from 'pinia'
import { mockMessages } from '@/mock/message'
import { handleError, ErrorTypes, createAppError } from '@/utils/error-handler'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [...mockMessages],
    loading: false,
    error: null
  }),

  getters: {
    unreadCount: (state) => state.messages.filter(m => !m.read).length,
    systemMessages: (state) => state.messages.filter(m => m.type === 'system'),
    orderMessages: (state) => state.messages.filter(m => m.type === 'order'),
    commentMessages: (state) => state.messages.filter(m => m.type === 'comment')
  },

  actions: {
    setLoading(value) {
      this.loading = value
    },

    clearError() {
      this.error = null
    },

    addMessage(msg) {
      try {
        if (!msg) {
          throw createAppError(ErrorTypes.VALIDATION_ERROR, '消息数据不能为空')
        }
        this.messages.unshift(msg)
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: false })
        throw error
      }
    },

    markRead(id) {
      try {
        const msg = this.messages.find(m => m.id === id)
        if (!msg) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '消息不存在')
        }
        msg.read = true
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: false })
        throw error
      }
    },

    markAllRead() {
      try {
        this.messages.forEach(m => m.read = true)
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: false })
        throw error
      }
    },

    removeMessage(id) {
      try {
        const index = this.messages.findIndex(m => m.id === id)
        if (index === -1) {
          throw createAppError(ErrorTypes.BUSINESS_ERROR, '消息不存在')
        }
        this.messages.splice(index, 1)
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      }
    },

    clearMessages() {
      this.messages = []
    }
  }
})
