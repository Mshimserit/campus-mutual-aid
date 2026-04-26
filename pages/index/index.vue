<template>
  <view class="page">
    <view class="header">
      <view class="header-left">
        <text class="logo-text">校园互助</text>
      </view>
      <view class="header-search" @click="goToSearch">
        <uni-icons type="search" size="16" color="#999"></uni-icons>
        <text class="search-placeholder">搜索帖子、用户</text>
      </view>
      <view class="header-right" @click="goToHot">
        <uni-icons type="fire" size="24" color="#333"></uni-icons>
      </view>
      <view class="header-message" @click="goToMessage">
        <uni-icons type="notification" size="24" color="#333"></uni-icons>
        <view v-if="unreadCount > 0" class="message-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</view>
      </view>
    </view>

    <view :class="['banner-container', { 'hidden': isScrollUp && hasHidden }]">
      <swiper 
        class="banner-swiper" 
        circular 
        autoplay 
        interval="4000" 
        duration="500"
        indicator-dots
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#FFFFFF"
      >
        <swiper-item 
          v-for="(banner, index) in banners" 
          :key="index"
          @click="onBannerClick(banner)"
        >
          <view class="banner-item" :style="{ background: banner.bgColor }">
            <text class="banner-title">{{ banner.title }}</text>
            <text class="banner-desc">{{ banner.desc }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view :class="['quick-actions', { 'hidden': isScrollUp && hasHidden }]">
      <view
        v-for="(item, index) in quickActions"
        :key="index"
        class="action-item"
        @click="onActionClick(item)"
      >
        <image :src="item.icon" class="action-icon" mode="aspectFit" @error="onImageError($event, index)" />
        <text class="action-text">{{ item.name }}</text>
      </view>
    </view>

    <view class="content-tabs">
      <scroll-view scroll-x class="tabs-scroll">
        <view
          v-for="tab in tabs"
          :key="tab.value"
          :class="['tab-item', { active: currentTab === tab.value }]"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
        </view>
      </scroll-view>
    </view>

    <scroll-view scroll-y class="post-list" @scroll="onPageScroll" @scrolltolower="loadMore">
      <view v-if="loading && posts.length === 0" class="loading-wrapper">
        <uni-load-more status="loading" />
      </view>

      <view v-else-if="posts.length === 0" class="empty-wrapper">
        <view class="empty-content">
          <image src="/static/logo.png" class="empty-icon" mode="aspectFit" />
          <text class="empty-text">暂无帖子</text>
        </view>
      </view>

      <view v-else>
        <view
          v-for="post in filteredPosts"
          :key="post.id"
          class="post-card"
          @click="goToPostDetail(post.id)"
        >
          <view class="post-header">
            <image :src="post.avatar" class="post-avatar" mode="aspectFill" @error="onAvatarError($event)" />
            <view class="post-info">
              <view class="post-name-row">
                <text class="post-nickname">{{ post.nickname }}</text>
                <view v-if="post.isTop" class="top-badge">置顶</view>
              </view>
              <text class="post-time">{{ post.createTime }}</text>
            </view>
            <uni-tag :text="post.tag" :type="getTagType(post.tagType)" size="small" />
          </view>

          <view class="post-content">
            <text class="post-title">{{ post.title }}</text>
            <text class="post-summary">{{ post.summary }}</text>
          </view>

          <view v-if="post.images && post.images.length > 0" class="post-images">
            <image
              v-for="(img, imgIndex) in post.images.slice(0, 3)"
              :key="imgIndex"
              :src="img"
              :class="['post-image', { 'single': post.images.length === 1 }]"
              mode="aspectFill"
              @error="onPostImageError($event, post.id, imgIndex)"
            />
            <view v-if="post.images.length > 3" class="image-more">
              +{{ post.images.length - 3 }}
            </view>
          </view>

          <view class="post-footer">
            <view class="footer-item" @click.stop="toggleLike(post)">
              <uni-icons :type="post.isLiked ? 'heart-filled' : 'heart'" :size="18" :color="post.isLiked ? '#ff4d4f' : '#999'"></uni-icons>
              <text class="footer-text">{{ post.likeCount }}</text>
            </view>
            <view class="footer-item" @click.stop="goToPostDetail(post.id)">
              <uni-icons type="chat" size="18" color="#999"></uni-icons>
              <text class="footer-text">{{ post.commentCount }}</text>
            </view>
            <view class="footer-item" @click.stop="toggleFavorite(post)">
              <uni-icons :type="post.isFavorite ? 'star-filled' : 'star'" :size="18" :color="post.isFavorite ? '#ffca3e' : '#999'"></uni-icons>
            </view>
          </view>
        </view>

        <uni-load-more v-if="posts.length > 0" :status="loading ? 'loading' : 'nomore'" />
      </view>
    </scroll-view>

    <custom-tabbar />
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMessageStore } from '@/stores/message-store'
import { postService } from '@/services/post-service'

const messageStore = useMessageStore()

