<template>
	<view class="custom-tabbar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
		<view
			v-for="(item, index) in tabList"
			:key="index"
			class="tabbar-item"
			:class="{ active: current === index }"
			@click="switchTab(index)"
		>
			<view class="tabbar-icon">
				<!-- 首页 -->
				<template v-if="item.pagePath === '/pages/index/index'">
					<VuHome v-if="current === index" :size="24" :color="selectedColor" />
					<VuHome v-else :size="24" :color="color" />
				</template>
				<!-- 互助 -->
				<template v-else-if="item.pagePath === '/pages/mutual/list/list'">
					<VuHandshake v-if="current === index" :size="24" :color="selectedColor" />
					<VuHandshake v-else :size="24" :color="color" />
				</template>
				<!-- 发布 -->
				<template v-else-if="item.pagePath === '/pages/post/post'">
					<VuSquarePlus v-if="current === index" :size="24" :color="selectedColor" />
					<VuSquarePlus v-else :size="24" :color="color" />
				</template>
				<!-- 消息 -->
				<template v-else-if="item.pagePath === '/pages/message/message'">
					<VuBell v-if="current === index" :size="24" :color="selectedColor" />
					<VuBell v-else :size="24" :color="color" />
				</template>
				<!-- 我的 -->
				<template v-else-if="item.pagePath === '/pages/profile/index/index'">
					<VuUser v-if="current === index" :size="24" :color="selectedColor" />
					<VuUser v-else :size="24" :color="color" />
				</template>
			</view>
			<text
				class="tabbar-text"
				:style="{ color: current === index ? selectedColor : color }"
			>
				{{ item.text }}
			</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
	VuHome,
	VuHandshake,
	VuSquarePlus,
	VuBell,
	VuUser
} from 'vu-icons/uniapp'

const current = ref(0)
const color = '#999999'
const selectedColor = '#1890ff'

const systemInfo = uni.getSystemInfoSync()
const safeAreaBottom = computed(() => {
	return systemInfo.safeAreaInsets?.bottom || 0
})

const tabList = ref([
	{
		pagePath: '/pages/index/index',
		text: '首页'
	},
	{
		pagePath: '/pages/mutual/list/list',
		text: '互助'
	},
	{
		pagePath: '/pages/post/post',
		text: '发布'
	},
	{
		pagePath: '/pages/message/message',
		text: '消息'
	},
	{
		pagePath: '/pages/profile/index/index',
		text: '我的'
	}
])

function switchTab(index) {
	if (index === current.value) return
	const item = tabList.value[index]
	uni.switchTab({
		url: item.pagePath
	})
}
</script>

<style lang="scss" scoped>
.custom-tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	height: 50px;
	background-color: #ffffff;
	border-top: 1px solid #e8e8e8;
	z-index: 999;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.tabbar-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex: 1;
	height: 50px;
	transition: all 0.3s ease;
}

.tabbar-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 2px;
}

.tabbar-text {
	font-size: 10px;
	line-height: 1;
	transition: color 0.3s ease;
}

.tabbar-item.active {
	.tabbar-text {
		font-weight: 500;
	}
}
</style>
