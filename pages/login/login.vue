<template>
	<view class="login-container">
		<view class="login-header">
			<view class="logo-wrapper">
				<image class="login-logo" src="/static/logo.png" mode="aspectFit"></image>
			</view>
			<text class="login-title">校园互助平台</text>
			<text class="login-subtitle">让校园生活更便捷</text>
		</view>

		<view class="login-form">
			<view class="form-title">账号登录</view>

			<view class="form-item">
				<view class="input-wrapper" :class="{ 'input-focus': focusField === 'username' }">
					<uni-icons type="person" size="20" color="#999"></uni-icons>
					<input 
						class="login-input" 
						v-model="username" 
						placeholder="请输入用户名"
						placeholder-class="input-placeholder"
						@input="onUsernameInput"
						@focus="focusField = 'username'"
						@blur="focusField = ''"
						confirm-type="next"
					/>
				</view>
				<text class="error-text" v-if="errors.username">{{ errors.username }}</text>
			</view>

			<view class="form-item">
				<view class="input-wrapper" :class="{ 'input-focus': focusField === 'password' }">
					<uni-icons type="locked" size="20" color="#999"></uni-icons>
					<input 
						class="login-input" 
						v-model="password" 
						type="password"
						placeholder="请输入密码"
						placeholder-class="input-placeholder"
						@input="onPasswordInput"
						@focus="focusField = 'password'"
						@blur="focusField = ''"
						@confirm="handleLogin"
					/>
				</view>
				<text class="error-text" v-if="errors.password">{{ errors.password }}</text>
			</view>

			<text class="login-error" v-if="loginError">{{ loginError }}</text>

			<button class="login-btn" :class="{ 'btn-disabled': isLoading }" @click="handleLogin" :disabled="isLoading" hover-class="btn-hover">
				<text v-if="!isLoading">登录</text>
				<text v-else>登录中...</text>
			</button>

			<view class="demo-account" @click="fillDemoAccount">
				<view class="demo-icon">
					<uni-icons type="lightbulb" size="16" color="#ffffff"></uni-icons>
				</view>
				<text class="demo-text">点击填入演示账号 (demo / 123456)</text>
			</view>
		</view>

		<view class="login-footer">
			<text class="footer-text">登录即表示同意</text>
			<text class="footer-link">《用户协议》</text>
			<text class="footer-text">和</text>
			<text class="footer-link">《隐私政策》</text>
		</view>
	</view>
</template>

<script>
import { useUserStore } from '@/stores/user-store'

export default {
	data() {
		return {
			userStore: useUserStore(),
			username: '',
			password: '',
			errors: {
				username: '',
				password: ''
			},
			isLoading: false,
			focusField: ''
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
		fillDemoAccount() {
			this.username = 'demo'
			this.password = '123456'
			this.errors.username = ''
			this.errors.password = ''
			this.userStore.clearError()
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
					icon: 'none',
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
$primary-color: #1890ff;
$primary-dark: #096dd9;
$primary-light: #e6f7ff;
$text-primary: #1a1a1a;
$text-secondary: #666666;
$text-muted: #999999;
$border-color: #e8e8e8;
$bg-light: #fafafa;

.login-container {
	min-height: 100vh;
	background-color: #f5f7fa;
	padding: 0;
	display: flex;
	flex-direction: column;
}

.login-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 80rpx 40rpx 60rpx;
	background: linear-gradient(180deg, #ffffff 0%, #f5f7fa 100%);

	.logo-wrapper {
		width: 120rpx;
		height: 120rpx;
		border-radius: 24rpx;
		background-color: #ffffff;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 24rpx;

		.login-logo {
			width: 80rpx;
			height: 80rpx;
		}
	}

	.login-title {
		font-size: 44rpx;
		font-weight: bold;
		color: $text-primary;
		margin-bottom: 12rpx;
		letter-spacing: 1rpx;
	}

	.login-subtitle {
		font-size: 26rpx;
		color: $text-muted;
	}
}

.login-form {
	margin: 0 32rpx;
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 48rpx 40rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

	.form-title {
		font-size: 32rpx;
		font-weight: 600;
		color: $text-primary;
		margin-bottom: 40rpx;
		letter-spacing: 0.5rpx;
	}

	.form-item {
		margin-bottom: 28rpx;

		.input-wrapper {
			display: flex;
			align-items: center;
			background-color: $bg-light;
			border-radius: 12rpx;
			padding: 0 24rpx;
			height: 88rpx;
			border: 2rpx solid transparent;
			transition: all 0.2s ease;

			&.input-focus {
				border-color: $primary-color;
				background-color: #ffffff;
				box-shadow: 0 0 0 4rpx rgba(24, 144, 255, 0.1);
			}

			.login-input {
				flex: 1;
				font-size: 30rpx;
				color: $text-primary;
				margin-left: 16rpx;
			}

			.input-placeholder {
				color: $text-muted;
			}
		}

		.error-text {
			display: block;
			font-size: 24rpx;
			color: #ff4d4f;
			margin-top: 12rpx;
			padding-left: 8rpx;
		}
	}

	.login-error {
		display: block;
		font-size: 24rpx;
		color: #ff4d4f;
		text-align: center;
		margin-bottom: 24rpx;
		padding: 12rpx 16rpx;
		background-color: #fff2f0;
		border-radius: 8rpx;
		border: 1rpx solid #ffccc7;
	}

	.login-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
		color: #ffffff;
		font-size: 32rpx;
		font-weight: 600;
		border-radius: 12rpx;
		border: none;
		margin-bottom: 32rpx;
		box-shadow: 0 8rpx 16rpx rgba(24, 144, 255, 0.25);

		&::after {
			border: none;
		}

		&.btn-disabled {
			opacity: 0.6;
			box-shadow: none;
		}
	}

	.btn-hover {
		opacity: 0.9;
		transform: scale(0.98);
	}

	.demo-account {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		padding: 20rpx 24rpx;
		background: linear-gradient(135deg, $primary-light 0%, #f0f5ff 100%);
		border-radius: 12rpx;
		border: 1rpx dashed $primary-color;

		.demo-icon {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		.demo-text {
			font-size: 24rpx;
			color: $primary-dark;
			font-weight: 500;
		}

		&:active {
			opacity: 0.8;
			transform: scale(0.98);
		}
	}
}

.login-footer {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 48rpx 32rpx;
	flex-wrap: wrap;

	.footer-text {
		font-size: 22rpx;
		color: $text-muted;
	}

	.footer-link {
		font-size: 22rpx;
		color: $primary-color;
		padding: 0 4rpx;
	}
}
</style>
