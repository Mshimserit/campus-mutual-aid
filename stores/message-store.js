import { defineStore } from 'pinia'
import { messageService } from '@/services/message-service'
import { handleError, ErrorTypes, createAppError } from '@/utils/error-handler'
import * as storage from '@/utils/storage'

const STORAGE_KEY = 'campus_messages'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: storage.get(STORAGE_KEY, []),
    loading: false,
    error: null
  }),

  getters: {
    unreadCount: (state) => state.messages.filter(m => !m.read).length,
    systemMessages: (state) => state.messages.filter(m => m.type === 'system'),
    orderMessages: (state) => state.messages.filter(m => m.type === 'order'),
    commentMessages: (state) => state.messages.filter(m => m.type === 'comment'),
    getMessageById: (state) => (id) => state.messages.find(m => m.id === id)
  },

  actions: {
    setLoading(value) {
      this.loading = value
    },

    clearError() {
      this.error = null
    },

    saveToStorage() {
      storage.set(STORAGE_KEY, this.messages)
    },

    async loadMessages({ page = 1, type = 'all' } = {}) {
      this.loading = true
      try {
        const result = await messageService.getMessages({ page, type })
        if (result.data) {
          this.messages = result.data
        } else {
          this.messages = result
        }
        this.saveToStorage()
        return this.messages
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadUnreadCount() {
      try {
        const result = await messageService.getUnreadCount()
        return result.count ?? this.unreadCount
      } catch (error) {
        console.error('[MessageStore] Load unread count failed:', error)
        return this.unreadCount
      }
    },

    async markRead(id) {
      this.loading = true
      try {
        await messageService.markAsRead(id)
        
        const msg = this.messages.find(m => m.id === id)
        if (msg) {
          msg.read = true
          this.saveToStorage()
        }
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: false })
        throw error
      } finally {
        this.loading = false
      }
    },

    async markAllRead() {
      this.loading = true
      try {
        await messageService.markAllAsRead()
        this.messages.forEach(m => m.read = true)
        this.saveToStorage()
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: false })
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeMessage(id) {
      this.loading = true
      try {
        await messageService.deleteMessage(id)
        
        const index = this.messages.findIndex(m => m.id === id)
        if (index >= 0) {
          this.messages.splice(index, 1)
          this.saveToStorage()
        }
        return true
      } catch (error) {
        this.error = error.message
        handleError(error, { showNotification: true })
        throw error
      } finally {
        this.loading = false
      }
    },

    addMessage(msg) {
      if (!msg) {
        throw createAppError(ErrorTypes.VALIDATION_ERROR, '消息数据不能为空')
      }
      this.messages.unshift(msg)
      this.saveToStorage()
      return true
    },

    clearMessages() {
      this.messages = []
      this.saveToStorage()
    }
  }
})
