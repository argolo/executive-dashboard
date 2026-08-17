import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDashboardExport, downloadDashboardJson, parseDashboardJson } from './dashboardExport'

describe('createDashboardExport', () => {
  it('cria snapshot versionado e preserva o conteúdo do painel', () => {
    const cards = [{ id: 'note-1', kind: 'note' as const, title: 'Aviso', description: 'Sem alterações' }]
    const dateRange = { start: '2026-08-01T00:00', end: '2026-08-17T12:00' }
    expect(createDashboardExport(cards, dateRange, new Date('2026-08-17T15:00:00.000Z'))).toEqual({
      schemaVersion: 1,
      exportedAt: '2026-08-17T15:00:00.000Z',
      dateRange,
      cards,
    })
  })

  it('baixa o snapshot como arquivo JSON', () => {
    const click = vi.fn()
    const remove = vi.fn()
    const appendChild = vi.fn()
    const anchor = { href: '', download: '', click, remove }
    vi.stubGlobal('document', { createElement: vi.fn(() => anchor), body: { appendChild } })
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:dashboard'), revokeObjectURL: vi.fn() })
    const snapshot = createDashboardExport(
      [],
      { start: '2026-08-01T00:00', end: '2026-08-17T12:00' },
      new Date('2026-08-17T15:00:00.000Z'),
    )
    downloadDashboardJson(snapshot)
    expect(anchor.download).toBe('painel-executivo-2026-08-17.json')
    expect(appendChild).toHaveBeenCalledWith(anchor)
    expect(click).toHaveBeenCalledOnce()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:dashboard')
  })

  it('valida arquivos importados antes de aplicá-los', () => {
    const valid = JSON.stringify(
      createDashboardExport([], { start: '2026-08-01T00:00', end: '2026-08-17T12:00' }),
    )
    expect(parseDashboardJson(valid).schemaVersion).toBe(1)
    expect(() => parseDashboardJson('inválido')).toThrow('JSON válido')
    expect(() =>
      parseDashboardJson(JSON.stringify({ schemaVersion: 1, cards: [], dateRange: { start: '', end: '' } })),
    ).toThrow('intervalo')
  })
})

afterEach(() => vi.unstubAllGlobals())
