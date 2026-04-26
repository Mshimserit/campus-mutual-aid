<template>
  <view class="page">
    <view :class="['status-bar', `status-${order?.status?.toLowerCase()}`]">
      <text class="status-text">{{ statusConfig?.text }}</text>
    </view>

    <view v-if="canViewDetail" class="order-info">
      <uni-card title="订单信息" :isShadow="true">
        <view class="info-row">
          <text class="label">{{ isPublisher ? '待帮助人（我）' : '发单人' }}</text>
          <text class="value">{{ order.publisherNickname }}</text>
        </view>
        <view class="info-row">
          <text class="label">接单人</text>
          <text class="value">{{ order.acceptorNickname || '等待接单' }}</text>
        </view>
        <view class="info-row">
          <text class="label">订单编号</text>
          <view class="value-row">
            <text class="value">{{ order.orderNo }}</text>
            <button size="mini" @click="copyOrderNo">复制</button>
          </view>
        </view>
        <view class="info-row">
          <text class="label">下单时间</text>
          <text class="value">{{ order.createTime }}</text>
        </view>
        <view class="info-row">
          <text class="label">互助时间</text>
          <text class="value">{{ order.helpTime }}</text>
        </view>
        <view class="info-row">
          <text class="label">互助地点</text>
          <text class="value">{{ order.campus }}</text>
        </view>
        <view class="info-row">
          <text class="label">订单信息</text>
          <text class="value">{{ order.description }}</text>
        </view>
        <view class="info-row">
          <text class="label">佣金</text>
          <text class="value highlight-red">¥{{ order.amount }}</text>
        </view>

        <view v-if="isPublisher" class="sensitive-info-section">
          <view class="section-title">我的联系信息</view>
          <view class="info-row">
            <text class="label">联系电话</text>
            <text class="value highlight">{{ order.phone }}</text>
          </view>
        </view>

        <view v-if="showSensitiveInfo" class="sensitive-info-section">
          <view class="section-title">发单人联系信息</view>
          <view class="info-row">
            <text class="label">联系电话</text>
            <text class="value highlight">{{ order.phone }}</text>
          </view>
          <view v-if="order.address" class="info-row">
            <text class="label">详细地址</text>
            <text class="value">{{ order.address }}</text>
          </view>
          <view v-if="order.pickupCode" class="info-row">
            <text class="label">取件码</text>
            <text class="value highlight">{{ order.pickupCode }}</text>
          </view>
        </view>

        <view v-if="!showSensitiveInfo && !isPublisher" class="sensitive-info">
          <uni-notice-bar showIcon text="接单后可查看发单人联系信息" />
        </view>
      </uni-card>

      <uni-card title="平台保障" :isShadow="true" class="guarantee-card">
        <view class="steps-wrapper">
          <uni-steps :options="guaranteeSteps" :active="currentStep" active-color="#1890ff" />
        </view>
      </uni-card>

      <uni-card v-if="isPublisher && order.paid" title="发单提示" :isShadow="true" class="tips-card">
        <view class="tips-content">
          <text class="tips-text">订单已发布，等待接单。接单后您将看到接单人信息。</text>
        </view>
      </uni-card>

      <uni-card v-if="!order.paid" title="支付提示" :isShadow="true" class="tips-card warning">
        <view class="tips-content">
          <text class="tips-text">此订单尚未支付，无法被接单。请先完成支付。</text>
        </view>
        <view class="tips-actions">
          <button size="mini" type="primary" @click="goToPay">去支付</button>
        </view>
      </uni-card>

      <uni-card v-if="isAcceptor && order.status === 'IN_PROGRESS'" title="接单人提示" :isShadow="true" class="tips-card">
        <view class="tips-content">
          <text class="tips-text">请尽快联系发单人，确认任务细节后前往指定地点完成互助任务。</text>
        </view>
        <view class="tips-actions">
          <button size="mini" type="primary" @click="contactPublisher">联系发单人</button>
        </view>
      </uni-card>
    </view>

    <view v-else class="locked-order-info">
      <uni-card :isShadow="true" class="locked-card">
        <view class="locked-content">
          <uni-icons type="locked" size="60" color="#9CA3AF"></uni-icons>
          <text class="locked-title">订单详情暂不可见</text>
          <text class="locked-desc">您需要先接单才能查看此订单的详细信息</text>
          <button v-if="canAccept" size="default" type="primary" @click="onAccept" class="accept-btn">
            立即接单
          </button>
        </view>
      </uni-card>
    </view>

    <view class="footer-actions" v-if="order && canViewDetail">
      <button
        v-if="canCancel"
        size="default"
        @click="cancelOrder"
        class="cancel-btn"
      >
        取消订单
      </button>
      <button
        v-if="canConfirm"
        size="default"
        type="primary"
        @click="confirmOrder"
        class="confirm-btn"
      >
        确认完成
      </button>
      <button
        v-if="canDeliver"
        size="default"
        type="primary"
        @click="deliverOrder"
        class="deliver-btn"
      >
        送达
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/order-store'
import { useUserStore } from '@/stores/user-store'
import { orderService } from '@/services/order-service'
import { STATUS_CONFIG, getStatusStep, canTransition } from '@/utils/status-machine'

