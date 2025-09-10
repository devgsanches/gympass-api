import 'dotenv/config'
import { prisma } from '@/lib/prisma'

/**
 * Utilitário para limpar schemas de teste órfãos
 * Útil para limpeza manual ou em caso de falha na limpeza automática
 */
export async function listTestSchemas(): Promise<string[]> {
  try {
    const result = await prisma.$queryRaw<Array<{ schema_name: string }>>`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    `

    return result.map(row => row.schema_name)
  } catch (error) {
    console.error('Erro ao listar schemas de teste:', error)
    return []
  }
}

export async function cleanupOrphanedSchemas(): Promise<void> {
  const testSchemas = await listTestSchemas()

  if (testSchemas.length === 0) {
    console.log('✅ Nenhum schema de teste órfão encontrado')
    return
  }

  console.log(`🧹 Encontrados ${testSchemas.length} schemas de teste órfãos`)

  for (const schema of testSchemas) {
    try {
      await prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
      )
      console.log(`✅ Schema "${schema}" removido`)
    } catch (error) {
      console.warn(`⚠️ Erro ao remover schema "${schema}":`, error)
    }
  }

  console.log('🎉 Limpeza de schemas órfãos concluída')
}

// Script para execução direta
if (require.main === module) {
  cleanupOrphanedSchemas()
    .finally(() => prisma.$disconnect())
    .catch(console.error)
}
