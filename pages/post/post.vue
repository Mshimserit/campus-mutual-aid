<template>
  <view class="page">
    <view class="post-type-selector">
      <text class="selector-title">选择主题分类</text>
      <view class="type-grid">
        <view
          v-for="type in postTypes"
          :key="type.value"
          class="type-item"
          @click="selectType(type)"
        >
          <uni-icons :type="type.icon" size="30" :color="type.color"></uni-icons>
          <text class="type-text">{{ type.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const postTypes = [
  { label: '分享吐槽', value: 'share', icon: 'chat', color: '#1890ff' },
  { label: '求助答疑', value: 'help', icon: 'help', color: '#fa8c16' },
  { label: '组队交友', value: 'social', icon: 'friend', color: '#52c41a' },
  { label: '二手闲置', value: 'secondhand', icon: 'shop', color: '#722ed1' },
  { label: '树洞', value: 'secret', icon: 'locked', color: '#eb2f96' }
]

function selectType(type) {
  uni.navigateTo({
    url: `/pages/post/editor/editor?type=${type.value}&label=${type.label}`
  })
}
</script>

<style lang="scss" scoped>
$primary-color: #FF6B6B;
$primary-light: #FFF0F0;
$secondary-color: #FF8C42;
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
}

.post-type-selector {
  padding: 40px 20px;

  .selector-title {
    font-size: 20px;
    font-weight: 700;
    color: $text-primary;
    display: block;
    text-align: center;
    margin-bottom: 32px;
  }

  .type-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 12px;

    .type-item {
      width: 30%;
      background: #FFFFFF;
      border-radius: $border-radius;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: $card-shadow;
      transition: all 0.2s ease;
      
      &:active {
        transform: scale(0.95);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .type-text {
        font-size: 14px;
        color: $text-primary;
        margin-top: 12px;
        font-weight: 600;
      }
    }
  }
}
</style>
