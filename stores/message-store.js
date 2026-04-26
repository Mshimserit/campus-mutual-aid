import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockMessages } from '@/mock/message'

export const useMessageStore = defineStore('message', () => {
  const messages = ref([...mockMessages])

  const allMessages = computed(() => messages.value)
  const unreadMessages = computed(() => messages.value.filter(m => !m.read))
  const unreadCount = computed(() => unreadMessages.value.length)
  const systemMessages = computed(() => messages.value.filter(m => m.type === 'system'))
  const commentMessages = computed(() => messages.value.filter(m => m.type === 'comment'))
  const likeMessages = computed(() => messages.value.filter(m => m.type === 'like'))

  const messageStats = computed(() => {
    return {
      total: messages.value.length,
      unread: unreadCount.value,
      system: systemMessages.value.length,
      comment: commentMessages.value.length,
      like: likeMessages.value.length
    }
  })

  function getMessageById(id) {
    return messages.value.find(m => m.id === id)
  }

  function getMessagesByType(type) {
    return messages.value.filter(m => m.type === type)
  }

  function markAsRead(id) {
    const msg = messages.value.find(m => m.id === id)
    if (msg) {
      msg.read = true
      const mockMsg = mockMessages.find(m => m.id === id)
      if (mockMsg) mockMsg.read = true
      return true
    }
    return false
  }

  function markAllAsRead() {
    messages.value.forEach(m => m.read = true)
    mockMessages.forEach(m => m.read = true)
  }

  function deleteMessage(id) {
    const index = messages.value.findIndex(m => m.id === id)
    if (index !== -1) {
      messages.value.splice(index, 1)
      const mockIndex = mockMessages.findIndex(m => m.id === id)
      if (mockIndex !== -1) {
        mockMessages.splice(mockIndex, 1)
      }
      return true
    }
    return false
  }

  function clearAll() {
    messages.value = []
    mockMessages.length = 0
  }

  return {
    messages,
    allMessages, unreadMessages, unreadCount, systemMessages, commentMessages, likeMessages, messageStats,
    getMessageById, getMessagesByType,
    markAsRead, markAllAsRead, deleteMessage, clearAll
  }
})
