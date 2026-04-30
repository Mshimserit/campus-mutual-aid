/**
 * Network Status Detection
 * Provides network connectivity monitoring and offline handling
 */

import { ref } from 'vue'

const isOnline = ref(true)
const networkType = ref('unknown')

export function useNetworkStatus() {
  function initNetworkListener() {
    uni.getNetworkType({
      success: (res) => {
        networkType.value = res.networkType
        isOnline.value = res.networkType !== 'none'
      }
    })

    uni.onNetworkStatusChange((res) => {
      networkType.value = res.networkType
      isOnline.value = res.isConnected

      if (!res.isConnected) {
        uni.showToast({
          title: '网络连接已断开',
          icon: 'none',
          duration: 2000
        })
      } else {
        uni.showToast({
          title: '网络已恢复',
          icon: 'success',
          duration: 1500
        })
      }
    })
  }

  function checkNetwork() {
    return new Promise((resolve) => {
      uni.getNetworkType({
        success: (res) => {
          const connected = res.networkType !== 'none'
          isOnline.value = connected
          networkType.value = res.networkType
          resolve(connected)
        },
        fail: () => {
          isOnline.value = false
          resolve(false)
        }
      })
    })
  }

  async function requireNetwork() {
    const connected = await checkNetwork()
    if (!connected) {
      uni.showModal({
        title: '网络错误',
        content: '当前无网络连接，请检查网络设置后重试',
        showCancel: false,
        confirmText: '知道了'
      })
      return false
    }
    return true
  }

  return {
    isOnline,
    networkType,
    initNetworkListener,
    checkNetwork,
    requireNetwork
  }
}

export default {
  useNetworkStatus
}
