<template>
  <view class="page">
    <uni-forms ref="formRef" :model="formData" :rules="rules">
      <uni-forms-item label="反馈类型" name="type" required>
        <uni-data-select v-model="formData.type" :localdata="typeOptions" placeholder="请选择反馈类型" />
      </uni-forms-item>
      <uni-forms-item label="反馈内容" name="content" required>
        <uni-easyinput v-model="formData.content" type="textarea" placeholder="请输入反馈内容" :maxlength="500" />
      </uni-forms-item>
      <uni-forms-item label="上传图片">
        <uni-file-picker v-model="formData.images" fileMediatype="image" :limit="3" mode="grid" />
      </uni-forms-item>
    </uni-forms>
    <view class="submit-wrapper">
      <button type="primary" @click="submit">提交反馈</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formRef = ref(null)
const formData = reactive({ type: '', content: '', images: [] })
const typeOptions = [
  { value: 'bug', text: '功能异常' },
  { value: 'suggest', text: '功能建议' },
  { value: 'other', text: '其他' }
]
const rules = {
  type: { rules: [{ required: true, errorMessage: '请选择反馈类型' }] },
  content: { rules: [{ required: true, errorMessage: '请输入反馈内容' }] }
}

function submit() {
  formRef.value.validate().then(() => {
    uni.showToast({ title: '反馈已提交', icon: 'success' })
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
