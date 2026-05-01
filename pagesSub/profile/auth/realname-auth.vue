<template>
  <view class="page">
    <view class="banner">
      <uni-icons type="person" size="60" color="#1890ff"></uni-icons>
      <text class="banner-title">实名认证</text>
      <text class="banner-desc">完成实名认证后可享受更全面的平台服务</text>
    </view>

    <view class="form-section">
      <view class="form-title">身份信息</view>
      
      <view class="form-group">
        <view class="form-label">真实姓名</view>
        <input v-model="formData.name" placeholder="请输入真实姓名" class="form-input" />
      </view>

      <view class="form-group">
        <view class="form-label">身份证号</view>
        <input 
          v-model="formData.idNumber" 
          placeholder="请输入身份证号码" 
          class="form-input" 
          maxlength="18"
        />
      </view>

      <view class="form-group">
        <view class="form-label">身份证正面</view>
        <view class="upload-area" @click="uploadImage('front')">
          <image v-if="formData.frontImage" :src="formData.frontImage" class="uploaded-image" mode="aspectFill" />
          <view v-else class="upload-placeholder">
            <uni-icons type="camera" size="40" color="#ccc"></uni-icons>
            <text class="upload-text">点击上传身份证正面</text>
          </view>
        </view>
      </view>

      <view class="form-group">
        <view class="form-label">身份证反面</view>
        <view class="upload-area" @click="uploadImage('back')">
          <image v-if="formData.backImage" :src="formData.backImage" class="uploaded-image" mode="aspectFill" />
          <view v-else class="upload-placeholder">
            <uni-icons type="camera" size="40" color="#ccc"></uni-icons>
            <text class="upload-text">点击上传身份证反面</text>
          </view>
        </view>
      </view>

      <view class="tip-card">
        <uni-icons type="info" size="16" color="#faad14"></uni-icons>
        <text class="tip-text">请确保身份证信息清晰可见，我们将严格保护您的隐私</text>
      </view>

      <button 
        type="primary" 
        class="submit-btn" 
        :disabled="!canSubmit || submitting" 
        @click="submitAuth"
      >
        {{ submitting ? '提交中...' : '提交认证' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const formData = ref({
  name: '',
  idNumber: '',
  frontImage: '',
  backImage: ''
})

const submitting = ref(false)

const canSubmit = computed(() => {
  return formData.value.name && 
         formData.value.idNumber && 
         formData.value.frontImage && 
         formData.value.backImage
})

function uploadImage(type) {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      if (type === 'front') {
        formData.value.frontImage = res.tempFilePaths[0]
      } else {
        formData.value.backImage = res.tempFilePaths[0]
      }
    }
  })
}

function submitAuth() {
  if (!canSubmit.value) {
    uni.showToast({ title: '请完善认证信息', icon: 'none' })
    return
  }

  if (formData.value.idNumber.length !== 18) {
    uni.showToast({ title: '请输入正确的18位身份证号', icon: 'none' })
    return
  }

  uni.showModal({
    title: '确认提交',
    content: '提交后将在1-3个工作日内完成审核',
    success: (res) => {
      if (res.confirm) {
        submitting.value = true
        setTimeout(() => {
          submitting.value = false
          uni.showToast({ title: '提交成功，请等待审核', icon: 'success' })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }, 2000)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
$primary-color: #1890ff;
$bg-color: #F8F9FA;
$text-primary: #1A1A2E;
$text-secondary: #6B7280;
$text-muted: #9CA3AF;
$border-color: #F0F0F0;

.page {
  min-height: 100vh;
  background-color: $bg-color;
  padding-bottom: 30px;
}

.banner {
  background: linear-gradient(135deg, $primary-color 0%, #40a9ff 100%);
  padding: 40px 20px;
  text-align: center;
  color: #FFFFFF;

  .banner-title {
    display: block;
    font-size: 24px;
    font-weight: 700;
    margin-top: 16px;
    margin-bottom: 8px;
  }

  .banner-desc {
    display: block;
    font-size: 13px;
    opacity: 0.9;
    line-height: 1.5;
  }
}

.form-section {
  padding: 20px 16px;

  .form-title {
    font-size: 18px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 20px;

    .form-label {
      font-size: 14px;
      color: $text-secondary;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .form-input {
      width: 100%;
      height: 44px;
      background: #FFFFFF;
      border: 1px solid $border-color;
      border-radius: 8px;
      padding: 0 12px;
      font-size: 15px;
      color: $text-primary;
      box-sizing: border-box;
    }

    .upload-area {
      width: 100%;
      height: 120px;
      background: #FFFFFF;
      border: 2px dashed $border-color;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;

      .uploaded-image {
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }

      .upload-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .upload-text {
          font-size: 13px;
          color: $text-muted;
        }
      }
    }
  }

  .tip-card {
    background: #fffbe6;
    border: 1px solid #ffe58f;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;

    .tip-text {
      font-size: 13px;
      color: #faad14;
      flex: 1;
    }
  }

  .submit-btn {
    margin-top: 10px;
    height: 48px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, $primary-color 0%, #40a9ff 100%);
    border: none;

    &[disabled] {
      opacity: 0.5;
    }
  }
}
</style>
