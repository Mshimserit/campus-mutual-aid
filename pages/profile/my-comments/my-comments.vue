<template>
  <view class="page">
    <view v-if="comments.length === 0" class="empty-wrapper">
      <uni-load-more status="nomore" content="暂无评论" />
    </view>
    <view v-else class="comment-list">
      <view class="comment-item" v-for="comment in comments" :key="comment.id">
        <view class="comment-content">
          <text class="comment-text">{{ comment.content }}</text>
          <view class="comment-meta">
            <text class="comment-time">{{ comment.time }}</text>
            <text class="comment-post" @click="goToPost(comment.postId)">{{ comment.postTitle }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const comments = ref([
  { id: 'c001', content: '确实如此，我也遇到了同样的问题', time: '2026-04-17 10:30', postTitle: '期末复习攻略', postId: 'p001' },
  { id: 'c002', content: '图书馆三楼确实有插座，很方便', time: '2026-04-16 15:20', postTitle: '图书馆占位指南', postId: 'p002' }
])

function goToPost(id) {
  uni.navigateTo({ url: `/pages/post/detail/detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 15px;
}

.comment-list {
  .comment-item {
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;

    .comment-content {
      .comment-text {
        font-size: 14px;
        color: #333;
        display: block;
        margin-bottom: 8px;
      }

      .comment-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .comment-time {
          font-size: 12px;
          color: #999;
        }

        .comment-post {
          font-size: 12px;
          color: #1890ff;
        }
      }
    }
  }
}

.empty-wrapper { padding: 50px 0; }
</style>
