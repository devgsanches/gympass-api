import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import type { Environment } from 'vitest/environments'

// novo schema para cada switch de teste
function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('please provide a DATABASE_URL env variable')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // Criar o banco de testes
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    process.env.DATABASE_URL = databaseUrl

    execSync(
      'npx prisma db push --force-reset --accept-data-loss --skip-generate',
      {
        stdio: 'ignore',
        env: {
          ...process.env,
          PRISMA_DISABLE_WARNINGS: 'true',
          PRISMA_GENERATE_SKIP_AUTOINSTALL: 'true',
        },
      }
    )

    return {
      async teardown() {
        // Apagar o banco de testes
        try {
          await prisma.$disconnect()

          await prisma.$connect()

          await prisma.$executeRawUnsafe(
            `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
          )

          console.log(
            `✅ Schema de teste "${schema}" criado/testado e removido com sucesso`
          )
        } catch (error) {
          console.warn(`⚠️ Erro ao limpar schema de teste "${schema}":`, error)
        } finally {
          await prisma.$disconnect()
        }
      },
    }
  },
}
