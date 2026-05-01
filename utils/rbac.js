export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
}

export const PERMISSIONS = {
  VIEW_HOME: 'view:home',
  VIEW_MUTUAL: 'view:mutual',
  VIEW_PROFILE: 'view:profile',
  VIEW_MESSAGES: 'view:messages',
  
  CREATE_ORDER: 'create:order',
  ACCEPT_ORDER: 'accept:order',
  CANCEL_ORDER: 'cancel:order',
  COMPLETE_ORDER: 'complete:order',
  DISPUTE_ORDER: 'dispute:order',
  
  MANAGE_PROFILE: 'manage:profile',
  MANAGE_WALLET: 'manage:wallet',
  WITHDRAW: 'withdraw',
  
  ADMIN_DASHBOARD: 'admin:dashboard',
  ADMIN_USERS: 'admin:users',
  ADMIN_ORDERS: 'admin:orders',
  ADMIN_FINANCE: 'admin:finance',
  ADMIN_SETTINGS: 'admin:settings'
}

export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: [
    PERMISSIONS.VIEW_HOME,
    PERMISSIONS.VIEW_MUTUAL,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.VIEW_MESSAGES,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.ACCEPT_ORDER,
    PERMISSIONS.CANCEL_ORDER,
    PERMISSIONS.COMPLETE_ORDER,
    PERMISSIONS.DISPUTE_ORDER,
    PERMISSIONS.MANAGE_PROFILE,
    PERMISSIONS.MANAGE_WALLET,
    PERMISSIONS.WITHDRAW
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_HOME,
    PERMISSIONS.VIEW_MUTUAL,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.VIEW_MESSAGES,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.ACCEPT_ORDER,
    PERMISSIONS.CANCEL_ORDER,
    PERMISSIONS.COMPLETE_ORDER,
    PERMISSIONS.DISPUTE_ORDER,
    PERMISSIONS.MANAGE_PROFILE,
    PERMISSIONS.MANAGE_WALLET,
    PERMISSIONS.WITHDRAW,
    PERMISSIONS.ADMIN_DASHBOARD,
    PERMISSIONS.ADMIN_USERS,
    PERMISSIONS.ADMIN_ORDERS,
    PERMISSIONS.ADMIN_FINANCE
  ],
  [ROLES.SUPER_ADMIN]: [
    ...Object.values(PERMISSIONS)
  ]
}

export const PROTECTED_PAGES = {
  'pages/mutual/list/list': [PERMISSIONS.VIEW_MUTUAL],
  'pages/mutual/detail/detail': [PERMISSIONS.VIEW_MUTUAL],
  'pages/mutual/publish/publish': [PERMISSIONS.CREATE_ORDER],
  'pages/mutual/payment/payment': [PERMISSIONS.CREATE_ORDER],
  'pages/mutual/auth/auth': [PERMISSIONS.ACCEPT_ORDER],
  'pages/profile/index/index': [PERMISSIONS.VIEW_PROFILE],
  'pages/profile/wallet/wallet': [PERMISSIONS.MANAGE_WALLET],
  'pages/profile/wallet/withdraw': [PERMISSIONS.WITHDRAW],
  'pages/message/message': [PERMISSIONS.VIEW_MESSAGES],
  'pages/post/post': [PERMISSIONS.CREATE_ORDER]
}

export function hasPermission(role, permission) {
  const rolePermissions = ROLE_PERMISSIONS[role] || []
  return rolePermissions.includes(permission)
}

export function hasAllPermissions(role, permissions) {
  return permissions.every(p => hasPermission(role, p))
}

export function hasAnyPermission(role, permissions) {
  return permissions.some(p => hasPermission(role, p))
}

export function getPermissionsByRole(role) {
  return ROLE_PERMISSIONS[role] || []
}

export function canAccessPage(role, pagePath) {
  const requiredPermissions = PROTECTED_PAGES[pagePath]
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true
  }
  return hasAnyPermission(role, requiredPermissions)
}

export function isAdmin(role) {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN
}

export function isStudent(role) {
  return role === ROLES.STUDENT
}
