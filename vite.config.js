import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import chat from './api/chat.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (!process.env.GEMINI_API_KEY && env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
  }

  return {
    plugins: [
      react(),
      {
        name: 'local-gemini-api',
        configureServer(server) {
          server.middlewares.use('/api/chat', chat)
        },
      },
    ],
  }
})