const loading = ref(false)
const posts = ref([])
const currentTab = ref('latest')
const unreadCount = ref(0)

// 滚动控制
const isScrollUp = ref(false)
const lastScrollTop = ref(0)
const hideThreshold = ref(10)
const hasHidden = ref(false)

const banners = ref([
  { 
    title: '校园互助，暖心前行', 
    desc: '互帮互助，共建美好校园',
    bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%)',
    path: '/pages/mutual/list/list'
  },
  { 
    title: '周末活动：校园定向赛', 
    desc: '本周六上午 9 点，操场集合报名',
    bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    path: ''
  },
  { 
    title: '二手市场开张', 
    desc: '海量闲置好物等你来淘',
    bgColor: 'linear-gradient(135deg, #34C759 0%, #6EE7A0 100%)',
    path: ''
  }
])

const quickActions = ref([
  { name: '互助跑腿', icon: '/static/c1.png', path: '/pages/mutual/list/list' },
  { name: '论坛群', icon: '/static/c2.png', path: '' },
  { name: '二手闲置', icon: '/static/c3.png', path: '' },
  { name: '5分打印', icon: '/static/c6.png', path: '' },
  { name: '宿舍夜宵', icon: '/static/c7.png', path: '' }
])

const tabs = ref([
  { label: '最新', value: 'latest' },
  { label: '分享吐槽', value: 'share' },
  { label: '求助答疑', value: 'help' },
  { label: '组队交友', value: 'social' },
  { label: '二手闲置', value: 'secondhand' }
])

const filteredPosts = computed(() => {
  let filtered = posts.value
  if (currentTab.value !== 'latest') {
    filtered = filtered.filter(p => p.type === currentTab.value)
  }
  return filtered.sort((a, b) => {
    if (a.isTop && !b.isTop) return -1
    if (!a.isTop && b.isTop) return 1
    return 0
  })
})

onMounted(() => {
  loadPosts()
  loadUnreadCount()
  uni.$on('refreshPosts', loadPosts)
})

onUnmounted(() => {
  uni.$off('refreshPosts', loadPosts)
})

async function loadPosts() {
  loading.value = true
  try {
    const data = await postService.getPosts()
    posts.value = data || []
  } catch (e) {
    console.error('Failed to load posts:', e)
  } finally {
    loading.value = false
  }
}

async function loadUnreadCount() {
  try {
    const unread = messageStore.messages.filter(m => !m.read).length
    unreadCount.value = unread
  } catch (e) {
    console.error('Failed to load unread count')
  }
}

function switchTab(tab) {
  currentTab.value = tab
}

function onActionClick(item) {
  if (!item.path) {
    uni.showToast({ title: '敬请期待', icon: 'none' })
    return
  }
  
  if (isTabBarPage(item.path)) {
    uni.switchTab({ url: item.path })
  } else {
    uni.navigateTo({ url: item.path })
  }
}

function isTabBarPage(path) {
  const tabBarPages = [
    '/pages/index/index',
    '/pages/mutual/list/list',
    '/pages/post/post',
    '/pages/message/message',
    '/pages/profile/index/index'
  ]
  return tabBarPages.some(page => path.startsWith(page))
}

function onBannerClick(banner) {
  if (!banner.path) {
    uni.showToast({ title: '敬请期待', icon: 'none' })
    return
  }
  
  if (isTabBarPage(banner.path)) {
    uni.switchTab({ url: banner.path })
  } else {
    uni.navigateTo({ url: banner.path })
  }
}

function getTagType(type) {
  const map = { share: 'default', help: 'warning', social: 'success', secondhand: 'primary' }
  return map[type] || 'default'
}

function toggleLike(post) {
  post.isLiked = !post.isLiked
  post.likeCount += post.isLiked ? 1 : -1
}

function toggleFavorite(post) {
  post.isFavorite = !post.isFavorite
  uni.showToast({ title: post.isFavorite ? '已收藏' : '取消收藏', icon: 'none' })
}

function goToPostDetail(id) {
  uni.navigateTo({ url: `/pages/post/detail/detail?id=${id}` })
}

function goToSearch() {
  uni.navigateTo({ url: '/pages/search/search' })
}

function goToHot() {
  uni.navigateTo({ url: '/pages/hot/hot' })
}

function goToMessage() {
  uni.switchTab({ url: '/pages/message/message' })
}

function loadMore() {
  // TODO: 实现分页加载
}

function onPageScroll(e) {
  const scrollTop = e.detail.scrollTop
  const delta = scrollTop - lastScrollTop.value

  if (Math.abs(delta) < hideThreshold.value) return

  if (delta > 0 && scrollTop > 80) {
    if (!isScrollUp.value) {
      isScrollUp.value = true
      hasHidden.value = true
    }
  } else if (delta < 0) {
    if (isScrollUp.value || scrollTop < 20) {
      isScrollUp.value = false
      hasHidden.value = false
    }
  }

  lastScrollTop.value = scrollTop
}

