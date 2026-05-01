<template>
  <view class="page">
    <view class="faq-section">
      <text class="section-title">常见问题</text>
      <view class="faq-item" v-for="faq in faqs" :key="faq.id" @click="toggleFaq(faq)">
        <view class="faq-question">
          <text>{{ faq.question }}</text>
          <uni-icons :type="faq.expanded ? 'up' : 'down'" size="16" color="#999"></uni-icons>
        </view>
        <view v-if="faq.expanded" class="faq-answer">
          <text>{{ faq.answer }}</text>
        </view>
      </view>
    </view>

    <view class="contact-section">
      <button type="primary" @click="contactHuman">转人工客服</button>
      <view class="hotline">
        <text>客服热线：400-123-4567</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const faqs = ref([
  { id: 1, question: '如何成为骑手？', answer: '完成校园认证和实名认证后，即可申请成为骑手。', expanded: false },
  { id: 2, question: '佣金如何结算？', answer: '订单完成后，佣金会自动结算到您的钱包，扣除平台服务费后可提现。', expanded: false },
  { id: 3, question: '如何提现？', answer: '进入"我的钱包"页面，点击"提现"按钮，输入提现金额即可。', expanded: false },
  { id: 4, question: '订单可以取消吗？', answer: '在未被接单状态下，发单人可以取消订单，佣金将原路退回。', expanded: false }
])

function toggleFaq(faq) {
  faq.expanded = !faq.expanded
}

function contactHuman() {
  uni.navigateTo({ url: '/pagesSub/profile/service/customer-service' })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 15px;
}

.faq-section {
  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 15px;
  }

  .faq-item {
    background: #fff;
    border-radius: 8px;
    margin-bottom: 10px;

    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      font-size: 15px;
      color: #333;
    }

    .faq-answer {
      padding: 0 15px 15px;
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }
  }
}

.contact-section {
  margin-top: 30px;

  .hotline {
    text-align: center;
    margin-top: 15px;
    color: #999;
    font-size: 14px;
  }
}
</style>
