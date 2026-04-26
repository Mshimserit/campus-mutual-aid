<template>
  <view class="page">
    <view class="balance-section">
      <view class="balance-header">
        <text class="label">可提现余额</text>
        <button size="mini" type="primary" @click="showWithdraw">提现</button>
      </view>
      <text class="balance-amount">¥{{ balance.toFixed(2) }}</text>
    </view>

    <view class="income-stats">
      <view class="stat-item">
        <text class="stat-value">¥{{ weekIncome.toFixed(2) }}</text>
        <text class="stat-label">本周收入</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">¥{{ monthIncome.toFixed(2) }}</text>
        <text class="stat-label">本月收入</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">¥{{ totalIncome.toFixed(2) }}</text>
        <text class="stat-label">总收入</text>
      </view>
    </view>

    <view class="service-entry">
      <view class="service-item" @click="goToService">
        <uni-icons type="staff" size="20" color="#1890ff"></uni-icons>
        <text>跑腿客服</text>
      </view>
    </view>

    <view class="bill-section">
      <view class="bill-tabs">
        <view
          :class="['tab-item', { active: currentTab === 'bill' }]"
          @click="currentTab = 'bill'"
        >
          <text>账单明细</text>
        </view>
        <view
          :class="['tab-item', { active: currentTab === 'withdraw' }]"
          @click="currentTab = 'withdraw'"
        >
          <text>提现记录</text>
        </view>
      </view>

      <view v-if="currentTab === 'bill'" class="filter-section">
        <view class="filter-tabs">
          <view
            v-for="filter in billFilters"
            :key="filter.value"
            :class="['filter-item', { active: currentFilter === filter.value }]"
            @click="currentFilter = filter.value"
          >
            {{ filter.label }}
          </view>
        </view>
      </view>

      <view class="bill-list">
        <view v-if="displayedBills.length === 0" class="empty-wrapper">
          <uni-load-more status="nomore" content="暂无记录" />
        </view>
        <view v-else>
          <view
            v-for="bill in displayedBills"
            :key="bill.id"
            class="bill-item"
            :class="{ income: bill.type === 'income', expense: bill.type === 'expense' }"
          >
            <view class="bill-info">
              <text class="bill-title">{{ bill.title }}</text>
              <text class="bill-time">{{ bill.time }}</text>
            </view>
            <view class="bill-amount">
              <text :class="['amount', bill.type]">
                {{ bill.type === 'income' ? '+' : '-' }}{{ bill.amount.toFixed(2) }}
              </text>
              <text class="balance-text">余额{{ bill.balanceAfter.toFixed(2) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <uni-popup ref="withdrawPopup" type="bottom">
      <view class="withdraw-popup">
        <view class="popup-header">
          <text class="popup-title">提现</text>
          <uni-icons type="close" size="20" @click="closeWithdraw"></uni-icons>
        </view>
        <view class="popup-content">
          <uni-easyinput
            v-model="withdrawAmount"
            type="digit"
            placeholder="请输入提现金额"
            prefix-text="¥"
          />
          <view class="withdraw-tip">
            <text>最低提现金额：¥1.00，每日限提现3次</text>
          </view>
          <button type="primary" @click="confirmWithdraw" :disabled="!canWithdraw">
            确认提现
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWalletStore } from '@/stores/wallet-store'
import { walletService } from '@/services/wallet-service'

const walletStore = useWalletStore()
const withdrawPopup = ref(null)
const withdrawAmount = ref('')
const currentTab = ref('bill')

const balance = ref(0)
const weekIncome = ref(0)
const monthIncome = ref(0)
const totalIncome = ref(0)
const bills = ref([])
const withdrawRecords = ref([])
const currentFilter = ref('all')

const billFilters = [
  { label: '全部', value: 'all' },
  { label: '收入', value: 'income' },
  { label: '支出', value: 'expense' }
]

const filteredBills = computed(() => {
  if (currentFilter.value === 'all') return bills.value
  return bills.value.filter(b => b.type === currentFilter.value)
})

const displayedBills = computed(() => {
  return currentTab.value === 'bill' ? filteredBills.value : withdrawRecords.value
})

const canWithdraw = computed(() => {
  const amount = parseFloat(withdrawAmount.value)
  return amount >= 1 && amount <= balance.value
})

onMounted(() => {
  loadWalletData()
})

async function loadWalletData() {
  try {
    balance.value = walletStore.balance
    weekIncome.value = walletStore.weekIncome
    monthIncome.value = walletStore.monthIncome
    totalIncome.value = walletStore.totalIncome
    bills.value = await walletService.getBills()
    withdrawRecords.value = await walletService.getWithdrawRecords()
  } catch (e) {
    console.error('Failed to load wallet data')
  }
}

function showWithdraw() {
  uni.navigateTo({ url: '/pages/profile/wallet/withdraw' })
}

function closeWithdraw() {
  withdrawPopup.value.close()
  withdrawAmount.value = ''
}

async function confirmWithdraw() {
  if (!canWithdraw.value) {
    uni.showToast({ title: '提现金额不符合要求', icon: 'none' })
    return
  }

  try {
    await walletService.withdraw(parseFloat(withdrawAmount.value))
    uni.showToast({ title: '提现申请已提交', icon: 'success' })
    closeWithdraw()
    loadWalletData()
  } catch (e) {
    uni.showToast({ title: '提现失败', icon: 'none' })
  }
}

function goToService() {
  uni.showToast({ title: '联系客服', icon: 'none' })
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
  padding-bottom: 20px;
}

.balance-section {
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  padding: 36px 16px;
  color: #FFFFFF;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -10%;
    width: 200px;
    height: 200px;
    background: rgba(255,255,255,0.1);
    border-radius: 50%;
  }

  .balance-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .label {
      font-size: 14px;
      opacity: 0.9;
      font-weight: 500;
    }
    
    button {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: #FFFFFF;
      border-radius: 6px;
      font-weight: 600;
    }
  }

  .balance-amount {
    font-size: 40px;
    font-weight: 700;
  }
}

