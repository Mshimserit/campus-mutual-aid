/**
 * HTTP 请求工具
 * 封装 uni.request，提供请求/响应拦截器、错误处理、重试机制
 */

import { USE_MOCK, API_BASE_URL } from '@/config'
import { handleError, ErrorTypes, AppError } from './error-handler'

const DEFAULT_TIMEOUT = 10000
const DEFAULT_RETRY_COUNT = 2
const DEFAULT_RETRY_DELAY = 1000

const requestInterceptors = []
const responseInterceptors = []

export function addRequestInterceptor(interceptor) {
  requestInterceptors.push(interceptor)
}

export function addResponseInterceptor(interceptor) {
  responseInterceptors.push(interceptor)
}

function applyRequestInterceptors(config) {
  let finalConfig = { ...config }

  for (const interceptor of requestInterceptors) {
    finalConfig = interceptor(finalConfig) || finalConfig
  }

  const token = getToken()
  if (token) {
    finalConfig.header = {
      ...finalConfig.header,
      'Authorization': `Bearer ${token}`
    }
  }

  return finalConfig
}

function applyResponseInterceptors(response) {
  let finalResponse = response

  for (const interceptor of responseInterceptors) {
    finalResponse = interceptor(finalResponse) || finalResponse
  }

  return finalResponse
}

function getToken() {
  try {
    const userInfo = uni.getStorageSync('campus_wexcx_userInfo')
    if (userInfo) {
      const parsed = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo
      return parsed.token || null
    }
  } catch (e) {
    console.error('[Request] Get token failed:', e)
  }
  return null
}

export function request({ url, method = 'GET', data = {}, header = {}, timeout = DEFAULT_TIMEOUT, retryCount = DEFAULT_RETRY_COUNT, retryDelay = DEFAULT_RETRY_DELAY }) {
  const config = {
    url: `${API_BASE_URL}${url}`,
    method,
    data,
    header: {
      'Content-Type': 'application/json',
      ...header
    },
    timeout
  }

  const finalConfig = applyRequestInterceptors(config)

  return executeRequest(finalConfig, retryCount, retryDelay)
}

function executeRequest(config, retryCount, retryDelay) {
  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: async (res) => {
        try {
          const finalRes = applyResponseInterceptors(res)

          if (finalRes.statusCode === 200) {
            const responseData = finalRes.data

            if (responseData.code === 0 || responseData.success) {
              resolve(responseData.data || responseData)
            } else if (responseData.code === 401) {
              reject(new AppError(
                ErrorTypes.AUTH_ERROR,
                responseData.message || '登录已过期'
              ))
            } else {
              reject(new AppError(
                ErrorTypes.BUSINESS_ERROR,
                responseData.message || '请求失败',
                responseData.code
              ))
            }
          } else if (finalRes.statusCode === 401) {
            reject(new AppError(
              ErrorTypes.AUTH_ERROR,
              '登录已过期，请重新登录'
            ))
          } else if (finalRes.statusCode >= 500) {
            reject(new AppError(
              ErrorTypes.SERVER_ERROR,
              '服务器异常，请稍后重试'
            ))
          } else {
            reject(new AppError(
              ErrorTypes.BUSINESS_ERROR,
              finalRes.data?.message || '请求失败'
            ))
          }
        } catch (error) {
          reject(error)
        }
      },
      fail: async (err) => {
        if (retryCount > 0) {
          await delay(retryDelay)
          try {
            const result = await executeRequest(config, retryCount - 1, retryDelay)
            resolve(result)
          } catch (retryError) {
            reject(retryError)
          }
        } else {
          handleError(err, { showNotification: false })
          reject(new AppError(
            ErrorTypes.NETWORK_ERROR,
            '网络连接失败，请检查网络设置',
            null,
            err
          ))
        }
      }
    })
  })
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function get(url, data, options = {}) {
  return request({ url, method: 'GET', data, ...options })
}

export function post(url, data, options = {}) {
  return request({ url, method: 'POST', data, ...options })
}

export function put(url, data, options = {}) {
  return request({ url, method: 'PUT', data, ...options })
}

export function del(url, data, options = {}) {
  return request({ url, method: 'DELETE', data, ...options })
}

export function upload(url, filePath, formData = {}, options = {}) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${API_BASE_URL}${url}`,
      filePath,
      name: 'file',
      formData,
      header: {
        'Authorization': `Bearer ${getToken()}`
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data)
          if (data.code === 0 || data.success) {
            resolve(data.data || data)
          } else {
            reject(new AppError(ErrorTypes.BUSINESS_ERROR, data.message || '上传失败'))
          }
        } catch (e) {
          reject(new AppError(ErrorTypes.UNKNOWN_ERROR, '上传响应解析失败'))
        }
      },
      fail: (err) => {
        reject(new AppError(ErrorTypes.NETWORK_ERROR, '上传失败', null, err))
      }
    })
  })
}

export function download(url, options = {}) {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url: `${API_BASE_URL}${url}`,
      header: {
        'Authorization': `Bearer ${getToken()}`
      },
      ...options,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject(new AppError(ErrorTypes.SERVER_ERROR, '下载失败'))
        }
      },
      fail: (err) => {
        reject(new AppError(ErrorTypes.NETWORK_ERROR, '下载失败', null, err))
      }
    })
  })
}

export default {
  request,
  get,
  post,
  put,
  del,
  upload,
  download,
  addRequestInterceptor,
  addResponseInterceptor
}
