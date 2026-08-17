import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { DashboardCard } from '../../domain/dashboard'
import { DashboardCardView } from './DashboardCardView'

interface Props {
  card: DashboardCard
  onEdit: () => void
  onDelete: () => void
}

export function SortableDashboardCard({ card, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className="sortable-card"
    >
      <DashboardCardView card={card} onEdit={onEdit} onDelete={onDelete} dragging={isDragging} />
    </div>
  )
}
