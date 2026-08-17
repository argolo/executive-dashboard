import { useRef } from 'react'
import { IonButton, IonIcon } from '@ionic/react'
import {
  addOutline,
  calendarOutline,
  desktopOutline,
  documentTextOutline,
  downloadOutline,
  cloudUploadOutline,
} from 'ionicons/icons'
import { formatDateRange, type DateRange } from '../../domain/dateRange'

interface Props {
  dateRange: DateRange
  onEditDateRange: () => void
  onCreateIndicator: () => void
  onCreateNote: () => void
  onExport: () => void
  onImport: (file: File) => void
  importMessage?: string
  presentationMode: boolean
  onTogglePresentation: () => void
}

export function DashboardHeader({
  dateRange,
  onEditDateRange,
  onCreateIndicator,
  onCreateNote,
  onExport,
  onImport,
  importMessage,
  presentationMode,
  onTogglePresentation,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectFile = (file?: File) => {
    if (file) onImport(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
  return (
    <header className="page-header">
      <div>
        <p>Painel executivo</p>
        <div className="title-row">
          <h1>Indicadores</h1>
          {presentationMode ? (
            <span className="date-range-static">
              <IonIcon icon={calendarOutline} />
              {formatDateRange(dateRange)}
            </span>
          ) : (
            <button
              className="date-range-button"
              onClick={onEditDateRange}
              aria-label="Alterar intervalo de datas"
              title="Alterar intervalo"
            >
              <IonIcon icon={calendarOutline} />
              {formatDateRange(dateRange)}
            </button>
          )}
        </div>
      </div>
      {presentationMode ? (
        <p className="presentation-hint">Modo apresentação · pressione Esc para sair</p>
      ) : (
        <div className="header-actions">
          <input
            ref={fileInputRef}
            className="visually-hidden"
            type="file"
            accept="application/json,.json"
            onChange={(event) => selectFile(event.target.files?.[0])}
          />
          <IonButton fill="clear" onClick={() => fileInputRef.current?.click()}>
            <IonIcon slot="start" icon={cloudUploadOutline} />
            Importar JSON
          </IonButton>
          <IonButton fill="clear" onClick={onExport}>
            <IonIcon slot="start" icon={downloadOutline} />
            Exportar JSON
          </IonButton>
          <IonButton fill="clear" onClick={onTogglePresentation}>
            <IonIcon slot="start" icon={desktopOutline} />
            Apresentação
          </IonButton>
          <IonButton fill="outline" onClick={onCreateNote}>
            <IonIcon slot="start" icon={documentTextOutline} />
            Nova Nota
          </IonButton>
          <IonButton onClick={onCreateIndicator}>
            <IonIcon slot="start" icon={addOutline} />
            Novo Indicador
          </IonButton>
          {importMessage && (
            <span className="import-feedback" role="status">
              {importMessage}
            </span>
          )}
        </div>
      )}
    </header>
  )
}
