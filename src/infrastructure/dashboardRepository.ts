import { createDefaultDateRange, type DateRange } from '../domain/dateRange'
import type { DashboardCard, IndicatorCard } from '../domain/dashboard'
import { seedCards } from '../data/seedCards'

export const STORAGE_KEYS = {
  cards: 'painel-executivo.kpi-cards.v1',
  dateRange: 'painel-executivo.date-range.v1',
} as const

type LegacyCard = Partial<Omit<IndicatorCard, 'kind'>> & {
  kind?: 'kpi' | 'indicator' | 'note'
  description?: string
}

/** Normaliza o formato legado salvo pelas primeiras versões do painel. */
export function normalizeCards(value: unknown): DashboardCard[] | null {
  if (!Array.isArray(value)) return null
  return value.flatMap((raw): DashboardCard[] => {
    if (!raw || typeof raw !== 'object') return []
    const card = raw as LegacyCard
    if (typeof card.id !== 'string' || typeof card.title !== 'string') return []
    if (card.kind === 'note')
      return [
        {
          id: card.id,
          kind: 'note',
          title: card.title,
          description: card.description ?? card.caption ?? '',
          icon: card.icon,
        },
      ]
    return [
      {
        id: card.id,
        kind: 'indicator',
        title: card.title,
        mainValue: card.mainValue ?? '',
        caption: card.caption ?? '',
        icon: card.icon,
        auxiliaryKpis: Array.isArray(card.auxiliaryKpis) ? card.auxiliaryKpis : [],
        donut: card.donut,
      },
    ]
  })
}

/** Repositório local resiliente a JSON inválido e indisponibilidade do Storage. */
export class DashboardRepository {
  constructor(private readonly storage: Storage) {}

  loadCards(): DashboardCard[] {
    try {
      const raw = this.storage.getItem(STORAGE_KEYS.cards)
      if (!raw) return seedCards
      return normalizeCards(JSON.parse(raw)) ?? seedCards
    } catch {
      return seedCards
    }
  }

  saveCards(cards: DashboardCard[]): void {
    this.storage.setItem(STORAGE_KEYS.cards, JSON.stringify(cards))
  }

  loadDateRange(): DateRange {
    try {
      const raw = this.storage.getItem(STORAGE_KEYS.dateRange)
      if (!raw) return createDefaultDateRange()
      const parsed = JSON.parse(raw) as Partial<DateRange>
      return typeof parsed.start === 'string' && typeof parsed.end === 'string'
        ? (parsed as DateRange)
        : createDefaultDateRange()
    } catch {
      return createDefaultDateRange()
    }
  }

  saveDateRange(range: DateRange): void {
    this.storage.setItem(STORAGE_KEYS.dateRange, JSON.stringify(range))
  }
}
