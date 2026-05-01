<template>
  <view class="page">
    <view class="header">
      <text class="title">今日热榜</text>
      <text class="subtitle">金科圈子热度排行</text>
    </view>

    <view class="hot-list">
      <view
        v-for="(item, index) in hotList"
        :key="item.id"
        :class="['hot-item', { top3: index < 3 }]"
        @click="goToDetail(item)"
      >
        <view :class="['rank-badge', { 'rank-1': index === 0, 'rank-2': index === 1, 'rank-3': index === 2 }]">
          <text>{{ index + 1 }}</text>
        </view>
        <view class="hot-content">
          <text class="hot-title">{{ item.title }}</text>
          <view class="hot-stats">
            <view class="stat-item">
              <uni-icons type="heart" size="14" color="#999"></uni-icons>
              <text>{{ item.likeCount }}</text>
            </view>
            <view class="stat-item">
              <uni-icons type="chat" size="14" color="#999"></uni-icons>
              <text>{{ item.commentCount }}</text>
            </view>
            <view class="stat-item">
              <uni-icons type="eye" size="14" color="#999"></uni-icons>
              <text>{{ item.viewCount }}</text>
            </view>
          </view>
        </view>
        <view class="hot-tag">
          <uni-tag :text="item.tag" :type="getTagType(item.tagType)" size="small" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { postService } from '@/services/post-service'

const hotList = ref([])

onMounted(() => {
  loadHotList()
})

async function loadHotList() {
  try {
    const data = await postService.getHotList()
    hotList.value = data
  } catch (e) {
    console.error('Failed to load hot list')
  }
}

function getTagType(type) {
  const map = { share: 'default', help: 'warning', social: 'success', secondhand: 'primary' }
  return map[type] || 'default'
}

function goToDetail(item) {
  uni.navigateTo({ url: `/pagesSub/post/detail/detail?id=${item.id}` })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20px;
}

.header {
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  padding: 20px 15px;
  text-align: center;

  .title {
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    display: block;
  }

  .subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 5px;
    display: block;
  }
}

.hot-list {
  padding: 15px;
}

.hot-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;

  .rank-badge {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;

    text {
      font-size: 14px;
      font-weight: bold;
      color: #666;
    }

    &.rank-1 {
      background: linear-gradient(135deg, #ff6b6b, #ff8e53);
      text { color: #fff; }
    }

    &.rank-2 {
      background: linear-gradient(135deg, #ffa726, #ffcc02);
      text { color: #fff; }
    }

    &.rank-3 {
      background: linear-gradient(135deg, #42a5f5, #64b5f6);
      text { color: #fff; }
    }
  }

  .hot-content {
    flex: 1;
    min-width: 0;

    .hot-title {
      font-size: 15px;
      color: #333;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 8px;
    }

    .hot-stats {
      display: flex;
      gap: 15px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 4px;

        text {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }

  .hot-tag {
    margin-left: 10px;
    flex-shrink: 0;
  }
}
</style>
