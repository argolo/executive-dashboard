/** Identificador de um ícone disponível no catálogo visual. */
export type CardIcon = string

export interface AuxiliaryKpi {
  id: string
  label: string
  value: number
  displayValue: string
}

export interface DonutConfig {
  enabled: boolean
  partKpiId: string
  totalKpiId: string
}

interface BaseCard {
  id: string
  title: string
  icon?: CardIcon
}

export interface IndicatorCard extends BaseCard {
  kind: 'indicator'
  mainValue: string
  caption: string
  auxiliaryKpis: AuxiliaryKpi[]
  donut?: DonutConfig
}

export interface NoteCard extends BaseCard {
  kind: 'note'
  description: string
}

export type DashboardCard = IndicatorCard | NoteCard
export type CardKind = DashboardCard['kind']

/** Gera um identificador estável, inclusive em contextos sem Web Crypto. */
export function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** Cria um rascunho válido para o tipo de card solicitado. */
export function createEmptyCard(kind: CardKind = 'indicator'): DashboardCard {
  if (kind === 'note') return { id: createId(), kind, title: '', description: '', icon: 'document' }
  return {
    id: createId(),
    kind,
    title: '',
    mainValue: '',
    caption: '',
    auxiliaryKpis: [{ id: createId(), label: '', value: 0, displayValue: '' }],
  }
}

/** Calcula o preenchimento visual da rosca, sempre limitado ao intervalo 0–100. */
export function calculateDonutPercent(card: IndicatorCard): number | null {
  if (!card.donut?.enabled) return null
  const part = card.auxiliaryKpis.find((kpi) => kpi.id === card.donut?.partKpiId)?.value
  const total = card.auxiliaryKpis.find((kpi) => kpi.id === card.donut?.totalKpiId)?.value
  if (part === undefined || !total) return null
  return Math.max(0, Math.min(100, (part / total) * 100))
}

/** Valida campos obrigatórios e referências internas antes da persistência. */
export function validateCard(card: DashboardCard): string | null {
  if (!card.title.trim()) return 'Informe o título.'
  if (card.kind === 'note') return card.description.trim() ? null : 'Informe a descrição da nota.'
  if (!card.mainValue.trim()) return 'Informe o valor principal.'
  if (card.auxiliaryKpis.some((kpi) => !kpi.label.trim())) return 'Informe as legendas dos KPIs.'
  if (card.donut?.enabled && (!card.donut.partKpiId || !card.donut.totalKpiId))
    return 'Selecione parte e total para a rosca.'
  return null
}

/** Insere um card ou substitui a versão existente sem alterar a ordem. */
export function upsertCard(cards: DashboardCard[], card: DashboardCard): DashboardCard[] {
  const index = cards.findIndex((item) => item.id === card.id)
  if (index < 0) return [...cards, card]
  return cards.map((item) => (item.id === card.id ? card : item))
}

/** Move um item por identificador; entradas desconhecidas não alteram a coleção. */
export function reorderById<T extends { id: string }>(items: T[], activeId: string, overId: string): T[] {
  const from = items.findIndex((item) => item.id === activeId)
  const to = items.findIndex((item) => item.id === overId)
  if (from < 0 || to < 0 || from === to) return items
  const result = [...items]
  const [moved] = result.splice(from, 1)
  result.splice(to, 0, moved)
  return result
}
