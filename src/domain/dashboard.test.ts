import { describe, expect, it } from 'vitest'
import {
  calculateDonutPercent,
  createEmptyCard,
  reorderById,
  upsertCard,
  validateCard,
  type IndicatorCard,
} from './dashboard'

const indicator = (part = 25, total = 100): IndicatorCard => ({
  id: 'card',
  kind: 'indicator',
  title: 'Receita',
  mainValue: 'R$ 25',
  caption: '',
  auxiliaryKpis: [
    { id: 'part', label: 'Realizado', value: part, displayValue: String(part) },
    { id: 'total', label: 'Meta', value: total, displayValue: String(total) },
  ],
  donut: { enabled: true, partKpiId: 'part', totalKpiId: 'total' },
})

describe('calculateDonutPercent', () => {
  it('calcula parte sobre total', () => expect(calculateDonutPercent(indicator())).toBe(25))
  it('retorna nulo para total zero', () => expect(calculateDonutPercent(indicator(25, 0))).toBeNull())
  it('retorna nulo sem configuração ou KPI de parte', () => {
    const withoutDonut = { ...indicator(), donut: undefined }
    expect(calculateDonutPercent(withoutDonut)).toBeNull()
    expect(
      calculateDonutPercent({ ...indicator(), auxiliaryKpis: indicator().auxiliaryKpis.slice(1) }),
    ).toBeNull()
  })
  it('limita valores ao intervalo visual', () => {
    expect(calculateDonutPercent(indicator(130, 100))).toBe(100)
    expect(calculateDonutPercent(indicator(-5, 100))).toBe(0)
  })
})

describe('card operations', () => {
  it('cria rascunhos específicos por tipo', () => {
    expect(createEmptyCard('indicator').kind).toBe('indicator')
    expect(createEmptyCard('note')).toMatchObject({ kind: 'note', icon: 'document' })
  })
  it('valida indicador e nota', () => {
    expect(validateCard({ ...indicator(), title: '' })).toBe('Informe o título.')
    expect(validateCard({ id: 'n', kind: 'note', title: 'Aviso', description: '' })).toBe(
      'Informe a descrição da nota.',
    )
    expect(validateCard({ id: 'n', kind: 'note', title: 'Aviso', description: 'Texto' })).toBeNull()
    expect(validateCard({ ...indicator(), mainValue: '' })).toBe('Informe o valor principal.')
    expect(
      validateCard({ ...indicator(), auxiliaryKpis: [{ ...indicator().auxiliaryKpis[0], label: '' }] }),
    ).toBe('Informe as legendas dos KPIs.')
    expect(validateCard({ ...indicator(), donut: { enabled: true, partKpiId: '', totalKpiId: '' } })).toBe(
      'Selecione parte e total para a rosca.',
    )
    expect(validateCard(indicator())).toBeNull()
  })
  it('insere e atualiza cards', () => {
    const original = indicator()
    expect(upsertCard([], original)).toEqual([original])
    expect(upsertCard([original], { ...original, title: 'Atualizado' })[0].title).toBe('Atualizado')
  })
  it('reordena por identificador sem mutar a entrada', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    expect(reorderById(items, 'a', 'c').map(({ id }) => id)).toEqual(['b', 'c', 'a'])
    expect(reorderById(items, 'missing', 'c')).toBe(items)
    expect(reorderById(items, 'a', 'a')).toBe(items)
    expect(items.map(({ id }) => id)).toEqual(['a', 'b', 'c'])
  })
})
