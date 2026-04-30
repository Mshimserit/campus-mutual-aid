/**
 * 验证工具函数
 * 提供表单验证、数据校验等功能
 */

export function isEmpty(value) {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

export function isPhone(value) {
  return /^1[3-9]\d{9}$/.test(value)
}

export function isEmail(value) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
}

export function isNumber(value) {
  return /^\d+$/.test(value)
}

export function isFloat(value) {
  return /^\d+(\.\d+)?$/.test(value)
}

export function minLength(value, min) {
  return value.length >= min
}

export function maxLength(value, max) {
  return value.length <= max
}

export function isBetween(value, min, max) {
  return value >= min && value <= max
}

export function validate(rules, data) {
  const errors = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field]

    for (const rule of fieldRules) {
      if (rule.required && isEmpty(value)) {
        errors[field] = rule.message || `${field}不能为空`
        break
      }

      if (!isEmpty(value)) {
        if (rule.min && !minLength(value, rule.min)) {
          errors[field] = rule.message || `${field}长度不能少于${rule.min}个字符`
          break
        }

        if (rule.max && !maxLength(value, rule.max)) {
          errors[field] = rule.message || `${field}长度不能超过${rule.max}个字符`
          break
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          errors[field] = rule.message || `${field}格式不正确`
          break
        }

        if (rule.validator && !rule.validator(value)) {
          errors[field] = rule.message || `${field}验证失败`
          break
        }
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

export default {
  isEmpty,
  isPhone,
  isEmail,
  isNumber,
  isFloat,
  minLength,
  maxLength,
  isBetween,
  validate
}
