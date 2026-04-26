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
				<component
					:is="current === index ? item.selectedIcon : item.icon"
					:size="24"
					:color="current === index ? selectedColor : color"
				/>
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
	VuPlusSquare,
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
		text: '首页',
		icon: VuHome,
		selectedIcon: VuHome
	},
	{
		pagePath: '/pages/mutual/list/list',
		text: '互助',
		icon: VuHandshake,
		selectedIcon: VuHandshake
	},
	{
		pagePath: '/pages/post/post',
		text: '发布',
		icon: VuPlusSquare,
		selectedIcon: VuPlusSquare
	},
	{
		pagePath: '/pages/message/message',
		text: '消息',
		icon: VuBell,
		selectedIcon: VuBell
	},
	{
		pagePath: '/pages/profile/index/index',
		text: '我的',
		icon: VuUser,
		selectedIcon: VuUser
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
