<template>
  <view class="page">
    <view class="guide-banner" v-if="showGuideBanner">
      <view class="banner-content">
        <uni-icons type="notification-filled" size="24" color="#1890ff"></uni-icons>
        <view class="banner-text">
          <text class="banner-title">开启微信提醒</text>
          <text class="banner-desc">关注公众号，实时接收消息通知</text>
        </view>
        <button class="banner-btn" size="mini" @click="onFollowOfficial">立即关注</button>
      </view>
      <view class="banner-close" @click="closeGuideBanner">
        <uni-icons type="closeempty" size="16" color="#999"></uni-icons>
      </view>
    </view>

    <!-- 页面头部 -->
    <view class="page-header">
      <view class="unread-badge" v-if="unreadCount > 0">
        <uni-icons type="notification" size="20" color="#FF6B6B"></uni-icons>
        <text class="unread-count">{{ unreadCount > 99 ? '99+' : unreadCount }}</text>
      </view>
      <text class="header-title" v-else>
        <uni-icons type="notification" size="20" color="#9CA3AF"></uni-icons>
      </text>
      <view class="header-actions">
        <text class="mark-read" @click="confirmMarkAllRead">一键已读</text>
      </view>
    </view>

    <!-- 分类筛选 -->
    <view class="filter-tabs">
      <scroll-view scroll-x>
        <view class="tabs-wrapper">
          <view
            v-for="tab in tabs"
            :key="tab.value"
            :class="['tab-item', { active: currentFilter === tab.value }]"
            @click="switchFilter(tab.value)"
          >
            <text>{{ tab.label }}</text>
            <text v-if="tab.count > 0" class="tab-count">{{ tab.count }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 消息列表 -->
    <view class="message-list">
      <view v-if="loading" class="loading-wrapper">
        <uni-load-more status="loading" />
      </view>
      <view v-else-if="filteredMessages.length === 0" class="empty-wrapper">
        <image src="/static/logo.png" class="empty-icon" mode="aspectFit" />
        <text class="empty-text">暂无消息</text>
      </view>
      <view v-else>
        <view
          v-for="msg in filteredMessages"
          :key="msg.id"
          :class="['message-item', { unread: !msg.read, 'system-type': msg.type === 'system' }]"
          @click="onMessageClick(msg)"
          role="button"
          :aria-label="msg.title + (msg.read ? '，已读' : '，未读')"
        >
          <!-- 消息头部 -->
          <view class="msg-header">
            <image :src="msg.sender?.avatar || '/static/logo.png'" class="sender-avatar" mode="aspectFill" />
            <view class="msg-info">
              <view class="title-row">
                <text class="msg-title">{{ msg.title }}</text>
                <view v-if="msg.type === 'system' && msg.subtype" class="system-tag" :class="msg.subtype">
                  <text>{{ getSystemTagText(msg.subtype) }}</text>
                </view>
              </view>
              <text class="msg-time">{{ msg.time }}</text>
            </view>
            <view v-if="!msg.read" class="unread-dot" role="status" aria-label="未读"></view>
          </view>

          <!-- 评论内容 -->
          <view v-if="msg.type === 'comment' && msg.content" class="msg-comment-body">
            <view class="comment-content">
              <uni-icons type="chat" size="14" color="#1890ff" class="comment-icon"></uni-icons>
              <text class="comment-text">{{ msg.content }}</text>
            </view>
          </view>

          <!-- 点赞内容预览 -->
          <view v-if="msg.type === 'like'" class="msg-like-body">
            <view class="like-type">
              <uni-icons :type="getLikeIcon(msg.target?.type)" size="14" color="#ff4d4f"></uni-icons>
              <text class="like-type-text">{{ getLikeTypeText(msg.target?.type) }}</text>
            </view>
          </view>

          <!-- 原帖/目标内容摘要 -->
          <view v-if="msg.target?.title || msg.target?.summary" class="msg-target-preview">
            <text class="target-title">{{ msg.target.title || '相关内容' }}</text>
            <text v-if="msg.target.summary" class="target-summary">{{ truncateText(msg.target.summary, 40) }}</text>
          </view>

          <!-- 系统通知内容 -->
          <view v-if="msg.type === 'system' && msg.content" class="msg-system-body">
            <text class="system-text">{{ msg.content }}</text>
          </view>

          <!-- 操作栏 -->
          <view class="msg-footer">
            <text class="delete-btn" @click.stop="confirmDelete(msg.id)" role="button" aria-label="删除此消息">删除</text>
          </view>
        </view>
      </view>
    </view>

    <custom-tabbar />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { messageService } from '@/services/message-service'

const messages = ref([])
const loading = ref(false)
const currentFilter = ref('all')
const showGuideBanner = ref(true)

const tabs = [
  { label: '全部', value: 'all' },
  { label: '评论', value: 'comment' },
  { label: '点赞', value: 'like' },
  { label: '订单', value: 'order' },
  { label: '系统', value: 'system' }
]

const unreadCount = computed(() => {
  return messages.value.filter(m => !m.read).length
})

const tabCounts = computed(() => {
  const counts = { comment: 0, like: 0, order: 0, system: 0 }
  messages.value.forEach(msg => {
    if (counts[msg.type] !== undefined && !msg.read) {
      counts[msg.type]++
    }
  })
  return counts
})

const filteredMessages = computed(() => {
  if (currentFilter.value === 'all') return messages.value
  return messages.value.filter(m => m.type === currentFilter.value)
})

onMounted(() => {
  loadMessages()
})

async function loadMessages() {
  loading.value = true
  try {
    const data = await messageService.getMessages()
    messages.value = data
  } catch (e) {
    console.error('Failed to load messages')
  } finally {
    loading.value = false
  }
}

function switchFilter(filter) {
  currentFilter.value = filter
}

function truncateText(text, maxLength) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

function getMessageIcon(type) {
  const map = { comment: 'chat', like: 'heart', system: 'notification', order: 'bag' }
  return map[type] || 'notification'
}

function getMessageColor(type) {
  const map = { comment: '#1890ff', like: '#ff4d4f', system: '#fa8c16', order: '#52c41a' }
  return map[type] || '#999'
}

function getLikeTypeText(targetType) {
  if (targetType === 'post') return '帖子'
  if (targetType === 'comment') return '评论'
  return '内容'
}

function getLikeIcon(targetType) {
  if (targetType === 'post') return 'compose'
  if (targetType === 'comment') return 'chat'
  return 'compose'
}

function getSystemTagText(subtype) {
  const map = {
    review_result: '审核',
    violation_warning: '警告',
    platform_update: '更新',
    account_security: '安全',
    welcome: '欢迎'
  }
  return map[subtype] || '通知'
}

function confirmMarkAllRead() {
  if (unreadCount.value === 0) {
    uni.showToast({ title: '没有未读消息', icon: 'none' })
    return
  }
  uni.showModal({
    title: '确认操作',
    content: '确定将所有消息标记为已读？',
    success: (res) => {
      if (res.confirm) {
        markAllRead()
      }
    }
  })
}

async function markAllRead() {
  try {
    await messageService.markAllRead()
    messages.value.forEach(msg => msg.read = true)
    uni.showToast({ title: '已全部已读', icon: 'success' })
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

function confirmDelete(id) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条消息吗？此操作不可撤销',
    success: async (res) => {
      if (res.confirm) {
        await deleteMessage(id)
      }
    }
  })
}

