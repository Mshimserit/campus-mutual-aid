<template>
  <view class="empty-state" v-if="show">
    <image :src="icon" class="empty-icon" mode="aspectFit" />
    <text class="empty-text">{{ text }}</text>
    <button v-if="showButton" size="default" type="primary" @click="onButtonClick" class="action-btn">
      {{ buttonText }}
    </button>
  </view>
</template>

<script setup>
const props = defineProps({
  show: { type: Boolean, default: true },
  icon: { type: String, default: '/static/logo.png' },
  text: { type: String, default: '暂无数据' },
  showButton: { type: Boolean, default: false },
  buttonText: { type: String, default: '去逛逛' }
})

const emit = defineEmits(['click'])

function onButtonClick() {
  emit('click')
}
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  .empty-icon {
    width: 120px;
    height: 120px;
    margin-bottom: 15px;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 14px;
    color: #999;
    margin-bottom: 20px;
  }

  .action-btn {
    width: 150px;
  }
}
</style>
