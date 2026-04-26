<template>
  <view class="page">
    <view class="avatar-section">
      <text class="label">头像</text>
      <view class="avatar-wrapper" @click="chooseAvatar">
        <image :src="formData.avatar" class="avatar" mode="aspectFill" />
        <uni-icons type="right" size="16" color="#999"></uni-icons>
      </view>
    </view>

    <uni-forms ref="formRef" :model="formData" :rules="rules">
      <uni-forms-item label="昵称" name="nickname" required>
        <uni-easyinput v-model="formData.nickname" placeholder="请输入昵称" />
      </uni-forms-item>

      <uni-forms-item label="学校" name="school" required>
        <uni-easyinput v-model="formData.school" placeholder="请输入学校" />
      </uni-forms-item>

      <uni-forms-item label="年级" name="grade" required>
        <uni-data-select
          v-model="formData.grade"
          :localdata="gradeOptions"
          placeholder="请选择年级"
        />
      </uni-forms-item>
    </uni-forms>

    <view class="submit-wrapper">
      <button type="primary" @click="saveProfile">保存</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user-store'

const userStore = useUserStore()
const formRef = ref(null)

const formData = reactive({
  avatar: '/static/logo.png',
  nickname: '',
  school: '',
  grade: ''
})

const gradeOptions = [
  { value: '大一', text: '大一' },
  { value: '大二', text: '大二' },
  { value: '大三', text: '大三' },
  { value: '大四', text: '大四' },
  { value: '研究生', text: '研究生' }
]

const rules = {
  nickname: { rules: [{ required: true, errorMessage: '请输入昵称' }] },
  school: { rules: [{ required: true, errorMessage: '请输入学校' }] },
  grade: { rules: [{ required: true, errorMessage: '请选择年级' }] }
}

onMounted(() => {
  const user = userStore.userInfo
  if (user) {
    formData.nickname = user.nickname || ''
    formData.school = user.school || ''
    formData.grade = user.grade || ''
    formData.avatar = user.avatar || '/static/logo.png'
  }
})

function chooseAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.avatar = res.tempFilePaths[0]
    }
  })
}

function saveProfile() {
  formRef.value.validate().then(() => {
    userStore.setUserInfo(formData)
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  }).catch(() => {
    uni.showToast({ title: '请完整填写所有必填项', icon: 'none' })
  })
}
</script>

<style lang="scss" scoped>
$primary-color: #FF6B6B;
$primary-light: #FFF0F0;
$secondary-color: #FF8C42;
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

.avatar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  padding: 16px;
  border-radius: $border-radius;
  margin-bottom: 12px;
  box-shadow: $card-shadow;

  .label {
    font-size: 15px;
    color: $text-primary;
    font-weight: 600;
  }

  .avatar-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid $primary-light;
    }
  }
}

.submit-wrapper {
  margin-top: 24px;
  
  button {
    background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
    border: none;
    border-radius: $border-radius;
    font-weight: 600;
    font-size: 16px;
    height: 48px;
  }
}
</style>
