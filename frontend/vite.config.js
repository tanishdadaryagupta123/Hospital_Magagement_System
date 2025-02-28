import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    fs: {
      strict: true,
    },
    headers: {
      'Content-Type': 'application/javascript',
    },
  },
})
