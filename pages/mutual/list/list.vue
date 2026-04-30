<template>
  <view class="page">
    <!-- Filter Tabs -->
    <view class="filter-tabs">
      <scroll-view scroll-x class="tabs-scroll">
        <view class="tabs-wrapper">
          <view
            v-for="tab in tabs"
            :key="tab.value"
            :class="['tab-item', { active: currentFilter === tab.value }]"
            @click="switchFilter(tab.value)"
          >
            <text>{{ tab.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- Network Offline Banner -->
    <view v-if="!isOnline" class="offline-banner">
      <uni-icons type="wifi-off" size="16" color="#ffffff"></uni-icons>
      <text class="offline-text">当前网络不可用，请检查网络连接</text>
    </view>

    <!-- Order List with Pull-to-Refresh -->
    <scroll-view
      class="order-list-scroll"
      scroll-y
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore"
      :lower-threshold="100"
    >
      <!-- Loading Skeleton -->
      <view v-if="loading && filteredOrders.length === 0" class="skeleton-container">
        <view v-for="i in 5" :key="i" class="skeleton-card">
          <view class="skeleton-row">
            <loading-skeleton width="60px" height="32rpx" />
            <loading-skeleton width="100px" height="32rpx" :style="{ marginLeft: 'auto' }" />
          </view>
          <view class="skeleton-row" style="margin-top: 16rpx;">
            <loading-skeleton width="80%" height="28rpx" />
          </view>
          <view class="skeleton-row" style="margin-top: 16rpx;">
            <loading-skeleton width="40%" height="24rpx" />
            <loading-skeleton width="30%" height="24rpx" :style="{ marginLeft: 'auto' }" />
          </view>
        </view>
      </view>

      <!-- Empty State -->
      <view v-else-if="filteredOrders.length === 0" class="empty-wrapper">
        <empty-state
          :icon="'/static/logo.png'"
          :title="getEmptyText()"
          :show-action="currentFilter === 'all'"
          action-text="发布第一个订单"
          @action="goToPublish"
        />
      </view>

      <!-- Order Cards -->
      <view v-else class="order-list">
        <order-card
          v-for="order in filteredOrders"
          :key="order.id"
          :order="order"
          @accept="onAcceptOrder"
          @click="goToDetail(order.id)"
        />

        <!-- Load More Indicator -->
        <view class="load-more-indicator" v-if="hasMore">
          <uni-load-more status="loading" iconType="circle" :content-text="loadMoreText" />
        </view>
        <view v-else class="no-more-text">
          <text>— 已经到底了 —</text>
        </view>
      </view>
    </scroll-view>

    <!-- Floating Action Button -->
    <view class="fab-button" @click="goToPublish">
      <uni-icons type="plus" size="24" color="#FFFFFF"></uni-icons>
      <text class="fab-text">发布</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/order-store'
import { useUserStore } from '@/stores/user-store'
import { orderService } from '@/services/order-service'
import { useNetworkStatus } from '@/utils/network'

const orderStore = useOrderStore()
const userStore = useUserStore()
const { isOnline, requireNetwork, initNetworkListener } = useNetworkStatus()

const currentFilter = ref('all')
const loading = ref(false)
const isRefreshing = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 10
const orders = ref([...orderStore.orders])

const loadMoreText = { contentdown: '上拉加载更多', contentrefresh: '加载中...', contentnomore: '没有更多数据了' }

const tabs = [
  { label: '全部订单', value: 'all' },
  { label: '未被接单', value: 'pending' },
  { label: '我发布的', value: 'myPublished' },
  { label: '我帮助的', value: 'myHelped' }
]

const filteredOrders = computed(() => {
  switch (currentFilter.value) {
    case 'pending':
      return orders.value.filter(o => o.paid && o.status === 'PENDING' && !o.accepted)
    case 'myPublished':
      return orders.value.filter(o => o.paid && o.publisherId === userStore.userInfo?.id)
    case 'myHelped':
      return orders.value.filter(o => o.paid && o.acceptorId === userStore.userInfo?.id)
    default:
      return orders.value.filter(o => o.paid)
  }
})

onMounted(() => {
  initNetworkListener()
  loadOrders()
})

async function loadOrders() {
  const connected = await requireNetwork()
  if (!connected) return

  loading.value = true
  try {
    const data = await orderService.getOrders({ filter: currentFilter.value, page: 1 })
    orders.value = data
    hasMore.value = false
  } catch (e) {
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

async function onRefresh() {
  isRefreshing.value = true
  currentPage.value = 1
  hasMore.value = true

  try {
    const data = await orderService.getOrders({ filter: currentFilter.value, page: 1 })
    orders.value = data
    hasMore.value = false
  } catch (e) {
    uni.showToast({ title: '刷新失败', icon: 'none' })
  } finally {
    isRefreshing.value = false
  }
}

async function onLoadMore() {
  if (!hasMore.value || loading.value) return

  const connected = await requireNetwork()
  if (!connected) return

  loading.value = true
  currentPage.value += 1

  try {
    const data = await orderService.getOrders({ filter: currentFilter.value, page: currentPage.value })
    if (data.length < pageSize) {
      hasMore.value = false
    } else {
      orders.value = [...orders.value, ...data]
    }
  } catch (e) {
    uni.showToast({ title: '加载更多失败', icon: 'none' })
    currentPage.value -= 1
  } finally {
    loading.value = false
  }
}

function switchFilter(filter) {
  currentFilter.value = filter
  currentPage.value = 1
  hasMore.value = true
  loadOrders()
}

async function onAcceptOrder(orderId) {
  const user = userStore.userInfo
  if (!user || !user.certified) {
    uni.navigateTo({ url: '/pages/mutual/auth/auth' })
    return
  }

  const connected = await requireNetwork()
  if (!connected) return

  uni.showLoading({ title: '接单中...' })

  try {
    orderStore.acceptOrder(orderId, { id: user.id, nickname: user.nickname || user.name })
    await orderService.acceptOrder(orderId)
    uni.hideLoading()
    uni.showToast({ title: '接单成功', icon: 'success' })

    setTimeout(() => {
      uni.navigateTo({ url: `/pages/mutual/detail/detail?id=${orderId}` })
    }, 800)
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '接单失败', icon: 'none' })
  }
}

function goToDetail(id) {
  uni.navigateTo({ url: `/pages/mutual/detail/detail?id=${id}` })
}

function goToPublish() {
  const user = userStore.userInfo
  if (!user || !user.certified) {
    uni.navigateTo({ url: '/pages/mutual/auth/auth' })
    return
  }
  uni.navigateTo({ url: '/pages/mutual/publish/publish' })
}

function getEmptyText() {
  switch (currentFilter.value) {
    case 'pending':
      return '暂无未被接单的订单'
    case 'myPublished':
      return '暂无我发布的订单'
    case 'myHelped':
      return '暂无我帮助的订单'
    default:
      return '暂无订单'
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #FF6B6B;
$primary-light: #FFF0F0;
$secondary-color: #FF8C42;
$success-color: #34C759;
$text-primary: #1A1A2E;
$text-secondary: #6B7280;
$text-muted: #9CA3AF;
$bg-color: #F8F9FA;
$card-shadow: 0 2px 16px rgba(0,0,0,0.06);
$border-radius: 12px;

.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $bg-color;
}

.filter-tabs {
  background: #FFFFFF;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  flex-shrink: 0;

  .tabs-scroll {
    white-space: nowrap;
  }

  .tabs-wrapper {
    display: inline-flex;
  }

  .tab-item {
    display: inline-block;
    padding: 14px 16px;
    font-size: 14px;
    color: $text-secondary;
    position: relative;
    font-weight: 500;
    transition: all 0.2s ease;

    &.active {
      color: $primary-color;
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 3px;
        background: $primary-color;
        border-radius: 2px;
      }
    }

    &:active {
      background-color: $primary-light;
    }
  }
}

.offline-banner {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .offline-text {
    color: #ffffff;
    font-size: 13px;
    font-weight: 500;
  }
}

.order-list-scroll {
  flex: 1;
  overflow: hidden;
}

.order-list {
  padding: 12px 16px 80px;
}

.skeleton-container {
  padding: 12px 16px;

  .skeleton-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;

    .skeleton-row {
      display: flex;
      align-items: center;
    }
  }
}

.empty-wrapper {
  padding: 60px 16px;
  display: flex;
  justify-content: center;
}

.load-more-indicator {
  padding: 16px 0;
}

.no-more-text {
  text-align: center;
  padding: 20px 0;
  font-size: 13px;
  color: $text-muted;
}

.fab-button {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.4);
  transition: all 0.2s ease;
  z-index: 100;

  &:active {
    transform: scale(0.92);
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  }

  .fab-text {
    font-size: 10px;
    color: #FFFFFF;
    font-weight: 600;
    margin-top: 2px;
  }
}
</style>
