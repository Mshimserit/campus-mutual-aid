const fs = require('fs')
const path = require('path')

const STATIC_DIR = path.join(__dirname, 'static')
const MAX_IMAGE_SIZE_KB = 200

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']

function scanImages(dir) {
  const results = []
  
  if (!fs.existsSync(dir)) {
    console.log('[ImageOptimizer] Directory not found:', dir)
    return results
  }

  const items = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    
    if (item.isDirectory()) {
      results.push(...scanImages(fullPath))
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase()
      if (IMAGE_EXTENSIONS.includes(ext)) {
        const stats = fs.statSync(fullPath)
        const sizeKB = Math.round(stats.size / 1024)
        results.push({
          path: fullPath,
          relativePath: path.relative(__dirname, fullPath),
          name: item.name,
          size: stats.size,
          sizeKB,
          extension: ext,
          needsOptimization: sizeKB > MAX_IMAGE_SIZE_KB
        })
      }
    }
  }
  
  return results
}

function generateReport(images) {
  const totalSize = images.reduce((sum, img) => sum + img.size, 0)
  const oversized = images.filter(img => img.needsOptimization)
  
  const report = {
    total: images.length,
    totalSizeKB: Math.round(totalSize / 1024),
    oversized: oversized.length,
    oversizedImages: oversized.map(img => ({
      path: img.relativePath,
      sizeKB: img.sizeKB
    })),
    recommendations: []
  }

  for (const img of oversized) {
    if (img.extension === '.png') {
      report.recommendations.push({
        file: img.relativePath,
        action: '转换为 WebP 格式或使用 TinyPNG 压缩',
        currentSize: `${img.sizeKB}KB`,
        estimatedSavings: `~${Math.round(img.sizeKB * 0.6)}KB`
      })
    } else if (img.extension === '.jpg' || img.extension === '.jpeg') {
      report.recommendations.push({
        file: img.relativePath,
        action: '降低 JPEG 质量至 80% 或转换为 WebP',
        currentSize: `${img.sizeKB}KB`,
        estimatedSavings: `~${Math.round(img.sizeKB * 0.4)}KB`
      })
    } else {
      report.recommendations.push({
        file: img.relativePath,
        action: '考虑转换为 WebP 格式',
        currentSize: `${img.sizeKB}KB`,
        estimatedSavings: `~${Math.round(img.sizeKB * 0.5)}KB`
      })
    }
  }

  return report
}

function main() {
  console.log('=== 图片资源优化分析 ===\n')
  
  const images = scanImages(STATIC_DIR)
  
  if (images.length === 0) {
    console.log('未找到图片资源')
    return
  }

  const report = generateReport(images)
  
  console.log(`图片总数: ${report.total}`)
  console.log(`总大小: ${report.totalSizeKB}KB`)
  console.log(`超过 ${MAX_IMAGE_SIZE_KB}KB 的图片: ${report.oversized} 个\n`)

  if (report.recommendations.length > 0) {
    console.log('--- 优化建议 ---')
    for (const rec of report.recommendations) {
      console.log(`\n📄 ${rec.file}`)
      console.log(`   当前大小: ${rec.currentSize}`)
      console.log(`   建议: ${rec.action}`)
      console.log(`   预计节省: ${rec.estimatedSavings}`)
    }
  } else {
    console.log('✅ 所有图片大小均在合理范围内')
  }

  console.log('\n--- 通用优化建议 ---')
  console.log('1. 使用 WebP 格式替代 PNG/JPG（体积减少 25-35%）')
  console.log('2. 使用 CDN 加速静态资源')
  console.log('3. 图片使用 lazy-image 组件懒加载')
  console.log('4. 根据显示尺寸提供合适分辨率的图片')
  console.log('5. 使用 CSS sprite 合并小图标')
}

main()