export function get(key, defaultValue = null) {
  try {
    const value = uni.getStorageSync(key)
    return value ? JSON.parse(value) : defaultValue
  } catch (e) {
    return defaultValue
  }
}

export function set(key, value) {
  try {
    uni.setStorageSync(key, JSON.stringify(value))
    return true
  } catch (e) {
    return false
  }
}

export function remove(key) {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (e) {
    return false
  }
}

export function clear() {
  try {
    uni.clearStorageSync()
    return true
  } catch (e) {
    return false
  }
}
