<template>
  <view class="page">
    <view class="custom-nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="back-btn" @click="goBack">
        <uni-icons type="left" size="24" color="#333"></uni-icons>
      </view>
      <text class="nav-title">{{ navTitle }}</text>
      <view class="placeholder"></view>
    </view>

    <scroll-view scroll-y class="editor-wrapper">
      <view class="campus-selector">
        <text class="label">选择校区</text>
        <uni-data-checkbox
          v-model="formData.campus"
          :localdata="campusOptions"
        />
      </view>

      <view class="content-editor">
        <uni-easyinput
          v-model="formData.title"
          placeholder="请输入标题（选填）"
          :inputBorder="false"
          class="title-input"
        />
        <uni-easyinput
          v-model="formData.content"
          type="textarea"
          placeholder="说点什么吧..."
          :maxlength="1000"
          :inputBorder="false"
          class="content-input"
        />
        <text class="word-count">{{ (formData.content || '').length }}/1000</text>
      </view>

      <view class="image-upload">
        <uni-file-picker
          v-model="formData.images"
          fileMediatype="image"
          :limit="9"
          :image-styles="imageStyles"
          mode="grid"
          title="上传图片/视频"
        />
      </view>

      <view class="contact-input">
        <uni-easyinput
          v-model="formData.contact"
          placeholder="联系方式（选填）"
          :inputBorder="false"
        />
      </view>

      <view class="switches">
        <view class="switch-item">
          <text>匿名发布</text>
          <switch
            :checked="formData.anonymous"
            @change="onAnonymousChange"
            color="#1890ff"
          />
        </view>
        <view class="switch-item">
          <text>发布后置顶</text>
          <switch
            :checked="formData.top"
            @change="onTopChange"
            color="#1890ff"
          />
        </view>
      </view>

      <uni-notice-bar
        showIcon
        text="禁止发布重复信息、广告、二维码等内容，违规会被禁言"
        background-color="#fff7e6"
        color="#fa8c16"
      />

      <view class="submit-wrapper">
        <button type="primary" @click="submitPost">发布</button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user-store'
import { postService } from '@/services/post-service'

const userStore = useUserStore()

const statusBarHeight = ref(0)
const navTitle = ref('发布帖子')
const selectedType = ref('')
const selectedLabel = ref('')

const formData = reactive({
  title: '',
  content: '',
  campus: '',
  contact: '',
  images: [],
  anonymous: false,
  top: false
})

const campusOptions = [
  { value: '江宁校区', text: '江宁校区' },
  { value: '幕府校区', text: '幕府校区' }
]

const imageStyles = {
  width: 80,
  height: 80
}

onLoad((options) => {
  selectedType.value = options.type || ''
  selectedLabel.value = options.label || ''
  
  if (selectedLabel.value) {
    navTitle.value = `发布${selectedLabel.value}`
  }
  
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  if (!selectedType.value) {
    uni.showToast({ title: '参数错误', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})

function goBack() {
  uni.navigateBack()
}

function onAnonymousChange(e) {
  formData.anonymous = e.detail.value
}

function onTopChange(e) {
  formData.top = e.detail.value
}

async function submitPost() {
  if (!formData.content.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  if (!formData.campus) {
    uni.showToast({ title: '请选择校区', icon: 'none' })
    return
  }

  try {
    await postService.createPost({
      ...formData,
      type: selectedType.value,
      userId: userStore.userInfo?.id
    })
    uni.$emit('refreshPosts')
    uni.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1500)
  } catch (e) {
    uni.showToast({ title: '发布失败，请检查网络', icon: 'none' })
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
  display: flex;
  flex-direction: column;
}

.custom-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;

  .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: background 0.2s ease;
    
    &:active {
      background: #f5f5f5;
    }
  }

  .nav-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
  }

  .placeholder {
    width: 40px;
  }
}

.editor-wrapper {
  flex: 1;
  padding: 16px;

  .campus-selector {
    background: #FFFFFF;
    border-radius: $border-radius;
    padding: 16px;
    margin-bottom: 8px;
    box-shadow: $card-shadow;

    .label {
      font-size: 14px;
      color: $text-primary;
      margin-bottom: 12px;
      display: block;
      font-weight: 600;
    }
  }

  .content-editor {
    background: #FFFFFF;
    border-radius: $border-radius;
    padding: 16px;
    margin-bottom: 8px;
    box-shadow: $card-shadow;

    .title-input {
      margin-bottom: 12px;
    }

    .word-count {
      font-size: 12px;
      color: $text-muted;
      text-align: right;
      display: block;
      margin-top: 8px;
      font-weight: 500;
    }
  }

  .image-upload {
    background: #FFFFFF;
    border-radius: $border-radius;
    padding: 16px;
    margin-bottom: 8px;
    box-shadow: $card-shadow;
  }

  .contact-input {
    background: #FFFFFF;
    border-radius: $border-radius;
    padding: 16px;
    margin-bottom: 8px;
    box-shadow: $card-shadow;
  }

  .switches {
    background: #FFFFFF;
    border-radius: $border-radius;
    padding: 16px;
    margin-bottom: 8px;
    box-shadow: $card-shadow;

    .switch-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #F3F4F6;

      &:last-child { border-bottom: none; }
      
      text {
        font-size: 14px;
        color: $text-primary;
        font-weight: 500;
      }
    }
  }

  .submit-wrapper {
    margin-top: 24px;
    margin-bottom: 20px;
    
    button {
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      border: none;
      border-radius: $border-radius;
      font-weight: 600;
      font-size: 16px;
      height: 48px;
    }
  }
}
</style>
