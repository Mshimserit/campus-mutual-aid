<template>
  <view class="page">
    <view class="order-preview">
      <uni-card title="订单信息" :isShadow="true">
        <view class="info-row">
          <text class="label">任务描述</text>
          <text class="value">{{ orderInfo.description }}</text>
        </view>
        <view class="info-row">
          <text class="label">互助时间</text>
          <text class="value">{{ orderInfo.helpTime }}</text>
        </view>
        <view class="info-row">
          <text class="label">互助地点</text>
          <text class="value">{{ orderInfo.campus }}</text>
        </view>
        <view class="info-row">
          <text class="label">联系号码</text>
          <text class="value">{{ orderInfo.phone }}</text>
        </view>
      </uni-card>
    </view>

    <view class="payment-section">
      <text class="section-title">支付方式</text>
      <view class="payment-methods">
        <view
          :class="['payment-method', { selected: selectedMethod === 'wechat' }]"
          @click="selectPaymentMethod('wechat')"
        >
          <uni-icons type="weixin" size="40" color="#07c160" style="margin-right: 15px;"></uni-icons>
          <text class="method-name">微信支付</text>
          <uni-icons v-if="selectedMethod === 'wechat'" type="checkmark" size="20" color="#1890ff"></uni-icons>
        </view>
      </view>
    </view>

    <view class="amount-section">
      <view class="amount-row">
        <text class="amount-label">悬赏佣金</text>
        <text class="amount-value">¥{{ orderInfo.amount }}</text>
      </view>
      <view class="amount-row">
        <text class="fee-label">平台服务费</text>
        <text class="fee-value">¥{{ platformFee }}</text>
      </view>
      <view class="amount-divider"></view>
      <view class="amount-row total">
        <text class="total-label">合计</text>
        <text class="total-value">¥{{ totalAmount }}</text>
      </view>
    </view>

    <view class="notice-section">
      <uni-notice-bar showIcon text="支付成功后，佣金将冻结至平台担保账户，订单进入待确认状态" />
    </view>

    <view class="footer-action">
      <button
        type="primary"
        :loading="paying"
        :disabled="paying"
        @click="handlePayment"
      >
        确认支付 ¥{{ totalAmount }}
      </button>
    </view>

    <uni-popup ref="successPopup" type="center" :maskClick="false">
      <view class="success-popup">
        <uni-icons type="checkmarkcircle" size="60" color="#52c41a"></uni-icons>
        <text class="success-title">支付成功</text>
        <text class="success-desc">订单已发布，等待接单中</text>
        <button type="primary" @click="goToOrderList">查看订单</button>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/order-store'
import { orderService } from '@/services/order-service'
import { PLATFORM_FEE_RATE } from '@/config'

const orderStore = useOrderStore()

const orderId = ref('')

const orderInfo = ref({
  description: '',
  helpTime: '',
  campus: '',
  phone: '',
  amount: 0
})

const selectedMethod = ref('wechat')
const paying = ref(false)

const platformFee = computed(() => {
  const feeCents = Math.round(orderInfo.value.amount * 100 * PLATFORM_FEE_RATE)
  return (feeCents / 100).toFixed(2)
})

const totalAmount = computed(() => {
  const amountCents = Math.round(orderInfo.value.amount * 100)
  const feeCents = Math.round(orderInfo.value.amount * 100 * PLATFORM_FEE_RATE)
  return ((amountCents + feeCents) / 100).toFixed(2)
})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}

  if (options.data) {
    try {
      const data = JSON.parse(decodeURIComponent(options.data))
      orderId.value = data.orderId || ''
      orderInfo.value = {
        description: data.description || '',
        helpTime: data.helpTime || '',
        campus: data.campus || '',
        phone: data.phone || '',
        amount: data.amount || 0
      }
    } catch (e) {
      console.error('Failed to parse order data:', e)
    }
  } else if (options.orderId) {
    orderId.value = options.orderId
    orderInfo.value = {
      description: decodeURIComponent(options.description || ''),
      helpTime: decodeURIComponent(options.helpTime || ''),
      campus: decodeURIComponent(options.campus || ''),
      phone: decodeURIComponent(options.phone || ''),
      amount: parseFloat(options.amount || 0)
    }
  }
})

