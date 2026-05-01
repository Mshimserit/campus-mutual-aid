<template>
  <view class="page">
    <uni-forms ref="formRef" :model="formData" :rules="rules">
      <uni-forms-item label="申诉原因" name="reason" required>
        <uni-easyinput v-model="formData.reason" placeholder="请输入申诉原因" />
      </uni-forms-item>
      <uni-forms-item label="详细描述" name="description" required>
        <uni-easyinput v-model="formData.description" type="textarea" placeholder="请详细描述申诉理由" :maxlength="500" />
      </uni-forms-item>
      <uni-forms-item label="上传截图">
        <uni-file-picker v-model="formData.images" fileMediatype="image" :limit="3" mode="grid" />
      </uni-forms-item>
    </uni-forms>
    <view class="submit-wrapper">
      <button type="primary" @click="submit">提交申诉</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formRef = ref(null)
const formData = reactive({ reason: '', description: '', images: [] })
const rules = {
  reason: { rules: [{ required: true, errorMessage: '请输入申诉原因' }] },
  description: { rules: [{ required: true, errorMessage: '请输入详细描述' }] }
}

function submit() {
  formRef.value.validate().then(() => {
    uni.showToast({ title: '申诉已提交', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  }).catch(() => {
    uni.showToast({ title: '请完整填写所有必填项', icon: 'none' })
  })
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #f5f5f5; padding: 15px; }
.submit-wrapper { margin-top: 30px; }
</style>
