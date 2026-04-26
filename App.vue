<script>
	import { useUserStore } from '@/stores/user-store'
	
	const publicPages = ['pages/login/login']
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.checkLoginStatus()
			this.setupRouteGuards()
		},
		onShow: function() {
			console.log('App Show')
			this.checkLoginStatus()
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			checkLoginStatus() {
				const userStore = useUserStore()
				
				if (!userStore.isLoggedIn) {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
			},
			setupRouteGuards() {
				const userStore = useUserStore()
				
				uni.addInterceptor('navigateTo', {
					invoke(e) {
						return handleNavigation(e.url, userStore)
					}
				})
				
				uni.addInterceptor('redirectTo', {
					invoke(e) {
						return handleNavigation(e.url, userStore)
					}
				})
				
				uni.addInterceptor('reLaunch', {
					invoke(e) {
						return handleNavigation(e.url, userStore)
					}
				})
				
				uni.addInterceptor('switchTab', {
					invoke(e) {
						return handleNavigation(e.url, userStore)
					}
				})
			}
		}
	}
	
	function handleNavigation(url, userStore) {
		const targetPage = extractPageName(url)
		
		if (!userStore.isLoggedIn && !publicPages.includes(targetPage)) {
			uni.redirectTo({
				url: '/pages/login/login'
			})
			return false
		}
		
		if (userStore.isLoggedIn && targetPage === 'pages/login/login') {
			uni.redirectTo({
				url: '/pages/index/index'
			})
			return false
		}
		
		return true
	}
	
	function extractPageName(url) {
		const path = url.split('?')[0]
		const normalizedPath = path.startsWith('/') ? path.slice(1) : path
		return normalizedPath
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	
	page {
		background-color: #f5f5f5;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 28rpx;
		color: #333333;
		line-height: 1.5;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	view, text, scroll-view, swiper, button, input, textarea {
		box-sizing: border-box;
	}

	button::after {
		border: none;
	}

	.container {
		padding: 24rpx;
	}

	.card {
		background-color: #ffffff;
		border-radius: 12rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.flex {
		display: flex;
	}

	.flex-column {
		flex-direction: column;
	}

	.flex-center {
		align-items: center;
		justify-content: center;
	}

	.flex-between {
		justify-content: space-between;
	}

	.flex-wrap {
		flex-wrap: wrap;
	}

	.text-primary {
		color: #1890ff;
	}

	.text-success {
		color: #52c41a;
	}

	.text-warning {
		color: #faad14;
	}

	.text-error {
		color: #ff4d4f;
	}

	.text-secondary {
		color: #666666;
	}

	.text-placeholder {
		color: #999999;
	}

	.mt-8 { margin-top: 8rpx; }
	.mt-16 { margin-top: 16rpx; }
	.mt-24 { margin-top: 24rpx; }
	.mt-32 { margin-top: 32rpx; }
	
	.mb-8 { margin-bottom: 8rpx; }
	.mb-16 { margin-bottom: 16rpx; }
	.mb-24 { margin-bottom: 24rpx; }
	.mb-32 { margin-bottom: 32rpx; }

	/* #endif */
</style>
