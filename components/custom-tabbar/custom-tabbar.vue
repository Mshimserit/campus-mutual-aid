<template>
  <view class="custom-tabbar">
    <view
      v-for="tab in tabs"
      :key="tab.path"
      class="tabbar-item"
      :class="{ active: currentPath === tab.path }"
      @click="switchTab(tab)"
    >
      <view v-if="tab.isCenter" class="center-btn">
        <uni-icons :type="tab.icon" :size="26" color="#ffffff"></uni-icons>
      </view>
      <template v-else>
        <uni-icons
          :type="currentPath === tab.path ? tab.activeIcon : tab.icon"
          :size="24"
          :color="currentPath === tab.path ? selectedColor : color"
        ></uni-icons>
        <text class="tabbar-text" :style="{ color: currentPath === tab.path ? selectedColor : color }">
          {{ tab.text }}
        </text>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  selected: {
    type: Number,
    default: 0
  }
})

const color = '#999999'
const selectedColor = '#1890ff'

const tabs = [
  {
    icon: 'home',
    activeIcon: 'home-filled',
    text: '首页',
    path: '/pages/index/index'
  },
  {
    icon: 'staff',
    activeIcon: 'staff-filled',
    text: '互助',
    path: '/pages/mutual/list/list'
  },
  {
    icon: 'plusempty',
    activeIcon: 'plusempty',
    text: '发布',
    path: '/pages/post/post',
    isCenter: true
  },
  {
    icon: 'chat',
    activeIcon: 'chat-filled',
    text: '消息',
    path: '/pages/message/message'
  },
  {
    icon: 'person',
    activeIcon: 'person-filled',
    text: '我的',
    path: '/pages/profile/index/index'
  }
]

const currentPath = ref('')

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  currentPath.value = '/' + currentPage.route
})

function switchTab(tab) {
  if (currentPath.value === tab.path) return
  uni.switchTab({ url: tab.path })
}
</script>

<style lang="scss" scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #ffffff;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  transition: all 0.2s ease;

  &:active {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.tabbar-text {
  font-size: 20rpx;
  margin-top: 4rpx;
  line-height: 1.2;
}

.center-btn {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -32rpx;
  box-shadow: 0 4rpx 16rpx rgba(255, 107, 107, 0.4);

  &:active {
    transform: scale(0.92);
    box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.3);
  }
}
</style>