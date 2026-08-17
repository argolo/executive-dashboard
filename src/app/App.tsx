import { useEffect, useState } from 'react'
import { IonApp, IonContent } from '@ionic/react'
import { createEmptyCard, type DashboardCard } from '../domain/dashboard'
import { usePersistentDashboard } from '../hooks/usePersistentDashboard'
import { AppErrorBoundary } from '../components/shared/AppErrorBoundary'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { DashboardGrid } from '../components/dashboard/DashboardGrid'
import { CardEditorModal } from '../components/modals/CardEditorModal'
import { DateRangeModal } from '../components/modals/DateRangeModal'
import {
  createDashboardExport,
  downloadDashboardJson,
  parseDashboardJson,
} from '../infrastructure/dashboardExport'

/** Composição principal do dashboard e coordenação dos modais. */
export default function App() {
  const dashboard = usePersistentDashboard()
  const [editingCard, setEditingCard] = useState<DashboardCard | null>(null)
  const [editingDateRange, setEditingDateRange] = useState(false)
  const [presentationMode, setPresentationMode] = useState(false)
  const [importMessage, setImportMessage] = useState('')
  const saveCard = (card: DashboardCard) => {
    dashboard.saveCard(card)
    setEditingCard(null)
  }
  const exportDashboard = () =>
    downloadDashboardJson(createDashboardExport(dashboard.cards, dashboard.dateRange))
  const enterPresentation = () => {
    setPresentationMode(true)
    void document.documentElement.requestFullscreen().catch(() => undefined)
  }
  const importDashboard = async (file: File) => {
    try {
      const snapshot = parseDashboardJson(await file.text())
      dashboard.replaceDashboard(snapshot.cards, snapshot.dateRange)
      setEditingCard(null)
      setEditingDateRange(false)
      setPresentationMode(false)
      setImportMessage('Painel importado com sucesso.')
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : 'Não foi possível importar o painel.')
    }
  }

  useEffect(() => {
    const exitPresentation = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPresentationMode(false)
    }
    window.addEventListener('keydown', exitPresentation)
    return () => window.removeEventListener('keydown', exitPresentation)
  }, [])

  useEffect(() => {
    const syncPresentation = () => {
      if (!document.fullscreenElement) setPresentationMode(false)
    }
    document.addEventListener('fullscreenchange', syncPresentation)
    return () => document.removeEventListener('fullscreenchange', syncPresentation)
  }, [])

  return (
    <IonApp>
      <AppErrorBoundary>
        <IonContent className={`app-shell ${presentationMode ? 'app-shell--presentation' : ''}`}>
          <main className="dashboard-page">
            <DashboardHeader
              dateRange={dashboard.dateRange}
              onEditDateRange={() => setEditingDateRange(true)}
              onCreateNote={() => setEditingCard(createEmptyCard('note'))}
              onCreateIndicator={() => setEditingCard(createEmptyCard('indicator'))}
              onExport={exportDashboard}
              onImport={(file) => void importDashboard(file)}
              importMessage={importMessage}
              presentationMode={presentationMode}
              onTogglePresentation={enterPresentation}
            />
            <DashboardGrid
              cards={dashboard.cards}
              onEdit={setEditingCard}
              onDelete={dashboard.deleteCard}
              onReorder={dashboard.reorderCards}
              onCreate={() => setEditingCard(createEmptyCard('indicator'))}
              presentationMode={presentationMode}
            />
            <footer className="page-footer">
              Projetado por{' '}
              <a href="https://argolo.dev" target="_blank" rel="noreferrer">
                argolo.dev
              </a>
            </footer>
          </main>
          {editingCard && (
            <CardEditorModal card={editingCard} onSave={saveCard} onDismiss={() => setEditingCard(null)} />
          )}
          {editingDateRange && (
            <DateRangeModal
              range={dashboard.dateRange}
              onSave={(range) => {
                dashboard.setDateRange(range)
                setEditingDateRange(false)
              }}
              onDismiss={() => setEditingDateRange(false)}
            />
          )}
        </IonContent>
      </AppErrorBoundary>
    </IonApp>
  )
}
