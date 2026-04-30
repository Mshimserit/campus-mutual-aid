/**
 * 数据源适配器
 * 解耦服务层与 Mock 层，实现可切换的数据源
 * 根据 USE_MOCK 配置自动选择 Mock 或真实 API
 */

import { USE_MOCK } from '@/config'
import * as api from '@/utils/request'

export function createDataSource(apiService, mockService) {
  return new Proxy({}, {
    get(target, prop) {
      if (USE_MOCK && mockService && mockService[prop]) {
        return mockService[prop]
      }
      if (apiService && apiService[prop]) {
        return apiService[prop]
      }
      return undefined
    }
  })
}

export async function fetchWithFallback(apiFn, mockFn, options = {}) {
  const {
    useMock = USE_MOCK,
    fallbackToMock = true,
    onError = null
  } = options

  if (useMock) {
    try {
      return await mockFn()
    } catch (error) {
      console.warn('[DataSource] Mock data failed, trying API:', error)
      if (!fallbackToMock) throw error
    }
  }

  try {
    return await apiFn()
  } catch (error) {
    if (fallbackToMock && mockFn) {
      console.warn('[DataSource] API failed, fallback to mock:', error)
      try {
        return await mockFn()
      } catch (mockError) {
        console.error('[DataSource] Both API and mock failed:', mockError)
      }
    }
    
    if (onError) onError(error)
    throw error
  }
}

export default {
  createDataSource,
  fetchWithFallback
}
