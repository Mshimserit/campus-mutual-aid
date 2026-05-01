import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('uni_modules')) {
            return 'vendor-uni'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          if (id.includes('stores')) {
            return 'app-stores'
          }
          if (id.includes('services')) {
            return 'app-services'
          }
          if (id.includes('utils')) {
            return 'app-utils'
          }
        }
      }
    },
    cssCodeSplit: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})