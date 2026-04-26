<template>
  <view class="page">
    <view class="profile-header" @click="goToEdit">
      <image :src="userInfo.avatar" class="avatar" mode="aspectFill" />
      <view class="user-info">
        <text class="nickname">{{ userInfo.nickname }}</text>
        <text class="school">{{ userInfo.school }} · {{ userInfo.grade }}</text>
      </view>
      <uni-icons type="right" size="16" color="#999"></uni-icons>
    </view>

    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-value">{{ userInfo.postCount }}</text>
        <text class="stat-label">已发帖</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ userInfo.likeCount }}</text>
        <text class="stat-label">被点赞</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ userInfo.fansCount }}</text>
        <text class="stat-label">粉丝</text>
      </view>
    </view>

    <view v-if="isRider" class="rider-stats-section">
      <view class="section-header">
        <text class="section-title">骑手数据</text>
        
      </view>
      <view class="rider-data">
        <view class="rider-stat-item">
          <text class="rider-stat-value">{{ riderStats.acceptedOrders }}</text>
          <text class="rider-stat-label">已接订单</text>
        </view>
        <view class="rider-stat-item">
          <text class="rider-stat-value">{{ riderStats.completedOrders }}</text>
          <text class="rider-stat-label">已完成</text>
        </view>
        <view class="rider-stat-item">
          <text class="rider-stat-value income">¥{{ riderStats.totalEarnings }}</text>
          <text class="rider-stat-label">累计收入</text>
        </view>
      </view>
      <view class="completion-rate">
        <text class="rate-label">订单完成率</text>
        <view class="rate-bar">
          <view class="rate-progress" :style="{ width: riderStats.completionRate + '%' }"></view>
        </view>
        <text class="rate-value">{{ riderStats.completionRate }}%</text>
      </view>
      <view class="certification-status">
        <uni-icons type="checkmarkcircle" size="16" color="#52c41a"></uni-icons>
        <text class="status-text">校园认证已通过</text>
        <text class="auth-divider">|</text>
        <uni-icons :type="riderStats.realNameCertified ? 'checkmarkcircle' : 'pluscircle'" size="16" :color="riderStats.realNameCertified ? '#52c41a' : '#999'"></uni-icons>
        <text class="status-text">{{ riderStats.realNameCertified ? '实名认证已通过' : '实名认证待完善' }}</text>
      </view>
    </view>

    <view class="menu-sections">
      <view class="section">
        <text class="section-title">账号信息</text>
        <view class="menu-list">
          <view class="menu-item">
            <uni-icons type="person" size="20" color="#333"></uni-icons>
            <text class="menu-name">用户角色</text>
            <text class="menu-extra">{{ userStore.userInfo?.roleName || '普通用户' }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section-title">内容管理</text>
        <view class="menu-list">
          <view class="menu-item" @click="goToPage('/pages/profile/my-posts/my-posts')">
            <uni-icons type="compose" size="20" color="#333"></uni-icons>
            <text class="menu-name">我的帖子</text>
            <text class="menu-extra">{{ userInfo.postCount }}</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
          <view class="menu-item" @click="goToPage('/pages/profile/my-comments/my-comments')">
            <uni-icons type="chat" size="20" color="#333"></uni-icons>
            <text class="menu-name">历史评论</text>
            <text class="menu-extra">{{ userInfo.commentCount }}</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
          <view class="menu-item" @click="goToPage('/pages/profile/my-watch/my-watch')">
            <uni-icons type="eye" size="20" color="#333"></uni-icons>
            <text class="menu-name">我的蹲贴</text>
            <view v-if="hasNewWatch" class="red-dot"></view>
            <text class="menu-extra">{{ userInfo.watchCount }}</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
          <view class="menu-item" @click="goToPage('/pages/profile/my-favorites/my-favorites')">
            <uni-icons type="star" size="20" color="#333"></uni-icons>
            <text class="menu-name">我的收藏</text>
            <text class="menu-extra">{{ userInfo.favoriteCount }}</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </view>
      </view>

      <view class="section" v-if="hasRiderIncome">
        <text class="section-title">收益管理</text>
        <view class="menu-list">
          <view class="menu-item" @click="goToPage('/pages/profile/wallet/wallet')">
            <uni-icons type="wallet" size="20" color="#333"></uni-icons>
            <text class="menu-name">跑腿收益</text>
            <text class="menu-extra income">¥{{ riderIncome }}</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section-title">服务与支持</text>
        <view class="menu-list">
          <view class="menu-item" @click="goToPage('/pages/profile/service/customer-service')">
            <uni-icons type="chat" size="20" color="#333"></uni-icons>
            <text class="menu-name">本校客服</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
          <view class="menu-item" @click="goToPage('/pages/profile/service/help-center')">
            <uni-icons type="staff" size="20" color="#333"></uni-icons>
            <text class="menu-name">官方客服</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
          <view class="menu-item" @click="goToPage('/pages/profile/service/appeal')">
            <uni-icons type="undo" size="20" color="#333"></uni-icons>
            <text class="menu-name">封禁申诉</text>
            <view v-if="hasAppealResult" class="red-dot"></view>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
          <view class="menu-item" @click="goToPage('/pages/profile/service/feedback')">
            <uni-icons type="compose" size="20" color="#333"></uni-icons>
            <text class="menu-name">建议反馈</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section-title">商务与设置</text>
        <view class="menu-list">
          <view class="menu-item" @click="goToPage('/pages/profile/settings/business')">
            <uni-icons type="shop" size="20" color="#333"></uni-icons>
            <text class="menu-name">商务合作</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
          <view class="menu-item" @click="goToPage('/pages/profile/settings/create-circle')">
            <uni-icons type="plus" size="20" color="#333"></uni-icons>
            <text class="menu-name">开通圈子</text>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
          <view class="menu-item" @click="goToPage('/pages/profile/settings/user-agreement')">
            <uni-icons type="document" size="20" color="#333"></uni-icons>
            <text class="menu-name">用户协议</text>
            <view v-if="hasAgreementUpdate" class="new-tag">New</view>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
          <view class="menu-item" @click="goToPage('/pages/profile/settings/privacy-policy')">
            <uni-icons type="locked" size="20" color="#333"></uni-icons>
            <text class="menu-name">隐私政策</text>
            <view v-if="hasPrivacyUpdate" class="new-tag">New</view>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
          <view class="menu-item logout-item" @click="handleLogout">
            <uni-icons type="closeempty" size="20" color="#ff4d4f"></uni-icons>
            <text class="menu-name logout-text">退出登录</text>
            <uni-icons type="right" size="16" color="#ff4d4f"></uni-icons>
          </view>
        </view>
      </view>
    </view>

    <view class="footer-uid">
      <text>UID: {{ userInfo.uid }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user-store'
import { useWalletStore } from '@/stores/wallet-store'
import { useOrderStore } from '@/stores/order-store'

const userStore = useUserStore()
const walletStore = useWalletStore()
const orderStore = useOrderStore()

const userInfo = ref({
  avatar: '/static/logo.png',
  nickname: '神秘同学2054826543',
  school: 'xxx',
  grade: '大二',
  postCount: 12,
  likeCount: 45,
  fansCount: 28,
  commentCount: 56,
  watchCount: 8,
  favoriteCount: 15,
  uid: '2054826543'
})

const hasNewWatch = ref(true)
const hasAppealResult = ref(false)
const hasAgreementUpdate = ref(true)
const hasPrivacyUpdate = ref(true)

const hasRiderIncome = computed(() => walletStore.totalIncome > 0)
const riderIncome = computed(() => walletStore.totalIncome.toFixed(2))

const isRider = computed(() => {
  return orderStore.orders.some(o => o.acceptorId === userStore.userInfo?.id)
})

const riderStats = computed(() => {
  const myOrders = orderStore.orders.filter(o => o.acceptorId === userStore.userInfo?.id)
  const acceptedOrders = myOrders.length
  const completedOrders = myOrders.filter(o => o.status === 'COMPLETED').length
  const totalEarnings = myOrders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + parseFloat(o.commission || 0), 0)
  const completionRate = acceptedOrders > 0 ? Math.round((completedOrders / acceptedOrders) * 100) : 0

  return {
    acceptedOrders,
    completedOrders,
    totalEarnings: totalEarnings.toFixed(2),
    completionRate,
    realNameCertified: userStore.userInfo?.realNameCertified || false
  }
})

onMounted(() => {
  loadUserInfo()
})

function loadUserInfo() {
  const user = userStore.userInfo
  if (user) {
    userInfo.value = {
      ...userInfo.value,
      nickname: user.nickname || userInfo.value.nickname,
      school: user.school || userInfo.value.school
    }
  }
}

function goToEdit() {
  uni.navigateTo({ url: '/pages/profile/center/center' })
}

function goToPage(url) {
  uni.navigateTo({ url })
}

function goToRiderOrders() {
  uni.switchTab({ url: '/pages/mutual/list/list' })
}

function handleLogout() {
  uni.showModal({
    title: '确认退出',
    content: '退出后需重新登录才能继续使用',
    confirmText: '退出登录',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
      }
    }
  })
}
</script>

