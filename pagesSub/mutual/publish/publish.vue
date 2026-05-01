<template>
  <view class="page">
    <uni-notice-bar
      showIcon
      scrollable
      text="引导您私下交易；引导您主动取消订单，欢迎联系客服举报"
      background-color="#fff1f0"
      color="#ff4d4f"
    />

    <view class="flow-guide">
      <uni-steps :options="flowSteps" :active="-1" active-color="#1890ff" />
    </view>

    <view class="form-wrapper">
      <uni-forms ref="formRef" :model="formData" :rules="rules" label-width="100">
        <uni-forms-item label="帮做的事情" name="description" required>
          <uni-easyinput
            v-model="formData.description"
            type="textarea"
            placeholder="如去某地领取快递送去某个宿舍、代打印资料…（敏感信息及联系方式此处不要填写）"
            :maxlength="200"
            :inputBorder="false"
          />
        </uni-forms-item>

        <uni-forms-item label="互助时间" name="helpTime" required>
          <uni-datetime-picker
            v-model="formData.helpTime"
            type="datetime"
            placeholder="选择互助时间"
          />
        </uni-forms-item>

        <uni-forms-item label="联系号码" name="phone" required>
          <uni-easyinput
            v-model="formData.phone"
            placeholder="请输入联系电话"
            type="number"
          />
        </uni-forms-item>

        <uni-forms-item label="选择校区" name="campus" required>
          <uni-data-checkbox
            v-model="formData.campus"
            :localdata="campusOptions"
          />
        </uni-forms-item>

        <uni-forms-item label="确认佣金" name="amount" required>
          <view class="amount-wrapper">
            <uni-easyinput
              v-model="formData.amount"
              type="digit"
              placeholder="输入你的预算金额~"
              prefix-text="¥"
            />
            <view class="quick-amounts">
              <view
                v-for="amt in quickAmounts"
                :key="amt"
                :class="['amount-tag', { active: formData.amount === amt.toString() }]"
                @click="selectAmount(amt)"
              >
                {{ amt }}元
              </view>
            </view>
          </view>
        </uni-forms-item>
      </uni-forms>

      <view class="agreement">
        <checkbox-group @change="onAgreementChange">
          <label>
            <checkbox :checked="agreed" color="#1890ff" />
            <text>我已阅读并同意《逛逛校园圈跑腿平台发单系统协议》</text>
          </label>
        </checkbox-group>
      </view>
    </view>

    <view class="footer-actions">
      <view class="commission-display">
        <text class="label">悬赏佣金</text>
        <text class="amount">¥{{ formData.amount || 0 }}</text>
      </view>
      <button
        type="primary"
        :disabled="!agreed"
        @click="submitOrder"
        :class="['submit-btn', { disabled: !agreed }]"
      >
        发布订单
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user-store'
import { orderService } from '@/services/order-service'

const userStore = useUserStore()

const formRef = ref(null)
const agreed = ref(false)

const formData = reactive({
  description: '',
  helpTime: '',
  phone: userStore.userInfo?.phone || '',
  campus: '不限校区',
  amount: ''
})

const rules = {
  description: { rules: [{ required: true, errorMessage: '请输入任务描述' }] },
  helpTime: { rules: [{ required: true, errorMessage: '请选择互助时间' }] },
  phone: {
    rules: [
      { required: true, errorMessage: '请输入联系电话' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '请输入正确的11位手机号' }
    ]
  },
  campus: { rules: [{ required: true, errorMessage: '请选择校区' }] },
  amount: {
    rules: [
      { required: true, errorMessage: '请输入佣金金额' },
      {
        validateFunction: (rule, value, allData, callback) => {
          const num = parseFloat(value)
          if (isNaN(num) || num <= 0) {
            callback('请输入大于0的金额')
          } else {
            callback()
          }
        }
      }
    ]
  }
}

const campusOptions = [
  { value: '不限校区', text: '不限校区' },
  { value: '江宁校区', text: '江宁校区' },
  { value: '幕府校区', text: '幕府校区' }
]

const quickAmounts = [3, 4, 5, 6, 8, 10]

const flowSteps = [
  { title: '填写信息' },
  { title: '支付佣金' },
  { title: '接单帮忙' },
  { title: '完成订单' }
]

function selectAmount(amt) {
  formData.amount = amt.toString()
}

function onAgreementChange(e) {
  agreed.value = e.detail.value.length > 0
}

async function submitOrder() {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  if (!agreed.value) {
    uni.showToast({ title: '请先同意协议', icon: 'none' })
    return
  }

  formRef.value.validate().then(async (res) => {
    uni.showLoading({ title: '发布中...' })

    try {
      const orderData = {
        description: formData.description,
        helpTime: formData.helpTime,
        phone: formData.phone,
        campus: formData.campus,
        amount: parseFloat(formData.amount),
        publisherId: userStore.userInfo?.id
      }

      const order = await orderService.createOrder(orderData)

      uni.hideLoading()
      uni.showToast({ title: '发布成功', icon: 'success' })

      const params = {
        orderId: order.id,
        description: orderData.description,
        helpTime: orderData.helpTime,
        phone: orderData.phone,
        campus: orderData.campus,
        amount: orderData.amount
      }

      setTimeout(() => {
        uni.redirectTo({
          url: `/pagesSub/mutual/payment/payment?orderId=${order.id}&description=${encodeURIComponent(orderData.description)}&helpTime=${encodeURIComponent(orderData.helpTime)}&phone=${encodeURIComponent(orderData.phone)}&campus=${encodeURIComponent(orderData.campus)}&amount=${orderData.amount}`
        })
      }, 1000)
    } catch (e) {
      uni.hideLoading()
      uni.showToast({ title: '发布失败', icon: 'none' })
    }
  }).catch(err => {
    uni.showToast({ title: '请检查表单', icon: 'none' })
  })
}
</script>

<style lang="scss" scoped>
$primary-color: #FF6B6B;
$primary-light: #FFF0F0;
$secondary-color: #FF8C42;
$text-primary: #1A1A2E;
$text-secondary: #6B7280;
$text-muted: #9CA3AF;
$bg-color: #F8F9FA;
$card-shadow: 0 2px 16px rgba(0,0,0,0.06);
$border-radius: 12px;

.page {
  min-height: 100vh;
  background-color: $bg-color;
  padding-bottom: 80px;
}

.flow-guide {
  background: #FFFFFF;
  padding: 16px;
  margin-top: 8px;
  box-shadow: $card-shadow;
}

.form-wrapper {
  background: #FFFFFF;
  margin-top: 8px;
  padding: 16px;
  box-shadow: $card-shadow;

  .amount-wrapper {
    .quick-amounts {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 12px;

      .amount-tag {
        padding: 6px 14px;
        background: $primary-light;
        color: $primary-color;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.2s ease;
        
        &:active {
          transform: scale(0.95);
        }

        &.active {
          background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
        }
      }
    }
  }
}

.agreement {
  padding: 16px 0;
  font-size: 13px;
  color: $text-secondary;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.footer-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 12px 16px;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .commission-display {
    display: flex;
    flex-direction: column;

    .label {
      font-size: 12px;
      color: $text-muted;
    }

    .amount {
      font-size: 22px;
      color: $primary-color;
      font-weight: 700;
    }
  }

  .submit-btn {
    width: 150px;
    background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 16px;
    height: 44px;

    &.disabled {
      opacity: 0.5;
    }
  }
}
</style>
