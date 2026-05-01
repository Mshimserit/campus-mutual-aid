export const ROUTES = {
  login: '/pages/login/login',
  index: '/pages/index/index',
  mutualList: '/pages/mutual/list/list',
  post: '/pages/post/post',
  message: '/pages/message/message',
  profile: '/pages/profile/index/index',

  mutualDetail: '/pagesSub/mutual/detail/detail',
  mutualPublish: '/pagesSub/mutual/publish/publish',
  mutualPayment: '/pagesSub/mutual/payment/payment',
  mutualAuth: '/pagesSub/mutual/auth/auth',

  postEditor: '/pagesSub/post/editor/editor',
  postDetail: '/pagesSub/post/detail/detail',

  profileCenter: '/pagesSub/profile/center/center',
  profileWallet: '/pagesSub/profile/wallet/wallet',
  profileWithdraw: '/pagesSub/profile/wallet/withdraw',
  profileMyPosts: '/pagesSub/profile/my-posts/my-posts',
  profileMyComments: '/pagesSub/profile/my-comments/my-comments',
  profileMyWatch: '/pagesSub/profile/my-watch/my-watch',
  profileMyFavorites: '/pagesSub/profile/my-favorites/my-favorites',
  profileCustomerService: '/pagesSub/profile/service/customer-service',
  profileHelpCenter: '/pagesSub/profile/service/help-center',
  profileAppeal: '/pagesSub/profile/service/appeal',
  profileFeedback: '/pagesSub/profile/service/feedback',
  profileBusiness: '/pagesSub/profile/settings/business',
  profileCreateCircle: '/pagesSub/profile/settings/create-circle',
  profileUserAgreement: '/pagesSub/profile/settings/user-agreement',
  profilePrivacyPolicy: '/pagesSub/profile/settings/privacy-policy',

  search: '/pagesSub/common/search/search',
  hot: '/pagesSub/common/hot/hot'
}

export function navigateTo(path, params = {}) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  const fullUrl = query ? `${path}?${query}` : path
  uni.navigateTo({ url: fullUrl })
}

export function redirectTo(path, params = {}) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  const fullUrl = query ? `${path}?${query}` : path
  uni.redirectTo({ url: fullUrl })
}

export function reLaunchTo(path) {
  uni.reLaunch({ url: path })
}

export function switchTabTo(path) {
  uni.switchTab({ url: path })
}

export default ROUTES