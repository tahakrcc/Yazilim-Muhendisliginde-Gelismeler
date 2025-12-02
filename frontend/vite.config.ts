import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    open: true
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true
  }
})

