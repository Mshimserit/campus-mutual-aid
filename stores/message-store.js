import { defineStore } from 'pinia'
import { mockMessages } from '@/mock/message'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [...mockMessages]
  }),

  actions: {
    addMessage(msg) {
      this.messages.unshift(msg)
    },

    markRead(id) {
      const msg = this.messages.find(m => m.id === id)
      if (msg) msg.read = true
    },

    markAllRead() {
      this.messages.forEach(m => m.read = true)
    },

    removeMessage(id) {
      this.messages = this.messages.filter(m => m.id !== id)
    }
  }
})