async function deleteMessage(id) {
  try {
    await messageService.deleteMessage(id)
    messages.value = messages.value.filter(m => m.id !== id)
    uni.showToast({ title: '删除成功', icon: 'success' })
  } catch (e) {
    uni.showToast({ title: '删除失败', icon: 'none' })
  }
}

function onMessageClick(msg) {
  msg.read = true

  switch (msg.type) {
    case 'comment':
    case 'like':
      if (msg.targetId) {
        uni.navigateTo({
          url: `/pages/post/detail/detail?id=${msg.targetId}`
        })
      }
      break
    case 'order':
      if (msg.targetId) {
        uni.navigateTo({
          url: `/pages/mutual/detail/detail?id=${msg.targetId}`
        })
      }
      break
    case 'system':
      if (msg.content) {
        uni.showModal({
          title: msg.title,
          content: msg.content,
          showCancel: false
        })
      }
      break
  }
}

function onFollowOfficial() {
  uni.setClipboardData({
    data: '公众号',
    success: () => {
      uni.showToast({ title: '已复制', icon: 'success' })
    }
  })
}

function closeGuideBanner() {
  showGuideBanner.value = false
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
  padding-bottom: 60px;
}

.guide-banner {
  position: relative;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f8ff 100%);
  padding: 14px 36px 14px 16px;
  border-bottom: 1px solid #bae7ff;

  .banner-content {
    display: flex;
    align-items: center;
    gap: 12px;

    .banner-text {
      flex: 1;

      .banner-title {
        font-size: 14px;
        font-weight: 700;
        color: #1890ff;
        display: block;
        margin-bottom: 4px;
      }

      .banner-desc {
        font-size: 12px;
        color: #597ef7;
        display: block;
      }
    }

    .banner-btn {
      background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
      border: none;
      border-radius: 16px;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      padding: 0 14px;
      height: 28px;
      line-height: 28px;
    }
  }

  .banner-close {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    padding: 4px;
  }
}

