import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DateRange } from '../domain/dateRange'
import { reorderById, upsertCard, type DashboardCard } from '../domain/dashboard'
import { DashboardRepository } from '../infrastructure/dashboardRepository'

/** Centraliza estado e persistência do painel, mantendo componentes livres de I/O. */
export function usePersistentDashboard() {
  const repository = useMemo(() => new DashboardRepository(localStorage), [])
  const [cards, setCards] = useState<DashboardCard[]>(() => repository.loadCards())
  const [dateRange, setDateRange] = useState<DateRange>(() => repository.loadDateRange())

  useEffect(() => repository.saveCards(cards), [cards, repository])
  useEffect(() => repository.saveDateRange(dateRange), [dateRange, repository])

  const saveCard = useCallback((card: DashboardCard) => setCards((current) => upsertCard(current, card)), [])
  const deleteCard = useCallback(
    (id: string) => setCards((current) => current.filter((card) => card.id !== id)),
    [],
  )
  const reorderCards = useCallback(
    (activeId: string, overId: string) => setCards((current) => reorderById(current, activeId, overId)),
    [],
  )
  const replaceDashboard = useCallback((nextCards: DashboardCard[], nextDateRange: DateRange) => {
    setCards(nextCards)
    setDateRange(nextDateRange)
  }, [])

  return { cards, dateRange, saveCard, deleteCard, reorderCards, setDateRange, replaceDashboard }
}
