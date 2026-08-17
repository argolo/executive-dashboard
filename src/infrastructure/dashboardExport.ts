import { isValidDateRange, type DateRange } from '../domain/dateRange'
import type { DashboardCard } from '../domain/dashboard'
import { normalizeCards } from './dashboardRepository'

export interface DashboardExport {
  schemaVersion: 1
  exportedAt: string
  dateRange: DateRange
  cards: DashboardCard[]
}

/** Cria um snapshot serializável e versionado do estado atual do painel. */
export function createDashboardExport(
  cards: DashboardCard[],
  dateRange: DateRange,
  exportedAt = new Date(),
): DashboardExport {
  return { schemaVersion: 1, exportedAt: exportedAt.toISOString(), dateRange, cards }
}

/** Dispara o download de um snapshot JSON sem depender de servidor. */
export function downloadDashboardJson(snapshot: DashboardExport): void {
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `painel-executivo-${snapshot.exportedAt.slice(0, 10)}.json`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/** Valida e normaliza um arquivo de painel antes de aplicá-lo ao estado local. */
export function parseDashboardJson(json: string): DashboardExport {
  let value: unknown
  try {
    value = JSON.parse(json)
  } catch {
    throw new Error('O arquivo não contém JSON válido.')
  }
  if (!value || typeof value !== 'object') throw new Error('Formato de arquivo inválido.')
  const data = value as Partial<DashboardExport>
  const cards = normalizeCards(data.cards)
  if (data.schemaVersion !== 1 || !cards || !Array.isArray(data.cards) || cards.length !== data.cards.length)
    throw new Error('Formato de painel não suportado.')
  if (!data.dateRange || !isValidDateRange(data.dateRange))
    throw new Error('O intervalo de datas é inválido.')
  return {
    schemaVersion: 1,
    exportedAt: typeof data.exportedAt === 'string' ? data.exportedAt : new Date().toISOString(),
    dateRange: data.dateRange,
    cards,
  }
}