<style lang="scss" scoped>
$primary-color: #6bff8e;
$primary-light: #FFF0F0;
$secondary-color: #42ffc9a0;
$success-color: #34C759;
$text-primary: #1A1A2E;
$text-secondary: #6B7280;
$text-muted: #9CA3AF;
$bg-color: #F8F9FA;
$card-shadow: 0 2px 16px rgba(0,0,0,0.06);
$border-radius: 12px;

.page {
  min-height: 100vh;
  background-color: $bg-color;
  padding-bottom: 30px;
}

.profile-header {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  padding: 30px 16px;
  color: #FFFFFF;

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 15px;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .user-info {
    flex: 1;

    .nickname {
      font-size: 18px;
      font-weight: 700;
      display: block;
      margin-bottom: 5px;
    }

    .school {
      font-size: 13px;
      opacity: 0.85;
    }
  }
}

.stats-section {
  display: flex;
  background: #FFFFFF;
  padding: 18px;
  margin-top: 8px;
  box-shadow: $card-shadow;

  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: $text-primary;
    }

    .stat-label {
      font-size: 12px;
      color: $text-muted;
      margin-top: 4px;
      font-weight: 500;
    }
  }
}

.rider-stats-section {
  background: #FFFFFF;
  margin-top: 8px;
  padding: 16px;
  box-shadow: $card-shadow;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: $text-primary;
    }

    .more-link {
      font-size: 13px;
      color: $primary-color;
      font-weight: 600;
    }
  }

  .rider-data {
    display: flex;
    justify-content: space-around;
    padding: 12px 0;
    border-bottom: 1px solid #F3F4F6;

    .rider-stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .rider-stat-value {
        font-size: 18px;
        font-weight: 700;
        color: $text-primary;

        &.income { color: $primary-color; }
      }

      .rider-stat-label {
        font-size: 12px;
        color: $text-muted;
        margin-top: 4px;
        font-weight: 500;
      }
    }
  }

  .completion-rate {
    display: flex;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #F3F4F6;

    .rate-label {
      font-size: 13px;
      color: $text-secondary;
      width: 75px;
      font-weight: 500;
    }

    .rate-bar {
      flex: 1;
      height: 8px;
      background: #F3F4F6;
      border-radius: 4px;
      margin: 0 12px;
      overflow: hidden;

      .rate-progress {
        height: 100%;
        background: linear-gradient(135deg, $success-color 0%, #6EE7A0 100%);
        border-radius: 4px;
        transition: width 0.3s;
      }
    }

    .rate-value {
      font-size: 13px;
      color: $success-color;
      font-weight: 700;
      width: 45px;
      text-align: right;
    }
  }

  .certification-status {
    display: flex;
    align-items: center;
    padding-top: 14px;
    flex-wrap: wrap;
    gap: 6px;

    .status-text {
      font-size: 12px;
      color: $text-secondary;
      font-weight: 500;
    }

    .auth-divider {
      color: #E5E7EB;
      margin: 0 6px;
    }
  }
}

