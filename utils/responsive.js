import { ref, onMounted, onUnmounted } from 'vue'

export const BREAKPOINTS = {
  XS: 320,
  SM: 375,
  MD: 414,
  LG: 768,
  XL: 1024
}

export const BREAKPOINT_NAMES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
}

const screenWidth = ref(375)
const screenHeight = ref(667)
const orientation = ref('portrait')
const currentBreakpoint = ref('sm')
const isTablet = ref(false)
const isLandscape = ref(false)

let resizeCallback = null

export function useResponsive() {
  function init() {
    getSystemInfo()
    setupResizeListener()
  }

  function getSystemInfo() {
    try {
      const systemInfo = uni.getSystemInfoSync()
      screenWidth.value = systemInfo.windowWidth || systemInfo.screenWidth || 375
      screenHeight.value = systemInfo.windowHeight || systemInfo.screenHeight || 667
      updateBreakpoint()
      updateOrientation()
    } catch (e) {
      console.error('[Responsive] Get system info failed:', e)
    }
  }

  function setupResizeListener() {
    if (resizeCallback) return

    resizeCallback = (res) => {
      screenWidth.value = res.size.windowWidth
      screenHeight.value = res.size.windowHeight
      updateBreakpoint()
      updateOrientation()
    }

    uni.onWindowResize(resizeCallback)
  }

  function updateBreakpoint() {
    const w = screenWidth.value
    if (w >= BREAKPOINTS.XL) {
      currentBreakpoint.value = BREAKPOINT_NAMES.XL
    } else if (w >= BREAKPOINTS.LG) {
      currentBreakpoint.value = BREAKPOINT_NAMES.LG
    } else if (w >= BREAKPOINTS.MD) {
      currentBreakpoint.value = BREAKPOINT_NAMES.MD
    } else if (w >= BREAKPOINTS.SM) {
      currentBreakpoint.value = BREAKPOINT_NAMES.SM
    } else {
      currentBreakpoint.value = BREAKPOINT_NAMES.XS
    }
    isTablet.value = w >= BREAKPOINTS.LG
  }

  function updateOrientation() {
    orientation.value = screenWidth.value >= screenHeight.value ? 'landscape' : 'portrait'
    isLandscape.value = orientation.value === 'landscape'
  }

  function isBreakpoint(name) {
    return currentBreakpoint.value === name
  }

  function isMinBreakpoint(name) {
    const order = [BREAKPOINT_NAMES.XS, BREAKPOINT_NAMES.SM, BREAKPOINT_NAMES.MD, BREAKPOINT_NAMES.LG, BREAKPOINT_NAMES.XL]
    const currentIndex = order.indexOf(currentBreakpoint.value)
    const targetIndex = order.indexOf(name)
    return currentIndex >= targetIndex
  }

  function responsiveValue(values) {
    const bp = currentBreakpoint.value
    if (values[bp] !== undefined) return values[bp]
    const fallbackOrder = [BREAKPOINT_NAMES.SM, BREAKPOINT_NAMES.MD, BREAKPOINT_NAMES.XS, BREAKPOINT_NAMES.LG, BREAKPOINT_NAMES.XL]
    for (const key of fallbackOrder) {
      if (values[key] !== undefined) return values[key]
    }
    return values.default || 0
  }

  function responsiveClass(prefix) {
    return `${prefix}--${currentBreakpoint.value}`
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    if (resizeCallback) {
      uni.offWindowResize(resizeCallback)
      resizeCallback = null
    }
  })

  return {
    screenWidth,
    screenHeight,
    orientation,
    currentBreakpoint,
    isTablet,
    isLandscape,
    isBreakpoint,
    isMinBreakpoint,
    responsiveValue,
    responsiveClass,
    init
  }
}

export function rpx(value) {
  return `${value}rpx`
}

export function pxToRpx(px) {
  const systemInfo = uni.getSystemInfoSync()
  const ratio = 750 / (systemInfo.windowWidth || 375)
  return Math.round(px * ratio)
}

export function rpxToPx(rpxVal) {
  const systemInfo = uni.getSystemInfoSync()
  const ratio = (systemInfo.windowWidth || 375) / 750
  return Math.round(rpxVal * ratio)
}

export default {
  useResponsive,
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  rpx,
  pxToRpx,
  rpxToPx
}