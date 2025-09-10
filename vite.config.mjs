import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    dir: 'src',
    watchExclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/generated/**',
      '**/prisma/generated/**',
      '**/.env*',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/prisma/migrations/**',
      '**/prisma/.env',
    ],
    forceRerunTriggers: [
      '**/*.test.{ts,js}',
      '**/*.spec.{ts,js}',
      '**/src/**/*.{ts,js}',
    ],
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/use-cases/tests',
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: 'src/http/controllers/tests',
          environment:
            './prisma/vitest-environment-prisma/prisma-test-environment.ts',
          testTimeout: 10000, // 10 segundos para testes E2E
        },
      },
    ],
  },
})
