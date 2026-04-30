<template>
  <view class="skeleton" :style="{ width: width, height: height }">
    <view class="skeleton__pulse" :class="{ 'skeleton__pulse--animated': animated }"></view>
  </view>
</template>

<script>
export default {
  name: 'LoadingSkeleton',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '40rpx'
    },
    animated: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  display: inline-block;
  background-color: #f2f2f2;
  border-radius: 8rpx;
  overflow: hidden;
  position: relative;

  &__pulse {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      #f2f2f2 25%,
      #e6e6e6 37%,
      #f2f2f2 63%
    );
    background-size: 400% 100%;

    &--animated {
      animation: skeleton-loading 1.4s ease infinite;
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
