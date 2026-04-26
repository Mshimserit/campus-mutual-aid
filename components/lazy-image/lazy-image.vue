<template>
  <image
    :src="isInView || !lazyLoad ? finalSrc : placeholder"
    :mode="mode"
    :lazy-load="false"
    class="lazy-image"
    :class="{ loaded: isInView || !lazyLoad }"
    @load="onLoad"
    @error="onError"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    default: 'aspectFill'
  },
  placeholder: {
    type: String,
    default: '/static/placeholder.png'
  },
  lazyLoad: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['load', 'error'])

const isInView = ref(false)
const loadFailed = ref(false)

const finalSrc = computed(() => {
  if (loadFailed.value) {
    return props.placeholder
  }
  return props.src
})

let observer = null

onMounted(() => {
  if (props.lazyLoad && typeof IntersectionObserver !== 'undefined') {
    createObserver()
  } else {
    isInView.value = true
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

function createObserver() {
  const query = uni.createSelectorQuery().in(getCurrentInstance())
  query.select('.lazy-image').boundingClientRect()

  observer = uni.createIntersectionObserver(uni.getPageStack ? uni.getPageStack()[0] : getCurrentPages()[0])
  observer.relativeToViewport({ rootMargin: '50px' })
  observer.observe('.lazy-image', (res) => {
    if (res.intersectionRatio > 0) {
      isInView.value = true
      observer.disconnect()
      observer = null
    }
  })
}

function onLoad(e) {
  emit('load', e)
}

function onError(e) {
  loadFailed.value = true
  emit('error', e)
}
</script>

<style lang="scss" scoped>
.lazy-image {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  transition: opacity 0.3s;

  &:not(.loaded) {
    opacity: 0;
  }

  &.loaded {
    opacity: 1;
  }
}
</style>
