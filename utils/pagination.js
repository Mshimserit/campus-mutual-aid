/**
 * 分页加载 Composable
 * 用于长列表的分页加载、上拉加载更多、下拉刷新
 * 避免一次性加载大量数据导致性能问题
 */

import { ref, reactive } from 'vue'

export function usePagination(options = {}) {
  const {
    pageSize = 10,
    fetchData,
    initialData = []
  } = options

  const list = ref([...initialData])
  const loading = ref(false)
  const hasMore = ref(true)
  const page = ref(1)
  const total = ref(0)
  const error = ref(null)

  async function loadMore() {
    if (loading.value || !hasMore.value) return

    loading.value = true
    error.value = null

    try {
      const result = await fetchData({
        page: page.value,
        pageSize: pageSize.value,
        filters: options.filters
      })

      if (Array.isArray(result)) {
        if (result.length < pageSize.value) {
          hasMore.value = false
        }
        list.value = [...list.value, ...result]
      } else if (result.data) {
        list.value = [...list.value, ...result.data]
        total.value = result.total || 0
        if (list.value.length >= total.value) {
          hasMore.value = false
        }
      }

      page.value += 1
    } catch (err) {
      error.value = err.message || '加载失败'
      console.error('[Pagination] Load more failed:', err)
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    page.value = 1
    hasMore.value = true
    list.value = []
    error.value = null

    await loadMore()
  }

  function reset() {
    list.value = []
    loading.value = false
    hasMore.value = true
    page.value = 1
    total.value = 0
    error.value = null
  }

  function addItem(item) {
    list.value.unshift(item)
  }

  function removeItem(index) {
    list.value.splice(index, 1)
  }

  function updateItem(index, newItem) {
    list.value[index] = { ...list.value[index], ...newItem }
  }

  return {
    list,
    loading,
    hasMore,
    page,
    total,
    error,
    loadMore,
    refresh,
    reset,
    addItem,
    removeItem,
    updateItem
  }
}

export function useLoadMore(options = {}) {
  const {
    fetchData,
    initialData = []
  } = options

  const list = ref([...initialData])
  const loading = ref(false)
  const hasMore = ref(true)
  const error = ref(null)

  async function loadMore() {
    if (loading.value || !hasMore.value) return

    loading.value = true
    error.value = null

    try {
      const result = await fetchData({
        lastItem: list.value[list.value.length - 1]
      })

      if (Array.isArray(result)) {
        if (result.length === 0) {
          hasMore.value = false
        } else {
          list.value = [...list.value, ...result]
        }
      }
    } catch (err) {
      error.value = err.message || '加载失败'
      console.error('[LoadMore] Failed:', err)
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    list.value = []
    hasMore.value = true
    error.value = null

    await loadMore()
  }

  return {
    list,
    loading,
    hasMore,
    error,
    loadMore,
    refresh
  }
}

export default {
  usePagination,
  useLoadMore
}