function onImageError(e, index) {
  quickActions.value[index].icon = '/static/logo.png'
}

function onAvatarError(e) {
  e.target.src = '/static/logo.png'
}

function onPostImageError(e, postId, imgIndex) {
  const post = posts.value.find(p => p.id === postId)
  if (post && post.images) {
    post.images[imgIndex] = '/static/placeholder.png'
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
$border-radius-sm: 8px;

.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $bg-color;
  padding-bottom: 60px;
}

.header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  position: relative;
  
  .header-left {
    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin-right: 10px;
    }
  }

  .header-search {
    flex: 1;
    display: flex;
    align-items: center;
    height: 34px;
    background: rgba(255,255,255,0.25);
    border-radius: 17px;
    padding: 0 14px;
    margin-right: 10px;
    backdrop-filter: blur(4px);

    .search-placeholder {
      font-size: 13px;
      color: rgba(255,255,255,0.8);
      margin-left: 6px;
    }
  }

  .header-right {
    flex-shrink: 0;
    
    uni-icons {
      color: #FFFFFF !important;
    }
  }

  .header-message {
    position: relative;
    padding: 0 10px;
    
    uni-icons {
      color: #FFFFFF !important;
    }

    .message-badge {
      position: absolute;
      top: -5px;
      right: 0;
      min-width: 18px;
      height: 18px;
      background: $warning-color;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 600;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
      border: 2px solid rgba(255,107,107,0.3);
    }
  }
}

.banner-container {
  padding: 12px 16px;
  background: #FFFFFF;
  overflow: hidden;
  max-height: 160px;
  transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;

  &.hidden {
    max-height: 0;
    padding: 0 16px;
    opacity: 0;
  }

  .banner-swiper {
    height: 120px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: $card-shadow;

    .banner-item {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 16px 20px;
      color: #FFFFFF;
      position: relative;

      .banner-title {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 6px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .banner-desc {
        font-size: 12px;
        opacity: 0.9;
        font-weight: 500;
      }
    }
  }
}

.quick-actions {
  display: flex;
  background: #FFFFFF;
  padding: 16px;
  gap: 8px;
  box-shadow: $card-shadow;
  overflow: hidden;
  max-height: 120px;
  transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;

  &.hidden {
    max-height: 0;
    padding: 0 16px;
    opacity: 0;
  }

  .action-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 4px;
    border-radius: $border-radius-sm;
    transition: all 0.2s ease;
    
    &:active {
      background: $bg-color;
      transform: scale(0.96);
    }

    .action-icon {
      width: 40px;
      height: 40px;
      margin-bottom: 6px;
    }

    .action-text {
      font-size: 12px;
      color: $text-primary;
      font-weight: 500;
    }
  }
}

.content-tabs {
  background: #FFFFFF;
  margin-top: 2px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);

  .tabs-scroll {
    white-space: nowrap;
    padding: 0 8px;
  }

  .tab-item {
    display: inline-block;
    padding: 12px 16px;
    font-size: 14px;
    color: $text-secondary;
    position: relative;
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
        width: 24px;
        height: 3px;
        background: $primary-color;
        border-radius: 2px;
      }
    }
  }
}

.post-list {
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;

  .loading-wrapper,
  .empty-wrapper {
    padding: 60px 0;
  }
}

.post-card {
  background: #FFFFFF;
  border-radius: $border-radius;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: $card-shadow;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  }

  .post-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .post-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
      border: 2px solid $primary-light;
    }

    .post-info {
      flex: 1;

      .post-name-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;

        .post-nickname {
          font-size: 14px;
          font-weight: 600;
          color: $text-primary;
        }

        .top-badge {
          font-size: 10px;
          color: #FFFFFF;
          background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
      }

      .post-time {
        font-size: 12px;
        color: $text-muted;
      }
    }
  }

  .post-content {
    margin-bottom: 12px;

    .post-title {
      font-size: 16px;
      font-weight: 600;
      color: $text-primary;
      display: block;
      margin-bottom: 6px;
      line-height: 1.4;
    }

    .post-summary {
      font-size: 14px;
      color: $text-secondary;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.5;
    }
  }

  .post-images {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
    position: relative;

    .post-image {
      width: 100px;
      height: 100px;
      border-radius: 8px;

      &.single {
        width: 160px;
        height: 160px;
      }
    }

    .image-more {
      position: absolute;
      right: 6px;
      bottom: 6px;
      background: rgba(0, 0, 0, 0.6);
      color: #FFFFFF;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 500;
    }
  }

  .post-footer {
    display: flex;
    align-items: center;
    gap: 24px;
    padding-top: 12px;
    border-top: 1px solid #F3F4F6;

    .footer-item {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 4px 8px;
      border-radius: 20px;
      transition: all 0.2s ease;
      
      &:active {
        background: $bg-color;
      }

      .footer-text {
        font-size: 13px;
        color: $text-muted;
      }
    }
  }
}
</style>
