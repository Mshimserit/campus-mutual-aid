<template>
  <view class="order-card" @click="onCardClick">
    <view class="card-header">
      <image :src="order.publisherAvatar || '/static/logo.png'" class="avatar" mode="aspectFill" />
      <text class="nickname">{{ order.publisherNickname || '神秘同学' }}</text>
      <status-tag :status="order.status" class="status-tag" />
    </view>

    <view v-if="canViewDetail" class="card-body">
      <text class="description">{{ order.description }}</text>
      <view class="tags-row">
        <uni-tag :text="order.campus" type="success" size="small" />
        <text class="time-tag">{{ order.helpTime }}</text>
      </view>
    </view>

    <view v-else class="card-body locked">
      <uni-icons type="locked" size="24" color="#9CA3AF"></uni-icons>
      <text class="locked-text">接单后可查看订单详情</text>
    </view>

    <view class="card-footer">
      <view v-if="canViewDetail" class="commission">
        <text class="commission-label">到手佣金</text>
        <text class="commission-amount">¥{{ order.commission }}</text>
      </view>
      <view v-else class="commission-placeholder">
        <text class="commission-placeholder-text">--</text>
      </view>
      <view class="actions">
        <button
          v-if="canAccept"
          size="mini"
          type="primary"
          @click.stop="onAccept"
        >
          接单
        </button>
        <button
          v-if="canView"
          size="mini"
          @click.stop="onViewDetail"
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
.order-card {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .nickname {
      flex: 1;
      font-size: 14px;
      color: #333;
    }
  }

  .card-body {
    margin-bottom: 10px;

    .description {
      font-size: 15px;
      color: #333;
      display: block;
      margin-bottom: 8px;
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

      .time-tag {
        font-size: 12px;
        color: #999;
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
        color: #9CA3AF;
        margin-left: 8px;
        font-weight: 500;
      }
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    border-top: 1px solid #f0f0f0;

    .commission {
      display: flex;
      align-items: center;
      gap: 5px;

      .commission-label {
        font-size: 12px;
        color: #999;
      }

      .commission-amount {
        font-size: 18px;
        color: #ff4d4f;
        font-weight: bold;
      }
    }

    .commission-placeholder {
      .commission-placeholder-text {
        font-size: 18px;
        color: #D0D0D0;
        font-weight: bold;
      }
    }

    .actions {
      display: flex;
      gap: 8px;
    }
  }
}
</style>
