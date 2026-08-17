import { useState } from 'react'
import { IonButton, IonContent, IonIcon, IonModal } from '@ionic/react'
import { closeOutline } from 'ionicons/icons'
import { isValidDateRange, type DateRange } from '../../domain/dateRange'

interface Props {
  range: DateRange
  onSave: (range: DateRange) => void
  onDismiss: () => void
}

export function DateRangeModal({ range, onSave, onDismiss }: Props) {
  const [draft, setDraft] = useState(range)
  const [error, setError] = useState('')
  const submit = () => {
    if (!isValidDateRange(draft)) return setError('O início deve ser anterior ao fim.')
    onSave(draft)
  }
  return (
    <IonModal isOpen onDidDismiss={onDismiss} className="date-modal">
      <IonContent>
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <p>Período de análise</p>
              <h2>Selecionar intervalo</h2>
            </div>
            <IonButton fill="clear" aria-label="Fechar" onClick={onDismiss}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
          <div className="date-fields">
            <label>
              Início
              <input
                type="datetime-local"
                value={draft.start}
                onChange={(event) => setDraft((current) => ({ ...current, start: event.target.value }))}
              />
            </label>
            <label>
              Fim
              <input
                type="datetime-local"
                value={draft.end}
                onChange={(event) => setDraft((current) => ({ ...current, end: event.target.value }))}
              />
            </label>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-footer">
            <IonButton fill="clear" onClick={onDismiss}>
              Cancelar
            </IonButton>
            <IonButton onClick={submit}>Aplicar intervalo</IonButton>
          </div>
        </div>
      </IonContent>
    </IonModal>
  )
}
