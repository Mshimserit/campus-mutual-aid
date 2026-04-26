<template>
  <view class="page">
    <uni-forms ref="formRef" :model="formData" :rules="rules">
      <uni-forms-item label="圈子名称" name="name" required>
        <uni-easyinput v-model="formData.name" placeholder="请输入圈子名称" />
      </uni-forms-item>
      <uni-forms-item label="圈子分类" name="category" required>
        <uni-data-select v-model="formData.category" :localdata="categoryOptions" placeholder="请选择分类" />
      </uni-forms-item>
      <uni-forms-item label="圈子介绍" name="intro" required>
        <uni-easyinput v-model="formData.intro" type="textarea" placeholder="请输入圈子介绍" :maxlength="200" />
      </uni-forms-item>
      <uni-forms-item label="认证材料">
        <uni-file-picker v-model="formData.materials" fileMediatype="image" :limit="3" mode="grid" />
      </uni-forms-item>
    </uni-forms>
    <view class="submit-wrapper">
      <button type="primary" @click="submit">提交申请</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
const formRef = ref(null)
const formData = reactive({ name: '', category: '', intro: '', materials: [] })
const categoryOptions = [{ value: 'academic', text: '学术' }, { value: 'life', text: '生活' }, { value: 'hobby', text: '兴趣' }]
const rules = { name: { rules: [{ required: true, errorMessage: '请输入圈子名称' }] }, category: { rules: [{ required: true, errorMessage: '请选择分类' }] }, intro: { rules: [{ required: true, errorMessage: '请输入介绍' }] } }
function submit() {
  formRef.value.validate().then(() => { uni.showToast({ title: '申请已提交', icon: 'success' }); setTimeout(() => uni.navigateBack(), 1500) }).catch(() => { uni.showToast({ title: '请完整填写', icon: 'none' }) })
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #f5f5f5; padding: 15px; }
.submit-wrapper { margin-top: 30px; }
</style>
