import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockUser, mockBannedUser, mockUserProfile, mockAuthForm, mockCampusOptions } from '@/mock/user'
import { useStorage } from '@/utils/storage'

const { get, set, remove } = useStorage('campus_user')

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(get() || { ...mockUser })
  const bannedInfo = ref(null)
  const userProfile = ref({ ...mockUserProfile })
  const authForm = ref({ ...mockAuthForm })
  const campusOptions = ref(mockCampusOptions)

  const isLoggedIn = computed(() => !!userInfo.value && !!userInfo.value.id)
  const isAuthed = computed(() => userInfo.value?.isAuthed || false)
  const isBanned = computed(() => !!bannedInfo.value)
  const canPost = computed(() => isLoggedIn.value && !isBanned.value)
  const canComment = computed(() => canPost.value)
  const canMutual = computed(() => canPost.value && isAuthed.value)
  const canWithdraw = computed(() => canMutual.value)

  const isAuthedWith = (campus) => {
    return isAuthed.value && userInfo.value?.campus === campus
  }

  function updateProfile(data) {
    userProfile.value = { ...userProfile.value, ...data }
  }

  function updateAuthForm(data) {
    authForm.value = { ...authForm.value, ...data }
  }

  async function submitAuth() {
    try {
      userInfo.value.isAuthed = true
      userInfo.value.authCampus = authForm.value.campus
      mockUser.isAuthed = true
      mockUser.authCampus = authForm.value.campus
      return { success: true }
    } catch (e) {
      return { success: false, error: e }
    }
  }

  async function mockLogin(username, password) {
    if (username && password) {
      const newUser = {
        ...mockUser,
        id: 'u_' + Math.floor(Math.random() * 10000),
        uid: String(1000000000 + Math.floor(Math.random() * 9000000000)),
        username: username,
        nickname: username,
        campus: '未认证'
      }
      userInfo.value = newUser
      Object.assign(mockUser, newUser)
      set(userInfo.value)
      return { success: true, user: newUser }
    }
    return { success: false, error: '用户名或密码不能为空' }
  }

  function logout() {
    userInfo.value = null
    bannedInfo.value = null
    remove()
  }

  function checkBanStatus() {
    const banData = { ...mockBannedUser }
    if (banData.isBanned) {
      bannedInfo.value = banData
    }
    return banData.isBanned
  }

  async function submitAppeal(content) {
    try {
      return { success: true, message: '申诉已提交' }
    } catch (e) {
      return { success: false, error: e }
    }
  }

  return {
    userInfo, bannedInfo, userProfile, authForm, campusOptions,
    isLoggedIn, isAuthed, isBanned, canPost, canComment, canMutual, canWithdraw,
    isAuthedWith, updateProfile, updateAuthForm, submitAuth,
    mockLogin, logout, checkBanStatus, submitAppeal
  }
})
