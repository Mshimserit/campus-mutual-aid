<script>
	import { useUserStore } from '@/stores/user-store'
	import { canAccessPage, ROLES } from '@/utils/rbac'
	
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
		
		if (userStore.isLoggedIn && !publicPages.includes(targetPage)) {
			const userRole = userStore.userRole || ROLES.STUDENT
			if (!canAccessPage(userRole, targetPage)) {
				uni.showToast({
					title: '您没有访问权限',
					icon: 'none'
				})
				return false
			}
		}
		
		return true
	}
	
	function extractPageName(url) {
		const path = url.split('?')[0]
		let normalizedPath = path.startsWith('/') ? path.slice(1) : path
		normalizedPath = normalizedPath.replace(/^pagesSub\//, 'pages/')
		return normalizedPath
	}
</script>

<style lang="scss">
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
		@media (min-width: 768px) {
			padding: 32rpx;
			max-width: 960rpx;
			margin: 0 auto;
		}
	}

	.card {
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 28rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		@media (min-width: 768px) {
			padding: 36rpx;
			border-radius: 32rpx;
		}
	}

	.flex { display: flex; }
	.flex-column { flex-direction: column; }
	.flex-center { align-items: center; justify-content: center; }
	.flex-between { justify-content: space-between; }
	.flex-wrap { flex-wrap: wrap; }

	.text-primary { color: #1890ff; }
	.text-success { color: #52c41a; }
	.text-warning { color: #faad14; }
	.text-error { color: #ff4d4f; }
	.text-secondary { color: #666666; }
	.text-placeholder { color: #999999; }

	.mt-8 { margin-top: 8rpx; }
	.mt-16 { margin-top: 16rpx; }
	.mt-24 { margin-top: 24rpx; }
	.mt-32 { margin-top: 32rpx; }
	.mb-8 { margin-bottom: 8rpx; }
	.mb-16 { margin-bottom: 16rpx; }
	.mb-24 { margin-bottom: 24rpx; }
	.mb-32 { margin-bottom: 32rpx; }

	@media (min-width: 768px) {
		.tablet-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 24rpx;
		}
		.tablet-sidebar {
			display: flex;
			.sidebar-main {
				flex: 1;
			}
			.sidebar-aside {
				width: 300rpx;
				margin-left: 24rpx;
			}
		}
	}

	@media (orientation: landscape) and (max-width: 896px) {
		.landscape-compact {
			padding-top: 16rpx;
			padding-bottom: 16rpx;
		}
		.landscape-row {
			flex-direction: row !important;
			align-items: flex-start !important;
		}
	}

	/* #endif */
</style>