function selectPaymentMethod(method) {
  selectedMethod.value = method
}

async function handlePayment() {
  if (paying.value) return

  paying.value = true

  try {
    await mockPayment()
    
    await orderStore.payOrder(orderId.value)
    
    successPopup.value.open()
  } catch (e) {
    uni.showToast({
      title: '支付失败，请重试',
      icon: 'none'
    })
  } finally {
    paying.value = false
  }
}

function mockPayment() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 1500)
  })
}

function goToOrderList() {
  successPopup.value?.close()
  uni.switchTab({ url: '/pages/mutual/list/list' })
}
</script>

<style lang="scss" scoped>
$primary-color: #FF6B6B;
$primary-light: #FFF0F0;
$secondary-color: #FF8C42;
$success-color: #34C759;
$text-primary: #1A1A2E;
$text-secondary: #6B7280;
$bg-color: #F8F9FA;
$card-shadow: 0 2px 16px rgba(0,0,0,0.06);
$border-radius: 12px;

.page {
  min-height: 100vh;
  background-color: $bg-color;
  padding-bottom: 100px;
}

.order-preview {
  padding: 16px;

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #F3F4F6;

    &:last-child {
      border-bottom: none;
    }

    .label {
      font-size: 14px;
      color: $text-secondary;
      font-weight: 500;
    }

    .value {
      font-size: 14px;
      color: $text-primary;
      max-width: 60%;
      text-align: right;
      font-weight: 500;
    }
  }
}

.payment-section {
  background: #FFFFFF;
  padding: 16px;
  margin-bottom: 8px;
  box-shadow: $card-shadow;

  .section-title {
    font-size: 15px;
    font-weight: 700;
    color: $text-primary;
    display: block;
    margin-bottom: 16px;
  }

  .payment-methods {
    .payment-method {
      display: flex;
      align-items: center;
      padding: 16px;
      border: 1.5px solid #E5E7EB;
      border-radius: $border-radius;
      margin-bottom: 10px;
      transition: all 0.2s ease;
      
      &:active {
        transform: scale(0.98);
      }

      &:last-child {
        margin-bottom: 0;
      }

      &.selected {
        border-color: $primary-color;
        background: $primary-light;
        box-shadow: 0 2px 8px rgba(255, 107, 107, 0.15);
      }

      .method-name {
        flex: 1;
        font-size: 15px;
        color: $text-primary;
        font-weight: 600;
      }
    }
  }
}

.amount-section {
  background: #FFFFFF;
  padding: 16px;
  margin-bottom: 8px;
  box-shadow: $card-shadow;

  .amount-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;

    .amount-label,
    .fee-label {
      font-size: 14px;
      color: $text-secondary;
      font-weight: 500;
    }

    .amount-value,
    .fee-value {
      font-size: 14px;
      color: $text-primary;
      font-weight: 500;
    }

    &.total {
      padding-top: 14px;
      
      .total-label {
        font-size: 16px;
        font-weight: 700;
        color: $text-primary;
      }

      .total-value {
        font-size: 24px;
        font-weight: 700;
        color: $primary-color;
      }
    }
  }

  .amount-divider {
    height: 1px;
    background: #F3F4F6;
    margin: 4px 0;
  }
}

.notice-section {
  padding: 0 16px;
  margin-top: 8px;
}

.footer-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #FFFFFF;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.06);

  button {
    width: 100%;
    height: 48px;
    line-height: 48px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
    border: none;
  }
}

.success-popup {
  width: 280px;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);

  .success-title {
    font-size: 18px;
    font-weight: 700;
    color: $text-primary;
    margin-top: 16px;
  }

  .success-desc {
    font-size: 14px;
    color: $text-secondary;
    margin-top: 8px;
    margin-bottom: 24px;
  }

  button {
    width: 100%;
    background: linear-gradient(135deg, $success-color 0%, #6EE7A0 100%);
    border: none;
    border-radius: 10px;
    font-weight: 600;
  }
}
</style>
