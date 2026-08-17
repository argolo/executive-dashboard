import { useState } from 'react'
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTextarea,
} from '@ionic/react'
import { closeOutline } from 'ionicons/icons'
import { validateCard, type DashboardCard, type IndicatorCard, type NoteCard } from '../../domain/dashboard'
import { AuxiliaryKpiList } from '../forms/AuxiliaryKpiList'
import { DonutFields } from '../forms/DonutFields'
import { IconPicker } from '../forms/IconPicker'

interface Props {
  card: DashboardCard
  onSave: (card: DashboardCard) => void
  onDismiss: () => void
}

/** Editor único para indicadores e notas, com campos específicos por tipo. */
export function CardEditorModal({ card, onSave, onDismiss }: Props) {
  const [draft, setDraft] = useState<DashboardCard>(() => structuredClone(card))
  const [error, setError] = useState('')
  const updateBase = (changes: Partial<DashboardCard>) =>
    setDraft((current) => ({ ...current, ...changes }) as DashboardCard)
  const updateIndicator = (changes: Partial<IndicatorCard>) =>
    setDraft((current) => (current.kind === 'indicator' ? { ...current, ...changes } : current))
  const updateNote = (changes: Partial<NoteCard>) =>
    setDraft((current) => (current.kind === 'note' ? { ...current, ...changes } : current))
  const submit = () => {
    const message = validateCard(draft)
    if (message) return setError(message)
    onSave(draft)
  }
  const noun = draft.kind === 'note' ? 'nota' : 'indicador'

  return (
    <IonModal isOpen onDidDismiss={onDismiss} className="editor-modal">
      <IonContent>
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <p>{card.title ? `Editar ${noun}` : `Novo ${noun}`}</p>
              <h2>Configurar card</h2>
            </div>
            <IonButton fill="clear" aria-label="Fechar" onClick={onDismiss}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          <IonList inset>
            <IonItem>
              <IonLabel position="stacked">Título *</IonLabel>
              <IonInput
                value={draft.title}
                onIonInput={(event) => updateBase({ title: event.detail.value ?? '' })}
              />
            </IonItem>
            {draft.kind === 'note' ? (
              <IonItem>
                <IonLabel position="stacked">Descrição *</IonLabel>
                <IonTextarea
                  value={draft.description}
                  autoGrow
                  onIonInput={(event) => updateNote({ description: event.detail.value ?? '' })}
                />
              </IonItem>
            ) : (
              <>
                <IonItem>
                  <IonLabel position="stacked">Valor principal *</IonLabel>
                  <IonInput
                    value={draft.mainValue}
                    onIonInput={(event) => updateIndicator({ mainValue: event.detail.value ?? '' })}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Legenda</IonLabel>
                  <IonTextarea
                    value={draft.caption}
                    autoGrow
                    onIonInput={(event) => updateIndicator({ caption: event.detail.value ?? '' })}
                  />
                </IonItem>
              </>
            )}
          </IonList>
          <IconPicker value={draft.icon} onChange={(icon) => updateBase({ icon })} />
          {draft.kind === 'indicator' && (
            <>
              <AuxiliaryKpiList
                value={draft.auxiliaryKpis}
                onChange={(auxiliaryKpis) => updateIndicator({ auxiliaryKpis })}
              />
              <DonutFields card={draft} onChange={(donut) => updateIndicator({ donut })} />
            </>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-footer">
            <IonButton fill="clear" onClick={onDismiss}>
              Cancelar
            </IonButton>
            <IonButton onClick={submit}>Salvar card</IonButton>
          </div>
        </div>
      </IonContent>
    </IonModal>
  )
}
