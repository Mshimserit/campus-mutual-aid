<template>
  <view class="page">
    <view v-if="favorites.length === 0" class="empty-wrapper">
      <uni-load-more status="nomore" content="暂无收藏" />
    </view>
    <view v-else class="post-list">
      <view class="post-item" v-for="post in favorites" :key="post.id" @click="goToDetail(post.id)">
        <view class="post-info">
          <text class="post-title">{{ post.title }}</text>
          <view class="post-meta">
            <text class="post-author">{{ post.author }}</text>
            <text class="post-time">{{ post.favoriteTime }}</text>
          </view>
        </view>
        <text class="cancel-btn" @click.stop="cancelFavorite(post)">取消收藏</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const favorites = ref([
  { id: 'p001', title: '期末复习攻略，图书馆占位指南', author: '神秘同学1234', favoriteTime: '2026-04-17' },
  { id: 'p002', title: '二食堂新窗口测评', author: '神秘同学5678', favoriteTime: '2026-04-16' },
  { id: 'p003', title: '校园快递代取互助', author: '神秘同学9999', favoriteTime: '2026-04-15' }
])

function goToDetail(id) {
  uni.navigateTo({ url: `/pages/post/detail/detail?id=${id}` })
}

function cancelFavorite(post) {
  uni.showModal({
    title: '确认取消',
    content: '确定取消收藏吗？',
    success: (res) => {
      if (res.confirm) {
        favorites.value = favorites.value.filter(p => p.id !== post.id)
        uni.showToast({ title: '已取消收藏', icon: 'success' })
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
        gap: 15px;

        .post-author, .post-time {
          font-size: 12px;
          color: #999;
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
