export interface DateRange {
  start: string
  end: string
}

/** Converte uma data para o formato aceito por `datetime-local`. */
export function toLocalDateTime(date: Date): string {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

/** Retorna o intervalo padrão: início do mês até o momento informado. */
export function createDefaultDateRange(now = new Date()): DateRange {
  return { start: toLocalDateTime(new Date(now.getFullYear(), now.getMonth(), 1)), end: toLocalDateTime(now) }
}

export function isValidDateRange(range: DateRange): boolean {
  const start = new Date(range.start).getTime()
  const end = new Date(range.end).getTime()
  return Boolean(range.start && range.end && Number.isFinite(start) && Number.isFinite(end) && start <= end)
}

export function formatDateRange(range: DateRange, locale = 'pt-BR'): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${formatter.format(new Date(range.start))} — ${formatter.format(new Date(range.end))}`
}
