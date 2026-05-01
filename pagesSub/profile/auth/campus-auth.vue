<template>
  <view class="page">
    <view class="banner">
      <uni-icons type="checkmarkempty" size="60" color="#52c41a"></uni-icons>
      <text class="banner-title">校园认证</text>
      <text class="banner-desc">完成认证后可解锁全部功能，包括互助跑腿、订单接单等</text>
    </view>

    <view class="form-section">
      <view class="form-title">认证信息</view>
      
      <view class="form-group">
        <view class="form-label">姓名</view>
        <input v-model="formData.name" placeholder="请输入真实姓名" class="form-input" />
      </view>

      <view class="form-group">
        <view class="form-label">学号</view>
        <input v-model="formData.studentId" placeholder="请输入学号" class="form-input" />
      </view>

      <view class="form-group">
        <view class="form-label">学院</view>
        <input v-model="formData.department" placeholder="请输入所在学院" class="form-input" />
      </view>

      <view class="form-group">
        <view class="form-label">年级</view>
        <picker mode="selector" :range="gradeOptions" @change="onGradeChange" :value="gradeIndex">
          <view :class="['form-input', 'picker', { placeholder: !formData.grade }]">
            {{ formData.grade || '请选择年级' }}
          </view>
        </picker>
      </view>

      <view class="form-group">
        <view class="form-label">学生证照片</view>
        <view class="upload-area" @click="uploadImage">
          <image v-if="formData.image" :src="formData.image" class="uploaded-image" mode="aspectFill" />
          <view v-else class="upload-placeholder">
            <uni-icons type="camera" size="40" color="#ccc"></uni-icons>
            <text class="upload-text">点击上传学生证</text>
          </view>
        </view>
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
  studentId: '',
  department: '',
  grade: '',
  image: ''
})

const gradeOptions = ['大一', '大二', '大三', '大四', '研究生']
const gradeIndex = ref(-1)
const submitting = ref(false)

const canSubmit = computed(() => {
  return formData.value.name && 
         formData.value.studentId && 
         formData.value.department && 
         formData.value.grade && 
         formData.value.image
})

function onGradeChange(e) {
  gradeIndex.value = e.detail.value
  formData.value.grade = gradeOptions[e.detail.value]
}

function uploadImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.image = res.tempFilePaths[0]
    }
  })
}

function submitAuth() {
  if (!canSubmit.value) {
    uni.showToast({ title: '请完善认证信息', icon: 'none' })
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
$primary-color: #52c41a;
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
  background: linear-gradient(135deg, $primary-color 0%, #73d13d 100%);
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

      &.picker {
        display: flex;
        align-items: center;
      }

      &.placeholder {
        color: $text-muted;
      }
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

  .submit-btn {
    margin-top: 30px;
    height: 48px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, $primary-color 0%, #73d13d 100%);
    border: none;

    &[disabled] {
      opacity: 0.5;
    }
  }
}
</style>
