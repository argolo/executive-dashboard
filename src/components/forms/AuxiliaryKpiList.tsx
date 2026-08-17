import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IonButton, IonIcon, IonInput } from '@ionic/react'
import { addOutline, closeOutline, reorderThreeOutline } from 'ionicons/icons'
import { createId, reorderById, type AuxiliaryKpi } from '../../domain/dashboard'

interface RowProps {
  kpi: AuxiliaryKpi
  index: number
  count: number
  onChange: (field: keyof AuxiliaryKpi, value: string) => void
  onRemove: () => void
}

function SortableKpiRow({ kpi, index, count, onChange, onRemove }: RowProps) {
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: kpi.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`kpi-form-row ${isDragging ? 'kpi-form-row--dragging' : ''}`}
    >
      <IonButton
        ref={setActivatorNodeRef}
        fill="clear"
        className="drag-handle"
        aria-label={`Reordenar ${kpi.label || `KPI ${index + 1}`}`}
        {...attributes}
        {...listeners}
      >
        <IonIcon icon={reorderThreeOutline} />
      </IonButton>
      <IonInput
        aria-label="Legenda"
        placeholder="Legenda"
        value={kpi.label}
        onIonInput={(event) => onChange('label', event.detail.value ?? '')}
      />
      <IonInput
        aria-label="Valor numérico"
        type="number"
        placeholder="Valor"
        value={String(kpi.value)}
        onIonInput={(event) => onChange('value', event.detail.value ?? '0')}
      />
      <IonInput
        aria-label="Valor exibido"
        placeholder="Ex.: R$ 100"
        value={kpi.displayValue}
        onIonInput={(event) => onChange('displayValue', event.detail.value ?? '')}
      />
      {count > 1 && (
        <IonButton fill="clear" color="danger" aria-label="Remover KPI" onClick={onRemove}>
          <IonIcon icon={closeOutline} />
        </IonButton>
      )}
    </div>
  )
}

interface Props {
  value: AuxiliaryKpi[]
  onChange: (value: AuxiliaryKpi[]) => void
}

export function AuxiliaryKpiList({ value, onChange }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const updateKpi = (index: number, field: keyof AuxiliaryKpi, rawValue: string) =>
    onChange(
      value.map((kpi, current) =>
        current === index ? { ...kpi, [field]: field === 'value' ? Number(rawValue) || 0 : rawValue } : kpi,
      ),
    )
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over) onChange(reorderById(value, String(active.id), String(over.id)))
  }
  const addKpi = () => onChange([...value, { id: createId(), label: '', value: 0, displayValue: '' }])

  return (
    <section className="form-section">
      <h3>KPIs auxiliares</h3>
      <p className="form-hint">Use a alça para reordenar.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value.map((kpi) => kpi.id)} strategy={rectSortingStrategy}>
          {value.map((kpi, index) => (
            <SortableKpiRow
              key={kpi.id}
              kpi={kpi}
              index={index}
              count={value.length}
              onChange={(field, rawValue) => updateKpi(index, field, rawValue)}
              onRemove={() => onChange(value.filter((_, current) => current !== index))}
            />
          ))}
        </SortableContext>
      </DndContext>
      <IonButton fill="outline" onClick={addKpi}>
        <IonIcon slot="start" icon={addOutline} />
        Adicionar KPI
      </IonButton>
    </section>
  )
}
