export function isPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

export function isAmount(amount) {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}

export function isNotEmpty(str) {
  return str && str.trim().length > 0
}

export function validateOrderForm(data) {
  const errors = []
  if (!isNotEmpty(data.description)) {
    errors.push('请输入任务描述')
  }
  if (!isNotEmpty(data.helpTime)) {
    errors.push('请选择互助时间')
  }
  if (!isPhone(data.phone)) {
    errors.push('请输入正确的手机号')
  }
  const num = parseFloat(data.amount)
  if (!isAmount(data.amount) || num < 1) {
    errors.push('佣金不能低于1元')
  }
  return errors
}

export function containsSensitiveInfo(text) {
  const patterns = [/微信/, /wx/, /qq/i, /手机号/]
  return patterns.some(p => p.test(text))
}
