<template>
  <view class="page">
    <view class="filter-tabs">
      <scroll-view scroll-x>
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

    <view class="order-list">
      <view v-if="loading" class="loading-wrapper">
        <uni-load-more status="loading" />
      </view>
      <view v-else-if="filteredOrders.length === 0" class="empty-wrapper">
        <view class="empty-state">
          <image src="/static/logo.png" class="empty-icon" mode="aspectFit" />
          <text class="empty-text">{{ getEmptyText() }}</text>
          <button v-if="currentFilter === 'all'" size="mini" type="primary" @click="goToPublish">发布第一个订单</button>
        </view>
      </view>
      <view v-else>
        <order-card
          v-for="order in filteredOrders"
          :key="order.id"
          :order="order"
          @accept="onAcceptOrder"
          @click="goToDetail(order.id)"
        />
        <uni-load-more :status="loadMoreStatus" @clickLoadMore="loadMore" />
      </view>
    </view>

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

const orderStore = useOrderStore()
const userStore = useUserStore()

const currentFilter = ref('all')
const loading = ref(false)
const loadMoreStatus = ref('more')
const orders = ref([...orderStore.orders])

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
  loadOrders()
})

async function loadOrders() {
  loading.value = true
  try {
    const data = await orderService.getOrders({ filter: currentFilter.value, page: 1 })
    orders.value = data
    loadMoreStatus.value = 'nomore'
  } catch (e) {
    loadMoreStatus.value = 'more'
  } finally {
    loading.value = false
  }
}

function switchFilter(filter) {
  currentFilter.value = filter
  loadOrders()
}

async function onAcceptOrder(orderId) {
  const user = userStore.userInfo
  if (!user || !user.certified) {
    uni.navigateTo({ url: '/pages/mutual/auth/auth' })
    return
  }

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

function loadMore() {
  if (loadMoreStatus.value !== 'more') return
  loadMoreStatus.value = 'loading'
  setTimeout(() => {
    loadMoreStatus.value = 'nomore'
  }, 500)
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
  min-height: 100vh;
  background-color: $bg-color;
  padding-bottom: 80px;
}

.filter-tabs {
  background: #FFFFFF;
  padding: 0 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);

  .tabs-wrapper {
    display: flex;
  }

  .tab-item {
    padding: 14px 16px;
    font-size: 14px;
    color: $text-secondary;
    position: relative;
    white-space: nowrap;
    font-weight: 500;
    transition: color 0.2s ease;

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
  }
}

.order-list {
  padding: 12px 16px;
}

.loading-wrapper,
.empty-wrapper {
  padding: 60px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  .empty-icon {
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 14px;
    color: $text-muted;
    margin-bottom: 20px;
    font-weight: 500;
  }

  button {
    border-radius: 8px;
    padding: 8px 24px;
    font-size: 14px;
    font-weight: 600;
  }
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
