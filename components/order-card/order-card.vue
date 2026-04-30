<template>
  <view class="order-card" @click="onCardClick" hover-class="card-hover">
    <!-- Card Header -->
    <view class="card-header">
      <image :src="order.publisherAvatar || '/static/logo.png'" class="avatar" mode="aspectFill" />
      <view class="user-info">
        <text class="nickname">{{ order.publisherNickname || '神秘同学' }}</text>
        <text class="publish-time">{{ order.formattedTime || order.createTime }}</text>
      </view>
      <status-tag :status="order.status" class="status-tag" />
    </view>

    <!-- Card Body -->
    <view v-if="canViewDetail" class="card-body">
      <text class="description">{{ order.description }}</text>
      <view class="tags-row">
        <view class="tag campus-tag">
          <uni-icons type="location" size="12" color="#34C759"></uni-icons>
          <text class="tag-text">{{ order.campus }}</text>
        </view>
        <view class="tag time-tag">
          <uni-icons type="calendar" size="12" color="#6B7280"></uni-icons>
          <text class="tag-text">{{ order.helpTime }}</text>
        </view>
        <view v-if="order.type" class="tag type-tag">
          <text class="tag-text">{{ order.type }}</text>
        </view>
      </view>
    </view>

    <!-- Locked State -->
    <view v-else class="card-body locked">
      <uni-icons type="locked" size="24" color="#9CA3AF"></uni-icons>
      <text class="locked-text">接单后可查看订单详情</text>
    </view>

    <!-- Card Footer -->
    <view class="card-footer">
      <view v-if="canViewDetail" class="commission">
        <text class="commission-label">到手佣金</text>
        <text class="commission-amount">¥{{ order.commission }}</text>
      </view>
      <view v-else class="commission commission-locked">
        <text class="commission-label">佣金</text>
        <text class="commission-amount locked-amount">--</text>
      </view>
      <view class="actions">
        <button
          v-if="canAccept"
          size="mini"
          type="primary"
          class="accept-btn"
          @click.stop="onAccept"
          hover-class="btn-hover"
        >
          接单
        </button>
        <button
          v-if="canView"
          size="mini"
          class="view-btn"
          @click.stop="onViewDetail"
          hover-class="btn-hover"
        >
          查看详情
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user-store'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['accept', 'click'])

const userStore = useUserStore()

const canAccept = computed(() => {
  return props.order.paid && props.order.status === 'PENDING' && props.order.publisherId !== userStore.userInfo?.id
})

const canView = computed(() => {
  return props.order.status !== 'PENDING' || props.order.publisherId === userStore.userInfo?.id
})

const canViewDetail = computed(() => {
  return props.order.accepted || props.order.publisherId === userStore.userInfo?.id
})

function onAccept() {
  emit('accept', props.order.id)
}

function onViewDetail() {
  uni.navigateTo({ url: `/pages/mutual/detail/detail?id=${props.order.id}` })
}

function onCardClick() {
  emit('click', props.order)
}
</script>

<style lang="scss" scoped>
$primary-color: #FF6B6B;
$primary-light: #FFF0F0;
$success-color: #34C759;
$text-primary: #1A1A2E;
$text-secondary: #6B7280;
$text-muted: #9CA3AF;
$border-color: #F0F0F0;

.order-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  &.card-hover {
    background-color: $primary-light;
    transform: scale(0.98);
  }

  &:active {
    transform: scale(0.98);
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 12px;
      border: 2px solid $border-color;
    }

    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .nickname {
        font-size: 14px;
        color: $text-primary;
        font-weight: 600;
      }

      .publish-time {
        font-size: 11px;
        color: $text-muted;
        margin-top: 2px;
      }
    }

    .status-tag {
      flex-shrink: 0;
    }
  }

  .card-body {
    margin-bottom: 12px;

    .description {
      font-size: 14px;
      color: $text-primary;
      line-height: 1.5;
      display: block;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .tags-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;

      .tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 500;

        &.campus-tag {
          background-color: rgba(52, 199, 89, 0.1);
          .tag-text {
            color: $success-color;
          }
        }

        &.time-tag {
          background-color: rgba(107, 114, 128, 0.1);
          .tag-text {
            color: $text-secondary;
          }
        }

        &.type-tag {
          background-color: rgba(255, 107, 107, 0.1);
          .tag-text {
            color: $primary-color;
          }
        }
      }
    }

    &.locked {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
      background: #F8F9FA;
      border-radius: 8px;

      .locked-text {
        font-size: 13px;
        color: $text-muted;
        margin-left: 8px;
        font-weight: 500;
      }
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid $border-color;

    .commission {
      display: flex;
      flex-direction: column;

      .commission-label {
        font-size: 11px;
        color: $text-muted;
      }

      .commission-amount {
        font-size: 18px;
        color: #ff4d4f;
        font-weight: bold;
      }

      &.commission-locked {
        .locked-amount {
          color: $text-muted;
        }
      }
    }

    .actions {
      display: flex;
      gap: 8px;

      .accept-btn {
        background: linear-gradient(135deg, $primary-color 0%, #FF8C42 100%);
        border: none;
        border-radius: 8px;
        padding: 6px 16px;
        font-size: 13px;
        font-weight: 600;
        color: #fff;

        &::after {
          border: none;
        }
      }

      .view-btn {
        background: #ffffff;
        border: 1px solid $primary-color;
        border-radius: 8px;
        padding: 6px 16px;
        font-size: 13px;
        font-weight: 600;
        color: $primary-color;

        &::after {
          border: none;
        }
      }
    }
  }
}

.btn-hover {
  opacity: 0.8;
  transform: scale(0.95);
}
</style>
