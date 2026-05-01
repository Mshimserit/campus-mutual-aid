<template>
  <view class="page">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-back" @click="goBack">
        <uni-icons type="left" size="24" color="#333"></uni-icons>
      </view>
      <view class="navbar-title">客服</view>
      <view class="navbar-more">
        <uni-icons type="more-filled" size="20" color="#333"></uni-icons>
      </view>
    </view>

    <!-- 聊天消息区域 -->
    <scroll-view
      scroll-y
      class="messages"
      :scroll-top="scrollTop"
      @scrolltoupper="loadMore"
      :upper-threshold="100"
      @scroll="onScroll"
    >
      <!-- 加载更多 -->
      <view v-if="isLoadingMore" class="loading-more">
        <text>加载中...</text>
      </view>
      <view v-else-if="!hasMore" class="no-more-history">
        <text>— 没有更多历史消息 —</text>
      </view>

      <!-- 消息列表 -->
      <view v-for="msg in messages" :key="msg.id">
        <view v-if="msg.showTime" class="time-label">
          <text class="time-text">{{ msg.time }}</text>
        </view>

        <view class="message-item" :class="msg.isMine ? 'mine' : 'other'">
          <image :src="msg.avatar" class="avatar" mode="aspectFill" />
          <view class="bubble">
            <text>{{ msg.content }}</text>
          </view>
        </view>
      </view>

      <!-- 新消息提示 -->
      <view v-if="showNewMessageTip" class="new-message-tip" @click="scrollToBottom">
        <text>新消息</text>
      </view>
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="input-bar">
      <input
        v-model="inputText"
        class="input"
        placeholder="输入消息..."
        confirm-type="send"
        @confirm="sendMessage"
      />
      <button v-if="inputText.trim()" class="send-btn" @click="sendMessage">发送</button>
      <view v-else class="add-btn" @click="addMore">+</view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const messages = ref([])
const inputText = ref('')
const scrollTop = ref(0)
const showNewMessageTip = ref(false)
const isLoadingMore = ref(false)
const hasMore = ref(true)
let page = 1
let isAtBottom = true

// 客服头像
const SERVICE_AVATAR = '/static/service.png'
const USER_AVATAR = '/static/user.png'

// 初始化
const init = () => {
  messages.value = [
    {
      id: '1',
      content: '你好，请问有什么可以帮你的？',
      avatar: SERVICE_AVATAR,
      isMine: false,
      time: getTimeStr(),
      showTime: true
    }
  ]
}
init()

// 加载历史消息
const loadMore = () => {
  if (isLoadingMore.value || !hasMore.value) return
  isLoadingMore.value = true
  
  setTimeout(() => {
    const history = []
    for (let i = 0; i < 10; i++) {
      history.push({
        id: `history_${page}_${i}`,
        content: `历史消息 ${page}-${i + 1}`,
        avatar: SERVICE_AVATAR,
        isMine: false,
        time: getTimeStr(),
        showTime: i === 0
      })
    }
    
    if (page >= 3) {
      hasMore.value = false
    }
    
    messages.value.unshift(...history)
    page++
    isLoadingMore.value = false
  }, 500)
}

// 发送消息
const sendMessage = () => {
  const content = inputText.value.trim()
  if (!content) return
  
  // 用户消息（头像在右侧，isMine=true）
  messages.value.push({
    id: Date.now().toString(),
    content,
    avatar: USER_AVATAR,
    isMine: true,
    time: getTimeStr(),
    showTime: shouldShowTime()
  })
  
  inputText.value = ''
  scrollToBottom()
  
  // 模拟客服回复
  setTimeout(() => {
    messages.value.push({
      id: (Date.now() + 1).toString(),
      content: '收到，我们会尽快处理',
      avatar: SERVICE_AVATAR,
      isMine: false,
      time: getTimeStr(),
      showTime: shouldShowTime()
    })
    scrollToBottom()
  }, 500)
}

// 辅助函数
const getTimeStr = () => {
  const date = new Date()
  return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const shouldShowTime = () => {
  if (messages.value.length === 0) return true
  const last = messages.value[messages.value.length - 1]
  return last.time !== getTimeStr()
}

const scrollToBottom = () => {
  nextTick(() => {
    scrollTop.value += 1
    isAtBottom = true
    showNewMessageTip.value = false
  })
}

const onScroll = (e) => {
  const { scrollHeight, scrollTop: top, clientHeight } = e.detail
  const nowAtBottom = scrollHeight - top - clientHeight < 50
  if (!nowAtBottom && isAtBottom) {
    showNewMessageTip.value = true
  }
  isAtBottom = nowAtBottom
}

const goBack = () => uni.navigateBack()
const addMore = () => uni.showToast({ title: '更多功能', icon: 'none' })
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.navbar {
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.loading-more, .no-more-history {
  text-align: center;
  padding: 10px;
  font-size: 12px;
  color: #999;
}

.time-label {
  text-align: center;
  margin: 16px 0;
  .time-text {
    font-size: 12px;
    color: #999;
    background: rgba(0,0,0,0.05);
    padding: 4px 10px;
    border-radius: 4px;
  }
}

.message-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .bubble {
    max-width: 70%;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 15px;
    line-height: 1.5;
  }
  
  &.other {
    .avatar { margin-right: 10px; }
    .bubble {
      background: #fff;
      border-top-left-radius: 4px;
    }
  }
  
  &.mine {
    flex-direction: row-reverse;
    .avatar { margin-left: 10px; }
    .bubble {
      background: #07c160;
      color: #fff;
      border-top-right-radius: 4px;
    }
  }
}

.new-message-tip {
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 100;
}

.input-bar {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: #fff;
  border-top: 1px solid #eee;
  gap: 10px;
  flex-shrink: 0;
  
  .input {
    flex: 1;
    height: 38px;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 0 15px;
    font-size: 15px;
  }
  
  .send-btn {
    background: #07c160;
    color: #fff;
    border: none;
    border-radius: 16px;
    padding: 6px 16px;
    font-size: 14px;
    margin: 0;
  }
  
  .add-btn {
    width: 38px;
    height: 38px;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #666;
  }
}
</style>