import { describe, expect, it } from 'vitest'
import { createDefaultDateRange, formatDateRange, isValidDateRange, toLocalDateTime } from './dateRange'

describe('date range', () => {
  it('formata datas para datetime-local', () =>
    expect(toLocalDateTime(new Date(2026, 7, 17, 14, 30))).toBe('2026-08-17T14:30'))
  it('cria intervalo desde o início do mês', () =>
    expect(createDefaultDateRange(new Date(2026, 7, 17, 14, 30))).toEqual({
      start: '2026-08-01T00:00',
      end: '2026-08-17T14:30',
    }))
  it('rejeita intervalo invertido ou inválido', () => {
    expect(isValidDateRange({ start: '2026-08-17T10:00', end: '2026-08-17T09:59' })).toBe(false)
    expect(isValidDateRange({ start: '', end: '' })).toBe(false)
  })
  it('gera rótulo legível', () =>
    expect(formatDateRange({ start: '2026-08-01T00:00', end: '2026-08-17T14:30' })).toContain('—'))
})
