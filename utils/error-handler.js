/**
 * 统一错误处理中间件
 * 提供错误分类、用户提示、日志记录等功能
 */

export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BUSINESS_ERROR: 'BUSINESS_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

export const ErrorMessages = {
  [ErrorTypes.NETWORK_ERROR]: '网络连接失败，请检查网络设置',
  [ErrorTypes.SERVER_ERROR]: '服务器异常，请稍后重试',
  [ErrorTypes.AUTH_ERROR]: '登录已过期，请重新登录',
  [ErrorTypes.VALIDATION_ERROR]: '数据验证失败',
  [ErrorTypes.BUSINESS_ERROR]: '操作失败',
  [ErrorTypes.UNKNOWN_ERROR]: '未知错误，请稍后重试'
}

export class AppError extends Error {
  constructor(type, message, code = null, details = null) {
    super(message)
    this.type = type
    this.code = code
    this.details = details
    this.timestamp = Date.now()
  }
}

export function handleError(error, options = {}) {
  const {
    showNotification = true,
    logError = true,
    fallbackMessage = null
  } = options

  const appError = classifyError(error)

  if (logError) {
    logError(appError)
  }

  if (showNotification) {
    showErrorNotification(appError, fallbackMessage)
  }

  if (appError.type === ErrorTypes.AUTH_ERROR) {
    handleAuthError()
  }

  return appError
}

export function classifyError(error) {
  if (error instanceof AppError) {
    return error
  }

  if (error.errMsg || error.errno !== undefined) {
    return new AppError(
      ErrorTypes.NETWORK_ERROR,
      ErrorMessages[ErrorTypes.NETWORK_ERROR],
      error.errno,
      error
    )
  }

  if (error.response) {
    const statusCode = error.response.statusCode || error.response.status
    const data = error.response.data || {}

    if (statusCode === 401 || statusCode === 403) {
      return new AppError(
        ErrorTypes.AUTH_ERROR,
        data.message || ErrorMessages[ErrorTypes.AUTH_ERROR],
        statusCode,
        error.response
      )
    }

    if (statusCode >= 500) {
      return new AppError(
        ErrorTypes.SERVER_ERROR,
        data.message || ErrorMessages[ErrorTypes.SERVER_ERROR],
        statusCode,
        error.response
      )
    }

    return new AppError(
      ErrorTypes.BUSINESS_ERROR,
      data.message || ErrorMessages[ErrorTypes.BUSINESS_ERROR],
      statusCode,
      error.response
    )
  }

  if (error.message) {
    return new AppError(
      ErrorTypes.UNKNOWN_ERROR,
      error.message,
      null,
      error
    )
  }

  return new AppError(
    ErrorTypes.UNKNOWN_ERROR,
    ErrorMessages[ErrorTypes.UNKNOWN_ERROR],
    null,
    error
  )
}

function logError(appError) {
  const logData = {
    type: appError.type,
    message: appError.message,
    code: appError.code,
    timestamp: appError.timestamp,
    stack: appError.stack
  }

  console.error('[AppError]', logData)

  try {
    const logs = uni.getStorageSync('error_logs') || []
    logs.push(logData)
    if (logs.length > 100) {
      logs.shift()
    }
    uni.setStorageSync('error_logs', JSON.stringify(logs))
  } catch (e) {
    console.error('[AppError] Log storage failed:', e)
  }
}

function showErrorNotification(appError, fallbackMessage) {
  const message = fallbackMessage || appError.message || ErrorMessages[appError.type]

  uni.showToast({
    title: message,
    icon: 'none',
    duration: 3000
  })
}

function handleAuthError() {
  try {
    uni.removeStorageSync('campus_wexcx_userInfo')
  } catch (e) {
    console.error('[AuthError] Clear storage failed:', e)
  }

  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/login/login'
    })
  }, 1500)
}

export function createAppError(type, message, code = null, details = null) {
  return new AppError(type, message, code, details)
}

export function isAppError(error) {
  return error instanceof AppError
}

export default {
  ErrorTypes,
  ErrorMessages,
  AppError,
  handleError,
  classifyError,
  createAppError,
  isAppError
}
