<template>
  <view class="page">
    <view class="nav-bar">
      <view class="back-btn" @click="goBack">
        <uni-icons type="left" size="24" color="#333"></uni-icons>
      </view>
      <text class="nav-title">帖子详情</text>
      <view class="placeholder"></view>
    </view>

    <view v-if="post" class="post-detail">
      <view class="post-header">
        <image :src="post.avatar" class="avatar" mode="aspectFill" />
        <view class="user-info">
          <text class="nickname">{{ post.nickname }}</text>
          <text class="time">{{ post.createTime }}</text>
        </view>
        <uni-tag :text="post.tag" :type="getTagType(post.tagType)" size="small" />
      </view>

      <view class="post-content">
        <text class="title">{{ post.title }}</text>
        <text class="content-text">{{ post.content }}</text>
        <view v-if="post.images && post.images.length > 0" class="images-grid">
          <image
            v-for="(img, idx) in post.images"
            :key="idx"
            :src="img"
            class="post-image"
            mode="aspectFill"
            @click="previewImage(idx)"
          />
        </view>
        <view v-if="post.contact" class="contact-info">
          <uni-notice-bar showIcon :text="'联系方式：' + post.contact" />
        </view>
      </view>

      <view class="interactions">
        <view class="action-item" @click="toggleLike">
          <uni-icons :type="isLiked ? 'heart-filled' : 'heart'" size="22" :color="isLiked ? '#ff4d4f' : '#999'"></uni-icons>
          <text :class="['action-text', { liked: isLiked }]">{{ likeCount }}</text>
        </view>
        <view class="action-item" @click="toggleFavorite">
          <uni-icons :type="isFavorite ? 'star-filled' : 'star'" size="22" :color="isFavorite ? '#faad14' : '#999'"></uni-icons>
          <text :class="['action-text', { favorited: isFavorite }]">{{ isFavorite ? '已收藏' : '收藏' }}</text>
        </view>
        <view class="action-item">
          <uni-icons type="chat" size="22" color="#999"></uni-icons>
          <text class="action-text">{{ commentCount }}</text>
        </view>
      </view>

      <view class="comments-section">
        <text class="section-title">评论 ({{ commentCount }})</text>
        <view v-if="comments.length === 0" class="empty-comments">
          <text>暂无评论，快来抢沙发吧</text>
        </view>
        <view v-else class="comment-list">
          <view class="comment-item" v-for="comment in comments" :key="comment.id">
            <image :src="comment.avatar" class="comment-avatar" mode="aspectFill" />
            <view class="comment-content">
              <view class="comment-header">
                <text class="comment-nickname">{{ comment.nickname }}</text>
                <text class="comment-time">{{ comment.time }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
              <view class="comment-actions">
                <text class="comment-like" @click="likeComment(comment)">
                  {{ comment.isLiked ? '👍' : '👍' }} {{ comment.likeCount || 0 }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="comment-input-bar">
      <input
        v-model="commentText"
        class="comment-input"
        placeholder="说点什么..."
        confirm-type="send"
        @confirm="submitComment"
      />
      <button size="mini" type="primary" @click="submitComment">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const post = ref(null)
const isLiked = ref(false)
const isFavorite = ref(false)
const likeCount = ref(0)
const commentCount = ref(0)
const commentText = ref('')
const comments = ref([])
const postId = ref('')

const mockComments = [
  { id: 'c001', nickname: '神秘同学1234', avatar: '/static/logo.png', content: '确实如此，我也遇到了', time: '5分钟前', likeCount: 3, isLiked: false },
  { id: 'c002', nickname: '神秘同学5678', avatar: '/static/logo.png', content: '求详细攻略！', time: '10分钟前', likeCount: 1, isLiked: false }
]

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  postId.value = currentPage.options.id || ''
  loadPostDetail()
})

function goBack() {
  uni.navigateBack()
}

