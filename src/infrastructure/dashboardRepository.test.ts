import { describe, expect, it } from 'vitest'
import { DashboardRepository, STORAGE_KEYS, normalizeCards } from './dashboardRepository'

class MemoryStorage implements Storage {
  private data = new Map<string, string>()
  get length() {
    return this.data.size
  }
  clear() {
    this.data.clear()
  }
  getItem(key: string) {
    return this.data.get(key) ?? null
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null
  }
  removeItem(key: string) {
    this.data.delete(key)
  }
  setItem(key: string, value: string) {
    this.data.set(key, value)
  }
}

describe('DashboardRepository', () => {
  it('salva e carrega cards', () => {
    const storage = new MemoryStorage()
    const repository = new DashboardRepository(storage)
    const cards = [{ id: 'n', kind: 'note' as const, title: 'Alerta', description: 'Linha 1\nLinha 2' }]
    repository.saveCards(cards)
    expect(repository.loadCards()).toEqual(cards)
  })
  it('usa dados iniciais quando não existe estado salvo', () =>
    expect(new DashboardRepository(new MemoryStorage()).loadCards().length).toBeGreaterThan(0))
  it('usa dados iniciais quando o JSON está corrompido', () => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEYS.cards, '{')
    expect(new DashboardRepository(storage).loadCards().length).toBeGreaterThan(0)
  })
  it('migra indicadores sem kind e notas legadas', () => {
    const normalized = normalizeCards([
      { id: 'a', title: 'KPI', mainValue: '1', caption: '', auxiliaryKpis: [] },
      { id: 'b', kind: 'note', title: 'Nota', caption: 'Texto' },
      null,
      { title: 'Inválido' },
    ])
    expect(normalized?.[0].kind).toBe('indicator')
    expect(normalized?.[1]).toMatchObject({ kind: 'note', description: 'Texto' })
    expect(normalizeCards({})).toBeNull()
  })
  it('persiste o intervalo de datas', () => {
    const storage = new MemoryStorage()
    const repository = new DashboardRepository(storage)
    const range = { start: '2026-08-01T00:00', end: '2026-08-17T12:00' }
    repository.saveDateRange(range)
    expect(repository.loadDateRange()).toEqual(range)
  })
  it('recupera intervalo padrão diante de dados inválidos', () => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEYS.dateRange, '{')
    expect(new DashboardRepository(storage).loadDateRange().start).toBeTruthy()
    storage.setItem(STORAGE_KEYS.dateRange, '{}')
    expect(new DashboardRepository(storage).loadDateRange().end).toBeTruthy()
  })
})
