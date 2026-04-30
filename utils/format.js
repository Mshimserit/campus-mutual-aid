/**
 * 格式化工具函数
 * 提供数据格式化、单位转换等功能
 */

export function formatMoney(amount, decimals = 2) {
  if (amount === null || amount === undefined) return '0.00'
  const num = parseFloat(amount)
  if (isNaN(num)) return '0.00'
  return num.toFixed(decimals)
}

export function formatPhone(phone) {
  if (!phone) return ''
  const str = String(phone)
  if (str.length === 11) {
    return `${str.slice(0, 3)}****${str.slice(7)}`
  }
  return str
}

export function formatTime(time, format = 'YYYY-MM-DD HH:mm') {
  if (!time) return ''
  const date = new Date(time)
  if (isNaN(date.getTime())) return time

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

export function formatRelativeTime(time) {
  if (!time) return ''
  const now = Date.now()
  const timestamp = new Date(time).getTime()
  const diff = now - timestamp

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  
  return formatTime(time, 'MM-DD HH:mm')
}

export function truncateText(text, maxLength, suffix = '...') {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + suffix
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  const n = parseInt(num)
  if (isNaN(n)) return '0'
  
  if (n >= 10000) {
    return `${(n / 10000).toFixed(1)}w`
  }
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`
  }
  return String(n)
}

export function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

export function throttle(fn, delay = 300) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

export default {
  formatMoney,
  formatPhone,
  formatTime,
  formatRelativeTime,
  truncateText,
  formatNumber,
  debounce,
  throttle
}