const orderStore = useOrderStore()
const userStore = useUserStore()

const order = ref(null)
const orderId = ref('')

const guaranteeSteps = [
  { title: '查看需求' },
  { title: '接单帮忙' },
  { title: '完成订单' },
  { title: '佣金到账' }
]

const statusConfig = computed(() => {
  return STATUS_CONFIG[order.value?.status] || STATUS_CONFIG.PENDING
})

const currentStep = computed(() => {
  return getStatusStep(order.value?.status)
})

const isPublisher = computed(() => {
  return order.value?.publisherId === userStore.userInfo?.id
})

const isAcceptor = computed(() => {
  return order.value?.acceptorId === userStore.userInfo?.id
})

const canAccept = computed(() => {
  if (!order.value) return false
  return order.value.paid && order.value.status === 'PENDING' && order.value.publisherId !== userStore.userInfo?.id
})

const canViewDetail = computed(() => {
  if (!order.value) return false
  return order.value.accepted || order.value.publisherId === userStore.userInfo?.id
})

const showSensitiveInfo = computed(() => {
  if (!order.value) return false
  if (!isAcceptor.value) return false
  return true
})

const canCancel = computed(() => {
  if (!order.value) return false
  if (isPublisher.value) return ['PENDING'].includes(order.value.status)
  return false
})

const canConfirm = computed(() => {
  return isPublisher.value && order.value?.status === 'WAITING_CONFIRM'
})

const canDeliver = computed(() => {
  return isAcceptor.value && order.value?.status === 'IN_PROGRESS'
})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  orderId.value = currentPage.options.id || ''
  loadOrderDetail()
})

async function loadOrderDetail() {
  try {
    const data = await orderService.getOrderDetail(orderId.value)
    if (data) {
      order.value = data
    } else {
      order.value = orderStore.orders.find(o => o.id === orderId.value) || null
    }
  } catch (e) {
    const localOrder = orderStore.orders.find(o => o.id === orderId.value)
    if (localOrder) {
      order.value = localOrder
    } else {
      uni.showToast({ title: '加载失败', icon: 'none' })
    }
  }
}

function copyOrderNo() {
  uni.setClipboardData({
    data: order.value.orderNo,
    success: () => {
      uni.showToast({ title: '复制成功', icon: 'success' })
    }
  })
}

function contactPublisher() {
  if (order.value.phone) {
    uni.makePhoneCall({
      phoneNumber: order.value.phone,
      fail: () => {
        uni.showToast({ title: '拨打失败', icon: 'none' })
      }
    })
  } else {
    uni.showToast({ title: '暂无联系方式', icon: 'none' })
  }
}

function goToPay() {
  uni.navigateTo({
    url: `/pages/mutual/payment/payment?orderId=${order.value.id}&description=${encodeURIComponent(order.value.description)}&helpTime=${encodeURIComponent(order.value.helpTime)}&phone=${encodeURIComponent(order.value.phone)}&campus=${encodeURIComponent(order.value.campus)}&amount=${order.value.amount}`
  })
}

async function onAccept() {
  const user = userStore.userInfo
  if (!user || !user.certified) {
    uni.navigateTo({ url: '/pages/mutual/auth/auth' })
    return
  }

  uni.showLoading({ title: '接单中...' })

  try {
    orderStore.acceptOrder(orderId.value, { id: user.id, nickname: user.nickname || user.name })
    await orderService.acceptOrder(orderId.value)
    uni.hideLoading()
    uni.showToast({ title: '接单成功', icon: 'success' })
    loadOrderDetail()
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '接单失败', icon: 'none' })
  }
}

async function cancelOrder() {
  if (!canTransition(order.value.status, 'CANCELLED')) {
    uni.showToast({ title: '当前状态不可取消', icon: 'none' })
    return
  }

  uni.showModal({
    title: '确认取消',
    content: '取消后佣金将原路退回',
    success: async (res) => {
      if (res.confirm) {
        try {
          await orderService.cancelOrder(orderId.value)
          uni.showToast({ title: '订单已取消', icon: 'success' })
          loadOrderDetail()
        } catch (e) {
          uni.showToast({ title: '取消失败', icon: 'none' })
        }
      }
    }
  })
}

