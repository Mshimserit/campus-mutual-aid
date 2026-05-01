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
        <view class="comment-actions">
          <text class="action-btn delete" @click="deleteComment(comment)">删除</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { commentService } from '@/services/comment-service'

const comments = ref([
  { id: 'c001', content: '确实如此，我也遇到了同样的问题', time: '2026-04-17 10:30', postTitle: '期末复习攻略', postId: 'p001' },
  { id: 'c002', content: '图书馆三楼确实有插座，很方便', time: '2026-04-16 15:20', postTitle: '图书馆占位指南', postId: 'p002' }
])

function goToPost(id) {
  uni.navigateTo({ url: `/pagesSub/post/detail/detail?id=${id}` })
}

async function deleteComment(comment) {
  uni.showModal({
    title: '确认删除',
    content: '删除后无法恢复，确定要删除吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '删除中...', mask: true })
          await commentService.deleteComment(comment.id)
          comments.value = comments.value.filter(c => c.id !== comment.id)
          uni.hideLoading()
          uni.showToast({ title: '删除成功', icon: 'success' })
        } catch (e) {
          uni.hideLoading()
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
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

.comment-list {
  .comment-item {
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .comment-content {
      flex: 1;

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

    .comment-actions {
      margin-left: 10px;
      flex-shrink: 0;

      .action-btn {
        font-size: 14px;
        color: #ff4d4f;
        padding: 5px;
      }
    }
  }
}

.empty-wrapper { padding: 50px 0; }
</style>