.menu-sections {
  .section {
    margin-top: 8px;
    background: #FFFFFF;
    box-shadow: $card-shadow;

    .section-title {
      font-size: 13px;
      color: $text-muted;
      padding: 12px 16px 8px;
      display: block;
      font-weight: 600;
    }

    .menu-list {
      .menu-item {
        display: flex;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #F9FAFB;
        position: relative;
        transition: all 0.2s ease;
        
        &:active {
          background: $bg-color;
        }

        &:last-child { border-bottom: none; }

        .menu-name {
          flex: 1;
          margin-left: 12px;
          font-size: 15px;
          color: $text-primary;
          font-weight: 500;
        }

        .menu-extra {
          color: $text-muted;
          font-size: 13px;
          margin-right: 8px;
          font-weight: 500;

          &.income { color: $primary-color; font-weight: 700; }
        }

        .red-dot {
          width: 8px;
          height: 8px;
          background: $primary-color;
          border-radius: 50%;
          margin-right: 8px;
        }

        .new-tag {
          font-size: 10px;
          color: #FFFFFF;
          background: $primary-color;
          padding: 2px 6px;
          border-radius: 4px;
          margin-right: 8px;
          font-weight: 600;
        }

        &.logout-item {
          &:active {
            background: #fff1f0;
          }

          .menu-name.logout-text {
            color: #ff4d4f;
            font-weight: 600;
          }
        }
      }
    }
  }
}

.footer-uid {
  text-align: center;
  padding: 20px;

  text {
    font-size: 12px;
    color: $text-muted;
  }
}
</style>
