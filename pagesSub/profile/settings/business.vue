<template>
  <view class="page">
    <view class="info-card">
      <text class="title">商务合作</text>
      <text class="desc">我们欢迎各类商务合作，如有意向请通过以下方式联系我们：</text>
      <view class="contact-info">
        <view class="contact-item">
          <text class="label">邮箱</text>
          <text class="value">business@campus-helper.com</text>
        </view>
        <view class="contact-item">
          <text class="label">电话</text>
          <text class="value">400-123-4567</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #f5f5f5; padding: 15px; }
.info-card {
  background: #fff; border-radius: 8px; padding: 20px;
  .title { font-size: 18px; font-weight: bold; color: #333; display: block; margin-bottom: 10px; }
  .desc { font-size: 14px; color: #666; display: block; margin-bottom: 20px; line-height: 1.6; }
  .contact-info {
    .contact-item {
      display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0;
      .label { font-size: 14px; color: #666; }
      .value { font-size: 14px; color: #333; }
    }
  }
}
</style>
