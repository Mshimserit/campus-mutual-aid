<template>
  <view class="page">
    <view class="search-header">
      <view class="search-bar">
        <uni-icons type="left" size="20" @click="goBack"></uni-icons>
        <uni-search-bar
          v-model="keyword"
          placeholder="搜索帖子、用户"
          :radius="100"
          :focus="true"
          @confirm="onSearch"
          @input="onInput"
          @cancel="onCancel"
        />
      </view>
    </view>

    <view v-if="!hasSearched" class="search-content">
      <view class="hot-list-section">
        <view class="section-title">
          <text>热门搜索</text>
        </view>
        <view class="hot-tags">
          <view
            v-for="(tag, index) in hotTags"
            :key="index"
            class="hot-tag"
            @click="searchByTag(tag)"
          >
            <text>{{ tag }}</text>
          </view>
        </view>
      </view>

      <view class="history-section">
        <view class="section-title">
          <text>搜索历史</text>
          <uni-icons type="trash" size="16" color="#999" @click="clearHistory"></uni-icons>
        </view>
        <view class="history-tags">
          <view
            v-for="(item, index) in searchHistory"
            :key="index"
            class="history-tag"
            @click="searchByTag(item)"
          >
            <text>{{ item }}</text>
            <uni-icons type="closeempty" size="12" color="#999" @click.stop="deleteHistory(index)"></uni-icons>
          </view>
        </view>
      </view>

      <view class="hot-posts-section">
        <view class="section-title">
          <text>热榜推荐</text>
        </view>
        <view class="hot-post-item" v-for="post in hotPosts" :key="post.id" @click="goToPostDetail(post.id)">
          <text class="hot-post-title">{{ post.title }}</text>
          <text class="hot-post-heat">热度 {{ post.heat }}</text>
        </view>
      </view>
    </view>

    <view v-else class="search-results">
      <view v-if="loading" class="loading-wrapper">
        <uni-load-more status="loading" />
      </view>
      <view v-else-if="results.length === 0" class="empty-wrapper">
        <uni-load-more status="nomore" content="未找到相关结果" />
      </view>
      <view v-else class="results-list">
        <text class="results-count">找到 {{ results.length }} 条结果</text>
        <view class="result-item" v-for="post in results" :key="post.id" @click="goToPostDetail(post.id)">
          <text class="result-title">{{ post.title }}</text>
          <text class="result-summary">{{ post.summary }}</text>
          <view class="result-meta">
            <text class="result-author">{{ post.nickname }}</text>
            <text class="result-time">{{ post.createTime }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { postService } from '@/services/post-service'
import * as storage from '@/utils/storage'

const keyword = ref('')
const hasSearched = ref(false)
const loading = ref(false)
const results = ref([])
const searchHistory = ref([])
const hotPosts = ref([])

const hotTags = ref(['期末复习', '图书馆', '食堂', '篮球赛', '二手', '求助'])

onMounted(() => {
  searchHistory.value = storage.get('searchHistory', [])
  loadHotPosts()
})

function loadHotPosts() {
  hotPosts.value = [
    { id: 'p001', title: '期末复习攻略，图书馆占位指南', heat: 1520 },
    { id: 'p002', title: '二食堂新窗口测评', heat: 980 },
    { id: 'p003', title: '校园快递代取互助', heat: 856 },
    { id: 'p004', title: '周末篮球赛招募', heat: 720 }
  ]
}

function onInput(e) {
  keyword.value = e.detail || e
}

function onSearch() {
  if (!keyword.value.trim()) return

  hasSearched.value = true
  addToHistory(keyword.value.trim())
  executeSearch(keyword.value.trim())
}

function executeSearch(kw) {
  loading.value = true
  setTimeout(() => {
    const allPosts = [
      { id: 'p001', title: '期末复习攻略，图书馆占位指南', summary: '图书馆期末期间延长开放时间到晚上10点半', nickname: '神秘同学1234', createTime: '10分钟前' },
      { id: 'p002', title: '二食堂新窗口测评', summary: '麻辣烫味道不错但有点贵', nickname: '神秘同学9876', createTime: '30分钟前' },
      { id: 'p003', title: '校园快递代取互助', summary: '北区快递代送到宿舍，3元/件', nickname: '神秘同学5555', createTime: '1小时前' },
      { id: 'p004', title: '周末篮球赛招募', summary: '周六下午3点操场，6缺2', nickname: '神秘同学7777', createTime: '2小时前' }
    ]
    results.value = allPosts.filter(p =>
      p.title.includes(kw) || p.summary.includes(kw)
    )
    loading.value = false
  }, 300)
}

function searchByTag(tag) {
  keyword.value = tag
  hasSearched.value = true
  addToHistory(tag)
  executeSearch(tag)
}

function addToHistory(kw) {
  searchHistory.value = searchHistory.value.filter(h => h !== kw)
  searchHistory.value.unshift(kw)
  if (searchHistory.value.length > 10) searchHistory.value.pop()
  storage.set('searchHistory', searchHistory.value)
}

function deleteHistory(index) {
  searchHistory.value.splice(index, 1)
  storage.set('searchHistory', searchHistory.value)
}

function clearHistory() {
  searchHistory.value = []
  storage.remove('searchHistory')
}

function goToPostDetail(id) {
  uni.navigateTo({ url: `/pagesSub/post/detail/detail?id=${id}` })
}

function goBack() {
  uni.navigateBack()
}

function onCancel() {
  keyword.value = ''
  hasSearched.value = false
  results.value = []
}
</script>

<style lang="scss" scoped>
$primary-color: #FF6B6B;
$primary-light: #FFF0F0;
$secondary-color: #FF8C42;
$text-primary: #1A1A2E;
$text-secondary: #6B7280;
$text-muted: #9CA3AF;
$bg-color: #F8F9FA;
$card-shadow: 0 2px 16px rgba(0,0,0,0.06);
$border-radius: 12px;

.page {
  min-height: 100vh;
  background-color: $bg-color;
}

.search-header {
  margin-top: 20px;
  background: #FFFFFF;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.search-content {
  padding: 16px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;

  text {
    font-size: 16px;
    font-weight: 700;
    color: $text-primary;
  }
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;

  .hot-tag {
    padding: 8px 16px;
    background: linear-gradient(135deg, $primary-light 0%, #FFE0E0 100%);
    border-radius: 20px;
    font-size: 13px;
    color: $primary-color;
    font-weight: 600;
    transition: all 0.2s ease;
    
    &:active {
      transform: scale(0.95);
      box-shadow: 0 2px 8px rgba(255, 107, 107, 0.2);
    }
  }
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;

  .history-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: #FFFFFF;
    border-radius: 20px;
    font-size: 13px;
    color: $text-secondary;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    transition: all 0.2s ease;
    
    &:active {
      transform: scale(0.95);
    }
  }
}

.hot-posts-section {
  .hot-post-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #F3F4F6;
    transition: all 0.2s ease;
    
    &:active {
      background: #FFFFFF;
      border-radius: 8px;
      padding-left: 8px;
      padding-right: 8px;
    }

    .hot-post-title {
      font-size: 14px;
      color: $text-primary;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 10px;
      font-weight: 500;
    }

    .hot-post-heat {
      font-size: 12px;
      color: $primary-color;
      font-weight: 600;
    }
  }
}

.search-results {
  padding: 16px;

  .results-count {
    font-size: 13px;
    color: $text-muted;
    display: block;
    margin-bottom: 16px;
    font-weight: 500;
  }

  .result-item {
    background: #FFFFFF;
    border-radius: $border-radius;
    padding: 16px;
    margin-bottom: 10px;
    box-shadow: $card-shadow;
    transition: all 0.2s ease;
    
    &:active {
      transform: scale(0.98);
    }

    .result-title {
      font-size: 15px;
      font-weight: 600;
      color: $text-primary;
      display: block;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .result-summary {
      font-size: 13px;
      color: $text-secondary;
      display: block;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.5;
    }

    .result-meta {
      display: flex;
      justify-content: space-between;

      .result-author, .result-time {
        font-size: 12px;
        color: $text-muted;
      }
    }
  }
}

.loading-wrapper, .empty-wrapper {
  padding: 60px 0;
}
</style>
