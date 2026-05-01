<template>
  <view class="page">
    <scroll-view scroll-y class="content">
      <text class="title">用户协议</text>
      <text class="content-text">
        欢迎使用校园互助平台。在使用本服务前，请仔细阅读并理解本协议内容。

        一、服务说明
        本服务为用户提供校园内互助跑腿、信息发布与交流的平台。

        二、用户规范
        1. 用户应遵守法律法规，不得发布违法内容。
        2. 禁止发布虚假、欺诈信息。
        3. 尊重他人权益，不得进行人身攻击。

        三、交易规则
        1. 平台提供担保交易服务，保障双方权益。
        2. 发单人发布需求后需支付佣金至平台担保账户。
        3. 接单人完成服务后，经发单人确认，佣金结算至接单人账户。

        四、隐私保护
        平台将严格保护用户隐私信息，未经用户同意不会向第三方泄露。

        五、免责声明
        对于用户之间产生的纠纷，平台有权但无义务介入调解。

        六、协议修改
        平台保留随时修改本协议的权利，修改后将通过站内通知告知用户。
      </text>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #fff; }
.content { padding: 20px; }
.title { font-size: 20px; font-weight: bold; color: #333; display: block; margin-bottom: 20px; text-align: center; }
.content-text { font-size: 14px; color: #666; line-height: 2; white-space: pre-wrap; }
</style>
