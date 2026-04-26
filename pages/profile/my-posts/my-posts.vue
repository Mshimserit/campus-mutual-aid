<template>
  <view class="page">
    <view v-if="posts.length === 0" class="empty-wrapper">
      <uni-load-more status="nomore" content="暂无帖子" />
    </view>
    <view v-else class="post-list">
      <view class="post-item" v-for="post in posts" :key="post.id">
        <view class="post-info" @click="goToDetail(post.id)">
          <text class="post-title">{{ post.title }}</text>
          <view class="post-meta">
            <text class="post-time">{{ post.time }}</text>
            <uni-tag :text="post.status" :type="getStatusType(post.status)" size="small" />
          </view>
        </view>
        <view class="post-actions">
          <text class="action-btn" @click="editPost(post)">编辑</text>
          <text class="action-btn delete" @click="deletePost(post)">删除</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([
  { id: 'p001', title: '期末复习攻略', time: '2026-04-17', status: '已发布' },
  { id: 'p002', title: '图书馆占位指南', time: '2026-04-16', status: '已发布' },
  { id: 'p003', title: '校园美食推荐', time: '2026-04-15', status: '审核中' }
])

function getStatusType(status) {
  const map = { '已发布': 'success', '审核中': 'warning', '已屏蔽': 'default' }
  return map[status] || 'default'
}

function goToDetail(id) {
  uni.navigateTo({ url: `/pages/post/detail/detail?id=${id}` })
}

function editPost(post) {
  uni.showToast({ title: '编辑功能', icon: 'none' })
}

function deletePost(post) {
  uni.showModal({
    title: '确认删除',
    content: '删除后无法恢复，确定要删除吗？',
    success: (res) => {
      if (res.confirm) {
        posts.value = posts.value.filter(p => p.id !== post.id)
        uni.showToast({ title: '删除成功', icon: 'success' })
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

        .post-time {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .post-actions {
      display: flex;
      gap: 12px;

      .action-btn {
        font-size: 14px;
        color: #1890ff;

        &.delete { color: #ff4d4f; }
      }
    }
  }
}

.empty-wrapper {
  padding: 50px 0;
}
</style>
