<template>
  <view class="status-tag">
    <view :style="{ backgroundColor: config.bgColor }" class="tag">
      <text :style="{ color: config.color }">{{ text }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { STATUS_CONFIG } from '@/utils/status-machine.js'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const config = computed(() => {
  const status = typeof props.status === 'string' ? props.status : ''
  return STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
})

const text = computed(() => config.value.text)
</script>

<style lang="scss" scoped>
.status-tag {
  .tag {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    text {
      font-weight: 500;
      white-space: nowrap;
    }
  }
}
</style>