.page-header {
  background: #FFFFFF;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);

  .unread-badge {
    display: flex;
    align-items: center;
    gap: 6px;

    .unread-count {
      font-size: 14px;
      font-weight: 700;
      color: $primary-color;
    }
  }

  .header-actions {
    .mark-read {
      color: $primary-color;
      font-size: 14px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      transition: background 0.2s ease;

      &:active {
        background: $primary-light;
      }
    }
  }
}

.filter-tabs {
  background: #FFFFFF;
  padding: 0 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);

  .tabs-wrapper {
    display: flex;
  }

  .tab-item {
    padding: 14px 16px;
    font-size: 14px;
    color: $text-secondary;
    position: relative;
    white-space: nowrap;
    font-weight: 500;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;

    &.active {
      color: $primary-color;
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 3px;
        background: $primary-color;
        border-radius: 2px;
      }
    }

    .tab-count {
      font-size: 10px;
      background: $primary-light;
      color: $primary-color;
      padding: 1px 5px;
      border-radius: 10px;
      font-weight: 600;
    }
  }
}

.message-list {
  padding: 12px 16px;
}

.message-item {
  background: #FFFFFF;
  border-radius: $border-radius;
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: $card-shadow;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
  }

  &.unread {
    border-left: 4px solid $primary-color;
  }

  &.system-type {
    background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
    border-left: 4px solid #fa8c16;
  }

  .msg-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .sender-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 10px;
      background: $bg-color;
    }

    .msg-info {
      flex: 1;

      .title-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;

        .msg-title {
          font-size: 14px;
          color: $text-primary;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .system-tag {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
          flex-shrink: 0;

          &.review_result {
            background: #f6ffed;
            color: #52c41a;
          }

          &.violation_warning {
            background: #fff1f0;
            color: #ff4d4f;
          }

          &.platform_update {
            background: #e6f7ff;
            color: #1890ff;
          }

          &.account_security {
            background: #fff7e6;
            color: #fa8c16;
          }

          &.welcome {
            background: #f9f0ff;
            color: #722ed1;
          }
        }
      }

      .msg-time {
        font-size: 12px;
        color: $text-muted;
        display: block;
      }
    }

    .unread-dot {
      width: 8px;
      height: 8px;
      background: $primary-color;
      border-radius: 50%;
      flex-shrink: 0;
      animation: pulse 2s infinite;
    }
  }

  .msg-comment-body {
    background: #f0f7ff;
    border-radius: 8px;
    padding: 10px 12px;
    margin-bottom: 10px;

    .comment-content {
      display: flex;
      align-items: flex-start;
      gap: 6px;

      .comment-icon {
        margin-top: 2px;
        flex-shrink: 0;
      }

      .comment-text {
        font-size: 13px;
        color: #333;
        line-height: 1.5;
        flex: 1;
      }
    }
  }

  .msg-like-body {
    margin-bottom: 10px;

    .like-type {
      display: flex;
      align-items: center;
      gap: 4px;

      .like-type-text {
        font-size: 12px;
        color: $text-secondary;
        font-weight: 500;
      }
    }
  }

  .msg-target-preview {
    background: $bg-color;
    border-radius: 8px;
    padding: 10px 12px;
    margin-bottom: 10px;

    .target-title {
      font-size: 13px;
      color: $text-primary;
      font-weight: 600;
      display: block;
      margin-bottom: 4px;
    }

    .target-summary {
      font-size: 12px;
      color: $text-secondary;
      display: block;
      line-height: 1.4;
    }
  }

  .msg-system-body {
    margin-bottom: 10px;

    .system-text {
      font-size: 13px;
      color: $text-secondary;
      line-height: 1.6;
    }
  }

  .msg-footer {
    text-align: right;
    padding-top: 8px;
    border-top: 1px solid #F3F4F6;

    .delete-btn {
      color: $text-muted;
      font-size: 12px;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.2s ease;

      &:active {
        color: $primary-color;
        background: $primary-light;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-wrapper,
.empty-wrapper {
  padding: 60px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .empty-icon {
    width: 100px;
    height: 100px;
    margin-bottom: 16px;
    opacity: 0.4;
  }

  .empty-text {
    font-size: 14px;
    color: $text-muted;
    font-weight: 500;
  }
}
</style>
