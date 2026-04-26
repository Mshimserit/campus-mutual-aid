<template>
	<view class="login-container">
		<view class="login-header">
			<image class="login-logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="login-title">校园互助平台</text>
			<text class="login-subtitle">登录以继续使用</text>
		</view>

		<view class="login-form">
			<view class="form-item">
				<view class="input-wrapper">
					<text class="input-icon">👤</text>
					<input 
						class="login-input" 
						v-model="username" 
						placeholder="请输入用户名"
						placeholder-class="input-placeholder"
						@input="onUsernameInput"
						confirm-type="next"
					/>
				</view>
				<text class="error-text" v-if="errors.username">{{ errors.username }}</text>
			</view>

			<view class="form-item">
				<view class="input-wrapper">
					<text class="input-icon">🔒</text>
					<input 
						class="login-input" 
						v-model="password" 
						type="password"
						placeholder="请输入密码"
						placeholder-class="input-placeholder"
						@input="onPasswordInput"
						@confirm="handleLogin"
					/>
				</view>
				<text class="error-text" v-if="errors.password">{{ errors.password }}</text>
			</view>

			<text class="login-error" v-if="loginError">{{ loginError }}</text>

			<button class="login-btn" :class="{ 'btn-disabled': isLoading }" @click="handleLogin" :disabled="isLoading">
				<text v-if="!isLoading">登录</text>
				<text v-else>登录中...</text>
			</button>

			<view class="test-accounts">
				<text class="test-title">测试账号：</text>
				<view class="account-item" @click="fillTestAccount('student')">
					<text class="account-label">学生账号: student / 123456</text>
				</view>
				<view class="account-item" @click="fillTestAccount('runner')">
					<text class="account-label">骑手账号: runner / 123456</text>
				</view>
				<view class="account-item" @click="fillTestAccount('admin')">
					<text class="account-label">管理账号: admin / admin123</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { useUserStore } from '@/stores/user-store'

export default {
	data() {
		return {
			username: '',
			password: '',
			errors: {
				username: '',
				password: ''
			},
			isLoading: false
		}
	},
	computed: {
		loginError() {
			return this.userStore.loginError
		}
	},
	methods: {
		onUsernameInput() {
			this.errors.username = ''
			this.userStore.clearError()
		},
		onPasswordInput() {
			this.errors.password = ''
			this.userStore.clearError()
		},
		fillTestAccount(type) {
			const accounts = {
				student: { username: 'student', password: '123456' },
				runner: { username: 'runner', password: '123456' },
				admin: { username: 'admin', password: 'admin123' }
			}
			const account = accounts[type]
			if (account) {
				this.username = account.username
				this.password = account.password
				this.errors.username = ''
				this.errors.password = ''
				this.userStore.clearError()
			}
		},
		validateForm() {
			let isValid = true
			this.errors = { username: '', password: '' }

			if (!this.username.trim()) {
				this.errors.username = '请输入用户名'
				isValid = false
			}

			if (!this.password) {
				this.errors.password = '请输入密码'
				isValid = false
			} else if (this.password.length < 6) {
				this.errors.password = '密码长度不能少于6位'
				isValid = false
			}

			return isValid
		},
		async handleLogin() {
			if (!this.validateForm()) {
				return
			}

			this.isLoading = true

			try {
				const success = await this.userStore.login(this.username.trim(), this.password)
				
				if (success) {
					uni.showToast({
						title: '登录成功',
						icon: 'success',
						duration: 1500
					})

					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/index/index'
						})
					}, 1500)
				} else {
					uni.showToast({
						title: this.loginError || '登录失败',
						icon: 'none',
						duration: 2000
					})
				}
			} catch (error) {
				console.error('登录失败:', error)
				uni.showToast({
					title: '登录失败，请重试',
					icon: 'error',
					duration: 2000
				})
			} finally {
				this.isLoading = false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.login-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 0 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.login-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 80rpx;

	.login-logo {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		margin-bottom: 30rpx;
		background-color: #ffffff;
	}

	.login-title {
		font-size: 48rpx;
		font-weight: bold;
		color: #ffffff;
		margin-bottom: 16rpx;
	}

	.login-subtitle {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
	}
}

.login-form {
	width: 100%;
	max-width: 600rpx;
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 60rpx 40rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);

	.form-item {
		margin-bottom: 30rpx;

		.input-wrapper {
			display: flex;
			align-items: center;
			background-color: #f5f5f5;
			border-radius: 12rpx;
			padding: 0 24rpx;
			height: 88rpx;
			border: 2rpx solid transparent;
			transition: all 0.3s;

			&:focus-within {
				border-color: #1890ff;
				background-color: #ffffff;
			}

			.input-icon {
				font-size: 36rpx;
				margin-right: 20rpx;
			}

			.login-input {
				flex: 1;
				font-size: 32rpx;
				color: #333333;
			}

			.input-placeholder {
				color: #999999;
			}
		}

		.error-text {
			display: block;
			font-size: 24rpx;
			color: #ff4d4f;
			margin-top: 12rpx;
			padding-left: 24rpx;
		}
	}

	.login-error {
		display: block;
		font-size: 26rpx;
		color: #ff4d4f;
		text-align: center;
		margin-bottom: 30rpx;
		padding: 16rpx;
		background-color: #fff1f0;
		border-radius: 8rpx;
	}

	.login-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #ffffff;
		font-size: 32rpx;
		font-weight: bold;
		border-radius: 12rpx;
		border: none;
		margin-bottom: 40rpx;

		&::after {
			border: none;
		}

		&.btn-disabled {
			opacity: 0.6;
		}
	}

	.test-accounts {
		margin-top: 40rpx;
		padding-top: 40rpx;
		border-top: 1rpx solid #e8e8e8;

		.test-title {
			display: block;
			font-size: 26rpx;
			color: #666666;
			margin-bottom: 20rpx;
			text-align: center;
		}

		.account-item {
			padding: 16rpx 24rpx;
			margin-bottom: 12rpx;
			background-color: #f9f9f9;
			border-radius: 8rpx;
			border: 1rpx solid #e8e8e8;

			.account-label {
				font-size: 24rpx;
				color: #1890ff;
			}

			&:active {
				background-color: #e6f7ff;
			}
		}
	}
}
</style>
