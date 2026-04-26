<template>
  <view class="page">
    <view v-if="posts.length === 0" class="empty-wrapper">
      <uni-load-more status="nomore" content="暂无蹲贴" />
    </view>
    <view v-else class="post-list">
      <view class="post-item" v-for="post in posts" :key="post.id" @click="goToDetail(post.id)">
        <view class="post-info">
          <text class="post-title">{{ post.title }}</text>
          <view class="post-meta">
            <text class="post-time">最后回复: {{ post.lastReplyTime }}</text>
            <view v-if="post.hasNewReply" class="new-badge">New</view>
          </view>
        </view>
        <text class="cancel-btn" @click.stop="cancelWatch(post)">取消蹲</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const posts = ref([
  { id: 'p001', title: '期末复习攻略，图书馆占位指南', lastReplyTime: '5分钟前', hasNewReply: true },
  { id: 'p002', title: '校园快递代取互助', lastReplyTime: '1小时前', hasNewReply: false },
  { id: 'p003', title: '周末篮球赛招募', lastReplyTime: '2小时前', hasNewReply: true }
])

function goToDetail(id) {
  uni.navigateTo({ url: `/pages/post/detail/detail?id=${id}` })
}

function cancelWatch(post) {
  uni.showModal({
    title: '确认取消',
    content: '确定不再蹲这个帖子吗？',
    success: (res) => {
      if (res.confirm) {
        posts.value = posts.value.filter(p => p.id !== post.id)
        uni.showToast({ title: '已取消蹲贴', icon: 'success' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 15px;
}

.post-list {
  .post-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;

    .post-info {
      flex: 1;

      .post-title {
        font-size: 15px;
        color: #333;
        display: block;
        margin-bottom: 8px;
      }

      .post-meta {
        display: flex;
        align-items: center;
        gap: 10px;

        .post-time { font-size: 12px; color: #999; }

        .new-badge {
          font-size: 10px;
          color: #fff;
          background: #ff4d4f;
          padding: 1px 5px;
          border-radius: 3px;
        }
      }
    }

    .cancel-btn {
      font-size: 13px;
      color: #ff4d4f;
    }
  }
}

.empty-wrapper { padding: 50px 0; }
</style>
