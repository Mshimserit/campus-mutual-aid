/**
 * 本地存储工具函数
 * 封装 uni.storage API，提供统一的存储管理
 */

const STORAGE_PREFIX = 'campus_wexcx_'

export function get(key, defaultValue = null) {
  try {
    const fullKey = STORAGE_PREFIX + key
    const value = uni.getStorageSync(fullKey)
    if (value === '' || value === undefined) {
      return defaultValue
    }
    return typeof value === 'string' ? JSON.parse(value) : value
  } catch (e) {
    console.error('[Storage] Get error:', key, e)
    return defaultValue
  }
}

export function set(key, value) {
  try {
    const fullKey = STORAGE_PREFIX + key
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    uni.setStorageSync(fullKey, stringValue)
    return true
  } catch (e) {
    console.error('[Storage] Set error:', key, e)
    handleStorageError(e)
    return false
  }
}

export function remove(key) {
  try {
    const fullKey = STORAGE_PREFIX + key
    uni.removeStorageSync(fullKey)
    return true
  } catch (e) {
    console.error('[Storage] Remove error:', key, e)
    return false
  }
}

export function clear() {
  try {
    uni.clearStorageSync()
    return true
  } catch (e) {
    console.error('[Storage] Clear error:', e)
    return false
  }
}

export function has(key) {
  try {
    const fullKey = STORAGE_PREFIX + key
    return uni.getStorageSync(fullKey) !== ''
  } catch (e) {
    console.error('[Storage] Has error:', key, e)
    return false
  }
}

export function getExpire(key, defaultValue = null) {
  try {
    const fullKey = STORAGE_PREFIX + key
    const data = uni.getStorageSync(fullKey)
    if (!data) return defaultValue

    const { value, expire } = typeof data === 'string' ? JSON.parse(data) : data
    if (expire && Date.now() > expire) {
      remove(key)
      return defaultValue
    }
    return value
  } catch (e) {
    console.error('[Storage] GetExpire error:', key, e)
    return defaultValue
  }
}

export function setExpire(key, value, ttl = 3600000) {
  try {
    const fullKey = STORAGE_PREFIX + key
    const data = {
      value,
      expire: Date.now() + ttl
    }
    uni.setStorageSync(fullKey, JSON.stringify(data))
    return true
  } catch (e) {
    console.error('[Storage] SetExpire error:', key, e)
    return false
  }
}

function handleStorageError(error) {
  if (error.errMsg && error.errMsg.includes('limit')) {
    uni.showToast({
      title: '存储空间不足',
      icon: 'none',
      duration: 2000
    })
  }
}

export default {
  get,
  set,
  remove,
  clear,
  has,
  getExpire,
  setExpire
}