function loadPostDetail() {
  const mockPost = {
    id: postId.value,
    title: '期末复习攻略，图书馆占位指南',
    content: '期末复习期间，图书馆会延长开放时间到晚上10点半。建议大家早上8点前去占座，靠窗的位置比较抢手。另外，图书馆三楼有插座，适合带电脑的同学。记得带上水杯，三楼有饮水机。',
    tag: '#求助答疑',
    tagType: 'help',
    avatar: '/static/logo.png',
    nickname: '神秘同学1234567890',
    createTime: '2026-04-17 10:30',
    contact: '微信号：campus_helper',
    images: ['/static/c1.png', '/static/c2.png'],
    likeCount: 8,
    commentCount: 2
  }
  post.value = mockPost
  likeCount.value = mockPost.likeCount
  commentCount.value = mockPost.commentCount
  comments.value = mockComments
}

function getTagType(type) {
  const map = { share: 'default', help: 'warning', social: 'success', secondhand: 'primary' }
  return map[type] || 'default'
}

function toggleLike() {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value
  uni.showToast({ title: isFavorite.value ? '已收藏' : '取消收藏', icon: 'none' })
}

function previewImage(idx) {
  uni.previewImage({
    urls: post.value.images,
    current: idx
  })
}

function submitComment() {
  if (!commentText.value.trim()) {
    uni.showToast({ title: '请输入评论内容', icon: 'none' })
    return
  }
  comments.value.unshift({
    id: 'c' + Date.now(),
    nickname: '我',
    avatar: '/static/logo.png',
    content: commentText.value,
    time: '刚刚',
    likeCount: 0,
    isLiked: false
  })
  commentCount.value++
  commentText.value = ''
  uni.showToast({ title: '评论成功', icon: 'success' })
}

function likeComment(comment) {
  comment.isLiked = !comment.isLiked
  comment.likeCount += comment.isLiked ? 1 : -1
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 60px;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  padding-top: var(--status-bar-height, 0);
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;

  .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: background 0.2s ease;
    
    &:active {
      background: #f5f5f5;
    }
  }

  .nav-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .placeholder {
    width: 40px;
  }
}

.post-detail {
  background: #fff;
  padding: 15px;

  .post-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .user-info {
      flex: 1;

      .nickname {
        font-size: 14px;
        color: #333;
        display: block;
      }

      .time {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .post-content {
    .title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      display: block;
      margin-bottom: 10px;
    }

    .content-text {
      font-size: 15px;
      color: #333;
      line-height: 1.6;
      display: block;
      margin-bottom: 15px;
    }

    .images-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 15px;

      .post-image {
        width: 30%;
        height: 100px;
        border-radius: 4px;
      }
    }
  }

  .interactions {
    display: flex;
    justify-content: space-around;
    padding: 15px 0;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 20px;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .action-text {
        font-size: 12px;
        color: #999;
        margin-top: 4px;

        &.liked { color: #ff4d4f; }
        &.favorited { color: #faad14; }
      }
    }
  }
}

.comments-section {
  padding: 0 0 20px;

  .section-title {
    font-size: 15px;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 15px;
  }

  .empty-comments {
    text-align: center;
    padding: 30px 0;
    color: #999;
    font-size: 14px;
  }

  .comment-item {
    display: flex;
    margin-bottom: 15px;

    .comment-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .comment-content {
      flex: 1;

      .comment-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;

        .comment-nickname {
          font-size: 13px;
          color: #666;
        }

        .comment-time {
          font-size: 11px;
          color: #999;
        }
      }

      .comment-text {
        font-size: 14px;
        color: #333;
        display: block;
        margin-bottom: 6px;
      }

      .comment-actions {
        .comment-like {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}

.comment-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 8px 15px;
  background: #fff;
  border-top: 1px solid #f0f0f0;

  .comment-input {
    flex: 1;
    height: 36px;
    background: #f5f5f5;
    border-radius: 18px;
    padding: 0 15px;
    font-size: 14px;
    margin-right: 10px;
  }
}
</style>
