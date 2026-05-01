<template>
  <view class="page">
    <view class="withdraw-header">
      <text class="label">可提现金额</text>
      <view class="amount-row">
        <text class="currency">¥</text>
        <text class="amount">{{ withdrawableAmount }}</text>
      </view>
    </view>

    <view class="form-section">
      <view class="form-item">
        <text class="form-label">提现金额</text>
        <view class="input-wrapper">
          <text class="input-prefix">¥</text>
          <input
            type="digit"
            v-model="withdrawAmount"
            class="amount-input"
            placeholder="输入提现金额"
            :maxlength="10"
            @input="onAmountInput"
          />
        </view>
      </view>

      <view class="quick-amounts">
        <view
          v-for="amount in quickAmounts"
          :key="amount"
          :class="['quick-item', { selected: withdrawAmount == amount }]"
          @click="selectQuickAmount(amount)"
        >
          {{ amount }}元
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">到账方式</text>
        <view class="payment-method selected">
          <image src="/static/wechat-pay.png" class="method-icon" mode="aspectFit" />
          <text class="method-name">微信零钱</text>
          <uni-icons type="checkmark" size="20" color="#1890ff"></uni-icons>
        </view>
      </view>

      <view class="form-item info-item">
        <uni-icons type="info" size="16" color="#1890ff"></uni-icons>
        <text class="info-text">提现将扣除 ¥{{ withdrawalFee }} 手续费</text>
      </view>
    </view>

    <view class="notice-section">
      <uni-card title="提现须知" :isShadow="true">
        <view class="notice-list">
          <text class="notice-item">1. 提现最低金额为 ¥1.00</text>
          <text class="notice-item">2. 每日最多提现 3 次</text>
          <text class="notice-item">3. 提现将在 1-3 个工作日内到账</text>
          <text class="notice-item">4. 如有问题请联系客服</text>
        </view>
      </uni-card>
    </view>

    <view class="footer-action">
      <button
        type="primary"
        :disabled="!canWithdraw || withdrawing"
        :loading="withdrawing"
        @click="handleWithdraw"
      >
        提现
      </button>
    </view>

    <uni-popup ref="successPopup" type="center" :maskClick="false">
      <view class="success-popup">
        <uni-icons type="checkmarkcircle" size="60" color="#52c41a"></uni-icons>
        <text class="success-title">提现申请已提交</text>
        <text class="success-desc">预计 1-3 个工作日内到账</text>
        <button type="primary" @click="goBack">完成</button>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWalletStore } from '@/stores/wallet-store'

const walletStore = useWalletStore()

const withdrawAmount = ref('')
const withdrawing = ref(false)

const quickAmounts = [10, 20, 50, 100, 200]

const withdrawableAmount = computed(() => {
  return walletStore.withdrawable.toFixed(2)
})

const withdrawalFee = computed(() => {
  const amount = parseFloat(withdrawAmount.value) || 0
  return (amount * 0.01).toFixed(2)
})

const actualAmount = computed(() => {
  const amount = parseFloat(withdrawAmount.value) || 0
  return (amount - amount * 0.01).toFixed(2)
})

const canWithdraw = computed(() => {
  const amount = parseFloat(withdrawAmount.value) || 0
  return amount >= 1 && amount <= walletStore.withdrawable
})

function onAmountInput() {
  const amount = parseFloat(withdrawAmount.value) || 0
  if (amount > walletStore.withdrawable) {
    withdrawAmount.value = walletStore.withdrawable.toString()
  }
}

function selectQuickAmount(amount) {
  withdrawAmount.value = Math.min(amount, walletStore.withdrawable).toString()
}

async function handleWithdraw() {
  if (!canWithdraw.value || withdrawing.value) return

  const amount = parseFloat(withdrawAmount.value)
  if (amount < 1) {
    uni.showToast({ title: '最低提现金额为 ¥1.00', icon: 'none' })
    return
  }

  withdrawing.value = true

  try {
    await mockWithdraw(amount)
    walletStore.withdraw(amount)
    successPopup.value.open()
  } catch (e) {
    uni.showToast({ title: '提现失败，请重试', icon: 'none' })
  } finally {
    withdrawing.value = false
  }
}

function mockWithdraw(amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        resolve({ success: true })
      } else {
        reject(new Error('Withdraw failed'))
      }
    }, 1500)
  })
}

function goBack() {
  successPopup.value.close()
  uni.navigateBack()
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
  padding-bottom: 100px;
}

.withdraw-header {
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  padding: 36px 16px;
  color: #FFFFFF;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -10%;
    width: 200px;
    height: 200px;
    background: rgba(255,255,255,0.1);
    border-radius: 50%;
  }

  .label {
    font-size: 14px;
    opacity: 0.9;
    font-weight: 500;
    position: relative;
    z-index: 1;
  }

  .amount-row {
    display: flex;
    justify-content: center;
    align-items: baseline;
    margin-top: 12px;
    position: relative;
    z-index: 1;

    .currency {
      font-size: 24px;
      font-weight: 700;
    }

    .amount {
      font-size: 48px;
      font-weight: 700;
    }
  }
}

.form-section {
  background: #FFFFFF;
  padding: 16px;
  margin-top: 8px;
  box-shadow: $card-shadow;

  .form-item {
    margin-bottom: 16px;

    .form-label {
      font-size: 14px;
      color: $text-secondary;
      display: block;
      margin-bottom: 12px;
      font-weight: 600;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      border: 1.5px solid #E5E7EB;
      border-radius: $border-radius;
      padding: 12px 16px;
      transition: border-color 0.2s ease;
      
      &:focus-within {
        border-color: $primary-color;
      }

      .input-prefix {
        font-size: 24px;
        font-weight: 700;
        color: $text-primary;
        margin-right: 8px;
      }

      .amount-input {
        flex: 1;
        font-size: 24px;
        font-weight: 700;
        height: 36px;
        color: $text-primary;
      }
    }

    &.info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: $primary-light;
      border-radius: $border-radius;
      margin-top: 12px;

      .info-text {
        font-size: 13px;
        color: $primary-color;
        font-weight: 600;
      }
    }
  }

  .quick-amounts {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .quick-item {
      flex: 1;
      padding: 10px 0;
      text-align: center;
      background: $bg-color;
      border-radius: $border-radius;
      font-size: 14px;
      color: $text-secondary;
      font-weight: 500;
      transition: all 0.2s ease;
      
      &:active {
        transform: scale(0.95);
      }

      &.selected {
        background: $primary-light;
        color: $primary-color;
        border: 1.5px solid $primary-color;
        font-weight: 600;
      }
    }
  }

  .payment-method {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 1.5px solid #E5E7EB;
    border-radius: $border-radius;
    transition: all 0.2s ease;

    &.selected {
      border-color: $primary-color;
      background: $primary-light;
      box-shadow: 0 2px 8px rgba(255, 107, 107, 0.15);
    }

    .method-icon {
      width: 36px;
      height: 36px;
      margin-right: 12px;
    }

    .method-name {
      flex: 1;
      font-size: 15px;
      color: $text-primary;
      font-weight: 600;
    }
  }
}

.notice-section {
  padding: 16px;

  .notice-list {
    .notice-item {
      display: block;
      font-size: 13px;
      color: $text-secondary;
      line-height: 1.8;
    }
  }
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
    border-radius: $border-radius;
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
