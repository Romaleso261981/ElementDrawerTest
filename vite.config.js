import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '978gqk-5173.csb.app',
      'localhost',
      '127.0.0.1'
    ]
  }
})
  