async function confirmOrder() {
  if (!canTransition(order.value.status, 'COMPLETED')) {
    uni.showToast({ title: '当前状态不可确认', icon: 'none' })
    return
  }

  try {
    await orderService.confirmOrder(orderId.value)
    uni.showToast({ title: '确认完成', icon: 'success' })
    loadOrderDetail()
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

async function deliverOrder() {
  if (!canTransition(order.value.status, 'WAITING_CONFIRM')) {
    uni.showToast({ title: '当前状态不可送达', icon: 'none' })
    return
  }

  try {
    await orderService.deliverOrder(orderId.value)
    uni.showToast({ title: '已送达', icon: 'success' })
    loadOrderDetail()
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #FF6B6B;
$primary-light: #FFF0F0;
$secondary-color: #FF8C42;
$success-color: #34C759;
$warning-color: #FF9500;
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

.status-bar {
  padding: 36px 15px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -20%;
    width: 140%;
    height: 200%;
    background: radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .status-text {
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
    position: relative;
    z-index: 1;
  }

  &.status-pending { 
    background: linear-gradient(135deg, #FF9500 0%, #FFB347 100%); 
  }
  &.status-in_progress { 
    background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%); 
  }
  &.status-waiting_confirm { 
    background: linear-gradient(135deg, #722ed1 0%, #9254de 100%); 
  }
  &.status-completed { 
    background: linear-gradient(135deg, $success-color 0%, #6EE7A0 100%); 
  }
  &.status-cancelled { 
    background: linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%); 
  }
}

.order-info {
  padding: 16px;

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #F3F4F6;

    &:last-child { border-bottom: none; }

    .label {
      font-size: 14px;
      color: $text-secondary;
      width: 85px;
      font-weight: 500;
    }

    .value {
      flex: 1;
      font-size: 14px;
      color: $text-primary;
      text-align: right;
      font-weight: 500;

      &.highlight {
        color: $primary-color;
        font-weight: 600;
      }

      &.highlight-red {
        color: $primary-color;
        font-weight: 700;
        font-size: 16px;
      }
    }

    .value-row {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;

      .value { text-align: right; }

      button {
        font-size: 12px;
        padding: 4px 12px;
        border-radius: 6px;
        background: $primary-light;
        color: $primary-color;
        border: none;
        font-weight: 600;
      }
    }
  }

  .sensitive-info-section {
    margin-top: 16px;
    padding: 14px;
    background: $primary-light;
    border-radius: $border-radius;
    border-left: 4px solid $primary-color;

    .section-title {
      font-size: 13px;
      color: $primary-color;
      font-weight: 700;
      margin-bottom: 10px;
    }
  }

  .sensitive-info {
    margin-top: 16px;
  }

  .guarantee-card {
    margin-top: 12px;
  }

  .tips-card {
    margin-top: 12px;
    border-left: 4px solid $primary-color;
    border-radius: $border-radius;

    &.warning {
      border-left-color: $warning-color;
    }

    .tips-content {
      .tips-text {
        font-size: 14px;
        color: $text-secondary;
        line-height: 1.6;
      }
    }

    .tips-actions {
      margin-top: 16px;
      display: flex;
      justify-content: center;
      
      button {
        background: $primary-color;
        border: none;
        border-radius: 8px;
        font-weight: 600;
      }
    }
  }
}

.locked-order-info {
  padding: 16px;

  .locked-card {
    border: 1px solid #E5E7EB;
    background: #FFFFFF;
  }

  .locked-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;

    .locked-title {
      font-size: 18px;
      font-weight: 700;
      color: $text-primary;
      margin-top: 16px;
    }

    .locked-desc {
      font-size: 14px;
      color: $text-secondary;
      margin-top: 8px;
      margin-bottom: 24px;
    }

    .accept-btn {
      width: 100%;
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      border: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 16px;
      padding: 12px 0;
    }
  }
}

.steps-wrapper {
  padding: 10px 0;
}

.footer-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #FFFFFF;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.06);
  display: flex;
  gap: 12px;

  .cancel-btn {
    flex: 1;
    background: #FFFFFF;
    color: $text-primary;
    border: 1.5px solid #E5E7EB;
    border-radius: 10px;
    font-weight: 600;
    font-size: 15px;
  }

  .confirm-btn,
  .deliver-btn {
    flex: 1;
    background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 15px;
  }
}
</style>
