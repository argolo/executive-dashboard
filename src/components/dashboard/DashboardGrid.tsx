import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { IonButton } from '@ionic/react'
import type { DashboardCard } from '../../domain/dashboard'
import { DashboardCardView } from './DashboardCardView'
import { SortableDashboardCard } from './SortableDashboardCard'

interface Props {
  cards: DashboardCard[]
  onEdit: (card: DashboardCard) => void
  onDelete: (id: string) => void
  onReorder: (activeId: string, overId: string) => void
  onCreate: () => void
  presentationMode?: boolean
}

export function DashboardGrid({
  cards,
  onEdit,
  onDelete,
  onReorder,
  onCreate,
  presentationMode = false,
}: Props) {
  const [activeCard, setActiveCard] = useState<DashboardCard | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const handleDragStart = ({ active }: DragStartEvent) =>
    setActiveCard(cards.find((card) => card.id === active.id) ?? null)
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null)
    if (over && active.id !== over.id) onReorder(String(active.id), String(over.id))
  }

  if (!cards.length)
    return (
      <section className="empty-state">
        <h2>Nenhum indicador criado</h2>
        <p>Crie o primeiro card para começar o painel.</p>
        {!presentationMode && <IonButton onClick={onCreate}>Criar indicador</IonButton>}
      </section>
    )
  if (presentationMode)
    return (
      <section className="dashboard-grid dashboard-grid--static">
        {cards.map((card) => (
          <DashboardCardView key={card.id} card={card} readOnly />
        ))}
      </section>
    )
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveCard(null)}
    >
      <SortableContext items={cards.map((card) => card.id)} strategy={rectSortingStrategy}>
        <section className="dashboard-grid">
          {cards.map((card) => (
            <SortableDashboardCard
              key={card.id}
              card={card}
              onEdit={() => onEdit(card)}
              onDelete={() => onDelete(card.id)}
            />
          ))}
        </section>
      </SortableContext>
      <DragOverlay>{activeCard ? <DashboardCardView card={activeCard} dragging /> : null}</DragOverlay>
    </DndContext>
  )
}
