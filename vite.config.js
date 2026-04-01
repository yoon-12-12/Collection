import { defineConfig } from 'vite'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  base: '/Collection/',
  build: {
    rollupOptions: {
      // input 제거 → index.html은 자동 복사
    }
  },
  plugins: [
    copy({
      targets: [
        { src: 'gallery.html', dest: 'dist' },
        { src: 'profile.html', dest: 'dist' },
        { src: 'kaleidoscope.html', dest: 'dist' },
        { src: 'original.html', dest: 'dist' },
        { src: 'src/**/*', dest: 'dist/src' },
        { src: 'assets/**/*', dest: 'dist/assets' }
      ]
    })
  ]
})
