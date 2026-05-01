<template>
  <scroll-view
    class="virtual-list"
    scroll-y
    :style="{ height: listHeight }"
    @scroll="onScroll"
    :scroll-top="scrollTop"
    :lower-threshold="lowerThreshold"
    @scrolltolower="onLoadMore"
  >
    <view :style="{ height: totalHeight + 'px', position: 'relative' }">
      <view
        :style="{
          transform: `translateY(${offsetY}px)`,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0
        }"
      >
        <view
          v-for="item in visibleItems"
          :key="item[itemKey]"
          :id="'virtual-item-' + item[itemKey]"
          class="virtual-list-item"
        >
          <slot :item="item" :index="item.__virtualIndex"></slot>
        </view>
      </view>
    </view>

    <view v-if="loading && !allLoaded" class="virtual-list-loading">
      <uni-load-more status="loading" />
    </view>
    <view v-else-if="allLoaded && items.length > 0" class="virtual-list-footer">
      <text class="footer-text">— 已经到底了 —</text>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  itemKey: {
    type: String,
    default: 'id'
  },
  itemHeight: {
    type: Number,
    default: 120
  },
  listHeight: {
    type: String,
    default: '100vh'
  },
  buffer: {
    type: Number,
    default: 5
  },
  loading: {
    type: Boolean,
    default: false
  },
  allLoaded: {
    type: Boolean,
    default: false
  },
  lowerThreshold: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['loadMore', 'scroll'])

const scrollTop = ref(0)
const offsetY = ref(0)
const startIndex = ref(0)
const endIndex = ref(10)
const measuredHeights = ref({})

const totalHeight = computed(() => {
  if (props.items.length === 0) return 0
  let total = 0
  for (let i = 0; i < props.items.length; i++) {
    total += getItemHeight(i)
  }
  return total
})

const visibleCount = computed(() => {
  const listPx = parseHeight(props.listHeight)
  return Math.ceil(listPx / props.itemHeight) + props.buffer * 2
})

const visibleItems = computed(() => {
  const start = Math.max(0, startIndex.value - props.buffer)
  const end = Math.min(props.items.length, endIndex.value + props.buffer)
  return props.items.slice(start, end).map((item, i) => ({
    ...item,
    __virtualIndex: start + i
  }))
})

function getItemHeight(index) {
  if (measuredHeights.value[index] !== undefined) {
    return measuredHeights.value[index]
  }
  return props.itemHeight
}

function parseHeight(heightStr) {
  if (heightStr === '100vh') {
    const sysInfo = uni.getSystemInfoSync()
    return sysInfo.windowHeight || 667
  }
  return parseInt(heightStr) || 667
}

function onScroll(e) {
  const scrollTopVal = e.detail.scrollTop
  scrollTop.value = scrollTopVal

  let accumulated = 0
  let newStart = 0
  for (let i = 0; i < props.items.length; i++) {
    accumulated += getItemHeight(i)
    if (accumulated > scrollTopVal) {
      newStart = i
      break
    }
  }

  const listPx = parseHeight(props.listHeight)
  let endAccumulated = 0
  let newEnd = props.items.length
  for (let i = newStart; i < props.items.length; i++) {
    endAccumulated += getItemHeight(i)
    if (endAccumulated > listPx + props.itemHeight * props.buffer) {
      newEnd = i + 1
      break
    }
  }

  startIndex.value = newStart
  endIndex.value = newEnd

  let topOffset = 0
  for (let i = 0; i < newStart; i++) {
    topOffset += getItemHeight(i)
  }
  offsetY.value = topOffset

  emit('scroll', e)
}

function onLoadMore() {
  if (!props.loading && !props.allLoaded) {
    emit('loadMore')
  }
}

function scrollToIndex(index) {
  let top = 0
  for (let i = 0; i < index; i++) {
    top += getItemHeight(i)
  }
  scrollTop.value = top
}

function reset() {
  scrollTop.value = 0
  startIndex.value = 0
  endIndex.value = visibleCount.value
  offsetY.value = 0
}

watch(() => props.items, () => {
  nextTick(() => {
    measuredHeights.value = {}
  })
}, { deep: false })

onMounted(() => {
  endIndex.value = visibleCount.value
})

defineExpose({
  scrollToIndex,
  reset
})
</script>

<style lang="scss" scoped>
.virtual-list {
  width: 100%;
  position: relative;
}

.virtual-list-item {
  width: 100%;
}

.virtual-list-loading {
  padding: 24rpx 0;
  display: flex;
  justify-content: center;
}

.virtual-list-footer {
  padding: 24rpx 0;
  text-align: center;

  .footer-text {
    font-size: 24rpx;
    color: #9CA3AF;
  }
}
</style>