.income-stats {
  display: flex;
  background: #FFFFFF;
  padding: 18px;
  box-shadow: $card-shadow;

  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .stat-value {
      font-size: 16px;
      color: $text-primary;
      font-weight: 700;
    }

    .stat-label {
      font-size: 12px;
      color: $text-muted;
      margin-top: 5px;
      font-weight: 500;
    }
  }
}

.service-entry {
  background: #FFFFFF;
  margin-top: 8px;
  padding: 16px;
  box-shadow: $card-shadow;

  .service-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: $primary-color;
    font-size: 14px;
    font-weight: 600;
  }
}

.bill-section {
  background: #FFFFFF;
  margin-top: 8px;
  box-shadow: $card-shadow;

  .bill-tabs {
    display: flex;
    border-bottom: 1px solid #F3F4F6;

    .tab-item {
      flex: 1;
      text-align: center;
      padding: 14px 0;
      font-size: 14px;
      color: $text-secondary;
      position: relative;
      font-weight: 500;

      &.active {
        color: $primary-color;
        font-weight: 600;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 3px;
          background: $primary-color;
          border-radius: 2px;
        }
      }
    }
  }

  .filter-section {
    padding: 12px 16px;
    border-bottom: 1px solid #F3F4F6;

    .filter-tabs {
      display: flex;
      gap: 10px;

      .filter-item {
        padding: 6px 16px;
        font-size: 13px;
        color: $text-secondary;
        background: $bg-color;
        border-radius: 16px;
        font-weight: 500;
        transition: all 0.2s ease;

        &.active {
          color: #FFFFFF;
          background: $primary-color;
        }
      }
    }
  }

  .bill-list {
    .bill-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #F9FAFB;
      transition: all 0.2s ease;
      
      &:active {
        background: $bg-color;
      }

      .bill-info {
        .bill-title {
          font-size: 14px;
          color: $text-primary;
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .bill-time {
          font-size: 12px;
          color: $text-muted;
        }
      }

      .bill-amount {
        text-align: right;

        .amount {
          font-size: 16px;
          font-weight: 700;
          display: block;
          margin-bottom: 4px;

          &.income { color: $success-color; }
          &.expense { color: $primary-color; }
        }

        .balance-text {
          font-size: 12px;
          color: $text-muted;
        }
      }
    }
  }
}

.empty-wrapper {
  padding: 40px 0;
}

.withdraw-popup {
  background: #FFFFFF;
  border-radius: 16px 16px 0 0;
  padding: 24px 20px;

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .popup-title {
      font-size: 18px;
      font-weight: 700;
      color: $text-primary;
    }
  }

  .popup-content {
    .withdraw-tip {
      font-size: 12px;
      color: $text-muted;
      margin: 12px 0 20px;
    }
    
    button {
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      border: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 16px;
      height: 48px;
    }
  }
}
</style>
