import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    base: env.BASE_PATH ?? '/',
    plugins: [react()],
    test: {
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/domain/**/*.ts', 'src/infrastructure/**/*.ts'],
        exclude: ['**/*.test.ts'],
        thresholds: { statements: 90, branches: 70, functions: 90, lines: 90 },
      },
    },
  }
})
