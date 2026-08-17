import { IonButton, IonIcon } from '@ionic/react'
import { createOutline, trashOutline } from 'ionicons/icons'
import type { DashboardCard } from '../../domain/dashboard'
import { resolveIcon } from '../../ui/iconCatalog'
import { DonutChart } from './DonutChart'

interface Props {
  card: DashboardCard
  dragging?: boolean
  onEdit?: () => void
  onDelete?: () => void
  readOnly?: boolean
}

export function DashboardCardView({ card, dragging = false, onEdit, onDelete, readOnly = false }: Props) {
  const icon = resolveIcon(card.icon)
  return (
    <article
      className={`dashboard-card ${card.kind === 'note' ? 'dashboard-card--note' : ''} ${dragging ? 'dashboard-card--dragging' : ''}`}
    >
      {!readOnly && (
        <div className="card-actions">
          <IonButton fill="clear" aria-label={`Editar ${card.title}`} onClick={onEdit}>
            <IonIcon icon={createOutline} />
          </IonButton>
          <IonButton fill="clear" color="danger" aria-label={`Excluir ${card.title}`} onClick={onDelete}>
            <IonIcon icon={trashOutline} />
          </IonButton>
        </div>
      )}
      {icon && <IonIcon className="card-background-icon" icon={icon} aria-hidden="true" />}
      {card.kind === 'note' ? (
        <div className="note-content">
          <h2>{card.title}</h2>
          <span>{card.description}</span>
        </div>
      ) : (
        <>
          <header>
            <p>{card.title}</p>
            <h2>{card.mainValue}</h2>
            <span>{card.caption}</span>
          </header>
          <div className="card-bottom">
            {card.donut?.enabled && <DonutChart card={card} />}
            <ul>
              {card.auxiliaryKpis.map((kpi) => (
                <li key={kpi.id}>
                  <span>{kpi.label}</span>
                  <strong>{kpi.displayValue}</strong>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </article>
  )
}
