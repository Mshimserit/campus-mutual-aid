<template>
  <view class="page">
    <view class="auth-tip">
      <uni-notice-bar
        showIcon
        text="完成校园认证和实名认证后，就能申请成为骑手接单赚米了~"
        background-color="#fff7e6"
        color="#fa8c16"
      />
    </view>

    <view class="steps-wrapper">
      <uni-steps :options="authSteps" :active="currentStep" active-color="#1890ff" />
    </view>

    <view class="auth-cards">
      <view class="auth-card">
        <view class="card-header">
          <text class="card-title">1 校园认证</text>
          <uni-tag text="已完成" type="success" />
        </view>
        <text class="card-desc">上传学生证相关信息，认证你的学生身份</text>
      </view>

      <view class="auth-card">
        <view class="card-header">
          <text class="card-title">2 实名认证</text>
          <uni-tag text="待完成" type="primary" />
        </view>
        <text class="card-desc">上传身份证对接权威库认证，后续提现更高效</text>
      </view>

      <view class="auth-card">
        <view class="card-header">
          <text class="card-title">3 联系号码</text>
        </view>
        <text class="card-desc">展示给发单同学方便联系</text>
        <text class="phone-number">{{ maskedPhone }}</text>
      </view>
    </view>

    <view class="action-wrapper">
      <button type="primary" @click="completeAuth">完善信息</button>
    </view>

    <view class="contact-wrapper">
      <text class="contact-link" @click="contactService">联系客服</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user-store'

const userStore = useUserStore()

const currentStep = ref(1)

const authSteps = [
  { title: '校园认证' },
  { title: '实名认证' },
  { title: '成为骑手' }
]

const maskedPhone = computed(() => {
  const phone = userStore.userInfo?.phone || '187****8429'
  return phone
})

function completeAuth() {
  uni.showToast({ title: '请上传身份证进行实名认证', icon: 'none' })
}

function contactService() {
  uni.showToast({ title: '联系客服', icon: 'none' })
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
  padding: 16px;
}

.auth-tip {
  margin-bottom: 16px;
}

.steps-wrapper {
  background: #FFFFFF;
  padding: 20px 16px;
  border-radius: $border-radius;
  margin-bottom: 16px;
  box-shadow: $card-shadow;
}

.auth-cards {
  .auth-card {
    background: #FFFFFF;
    border-radius: $border-radius;
    padding: 16px;
    margin-bottom: 10px;
    box-shadow: $card-shadow;
    transition: all 0.2s ease;
    
    &:active {
      transform: scale(0.98);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .card-title {
        font-size: 16px;
        font-weight: 700;
        color: $text-primary;
      }
    }

    .card-desc {
      font-size: 14px;
      color: $text-secondary;
      display: block;
      margin-bottom: 10px;
      line-height: 1.5;
    }

    .phone-number {
      font-size: 16px;
      color: $primary-color;
      font-weight: 700;
    }
  }
}

.action-wrapper {
  margin-top: 24px;
  
  button {
    background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
    height: 48px;
  }
}

.contact-wrapper {
  text-align: center;
  margin-top: 20px;

  .contact-link {
    color: $primary-color;
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
