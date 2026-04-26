<template>
  <view class="page">
    <view class="chat-area">
      <view v-if="loading" class="skeleton">
        <view class="skeleton-line" v-for="i in 5" :key="i"></view>
      </view>
      <scroll-view scroll-y class="messages" ref="scrollView" @scrolltoupper="loadMore">
        <view class="message-item" v-for="msg in messages" :key="msg.id" :class="msg.isMine ? 'mine' : 'other'">
          <image v-if="!msg.isMine" :src="msg.avatar" class="avatar" mode="aspectFill" />
          <view class="bubble">
            <text>{{ msg.content }}</text>
            <image v-if="msg.image" :src="msg.image" class="msg-image" mode="aspectFill" />
          </view>
          <image v-if="msg.isMine" :src="msg.avatar" class="avatar" mode="aspectFill" />
        </view>
      </scroll-view>
    </view>
    <view class="input-bar">
      <input v-model="inputText" class="input" placeholder="输入消息..." confirm-type="send" @confirm="sendMessage" />
      <view class="actions">
        <uni-icons type="image" size="24" color="#999" @click="sendImage"></uni-icons>
        <button size="mini" type="primary" @click="sendMessage">发送</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const messages = ref([])
const inputText = ref('')
const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    messages.value = [
      { id: 'm1', content: '你好，请问有什么可以帮你的？', avatar: '/static/logo.png', isMine: false },
      { id: 'm2', content: '我想咨询一下跑腿服务', avatar: '/static/logo.png', isMine: true }
    ]
    loading.value = false
  }, 500)
})

function sendMessage() {
  if (!inputText.value.trim()) return
  messages.value.push({
    id: 'm' + Date.now(),
    content: inputText.value,
    avatar: '/static/logo.png',
    isMine: true
  })
  inputText.value = ''
  setTimeout(() => {
    messages.value.push({
      id: 'm' + (Date.now() + 1),
      content: '收到您的问题，客服正在处理中...',
      avatar: '/static/logo.png',
      isMine: false
    })
  }, 1000)
}

function sendImage() {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      messages.value.push({
        id: 'm' + Date.now(),
        content: '',
        image: res.tempFilePaths[0],
        avatar: '/static/logo.png',
        isMine: true
      })
    }
  })
}

function loadMore() {
  console.log('Load more history')
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.chat-area {
  flex: 1;
  overflow: hidden;

  .skeleton { padding: 15px; }
  .skeleton-line {
    height: 40px;
    background: #e8e8e8;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .messages {
    padding: 15px;
    height: 100%;
  }
}

.message-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .bubble {
    max-width: 70%;
    padding: 10px 15px;
    background: #fff;
    border-radius: 8px;
    margin: 0 10px;
    font-size: 14px;

    .msg-image {
      max-width: 200px;
      border-radius: 8px;
      margin-top: 5px;
    }
  }

  &.mine {
    flex-direction: row-reverse;
    .bubble { background: #dcf8c6; }
  }
}

.input-bar {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: #fff;
  border-top: 1px solid #e8e8e8;

  .input {
    flex: 1;
    height: 36px;
    background: #f5f5f5;
    border-radius: 18px;
    padding: 0 15px;
    font-size: 14px;
    margin-right: 10px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
