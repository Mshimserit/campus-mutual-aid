<template>
  <view class="status-tag">
    <view :class="['tag', colorClass]">
      <text>{{ text }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { STATUS_CONFIG } from '@/utils/status-machine'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const config = computed(() => {
  return STATUS_CONFIG[props.status] || STATUS_CONFIG.PENDING
})

const text = computed(() => config.value.text)

const colorClass = computed(() => {
  return `tag-${config.value.color}`
})
</script>

<style lang="scss" scoped>
.status-tag {
  .tag {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;

    text {
      color: #fff;
    }

    &.tag-gray, &.tag-grey { background: #8c8c8c; }
    &.tag-blue { background: #1890ff; }
    &.tag-orange { background: #fa8c16; }
    &.tag-green { background: #52c41a; }
  }
}
</style>
