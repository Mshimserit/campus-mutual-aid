<template>
  <view class="empty-state" v-if="show">
    <uni-icons :type="iconType" :size="iconSize" :color="iconColor"></uni-icons>
    <text class="empty-text">{{ title }}</text>
    <text v-if="subtitle" class="empty-subtitle">{{ subtitle }}</text>
    <button v-if="showAction" size="default" type="primary" @click="onAction" class="action-btn">
      {{ actionText }}
    </button>
  </view>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    iconType: {
      type: String,
      default: 'info'
    },
    iconSize: {
      type: Number,
      default: 60
    },
    iconColor: {
      type: String,
      default: '#d9d9d9'
    },
    title: {
      type: String,
      default: '暂无数据'
    },
    subtitle: {
      type: String,
      default: ''
    },
    showAction: {
      type: Boolean,
      default: false
    },
    actionText: {
      type: String,
      default: '去逛逛'
    }
  },
  emits: ['action'],
  methods: {
    onAction() {
      this.$emit('action')
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  animation: fadeIn 0.3s ease;

  .empty-text {
    font-size: 16px;
    font-weight: 600;
    color: #9CA3AF;
    margin-top: 16px;
    margin-bottom: 8px;
  }

  .empty-subtitle {
    font-size: 13px;
    color: #B0B7C3;
    margin-bottom: 24px;
  }

  .action-btn {
    width: 150px;
    border-radius: 8px;
    padding: 8px 24px;
    font-size: 14px;
    font-weight: 600;

    &::after {
      border: none;
    }

    &:active {
      opacity: 0.8;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>