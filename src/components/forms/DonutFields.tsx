import { IonToggle } from '@ionic/react'
import type { DonutConfig, IndicatorCard } from '../../domain/dashboard'

interface Props {
  card: IndicatorCard
  onChange: (value?: DonutConfig) => void
}

export function DonutFields({ card, onChange }: Props) {
  const toggle = (enabled: boolean) =>
    onChange(
      enabled
        ? {
            enabled: true,
            partKpiId: card.auxiliaryKpis[0]?.id ?? '',
            totalKpiId: card.auxiliaryKpis[1]?.id ?? '',
          }
        : undefined,
    )
  const update = (field: keyof DonutConfig, value: string) => onChange({ ...card.donut!, [field]: value })
  return (
    <section className="form-section">
      <div className="toggle-line">
        <div>
          <h3>Gráfico de rosca</h3>
          <p>Calcula parte ÷ total</p>
        </div>
        <IonToggle
          checked={Boolean(card.donut?.enabled)}
          onIonChange={(event) => toggle(event.detail.checked)}
        />
      </div>
      {card.donut?.enabled && (
        <div className="select-grid">
          <label>
            Parte
            <select
              value={card.donut.partKpiId}
              onChange={(event) => update('partKpiId', event.target.value)}
            >
              {card.auxiliaryKpis.map((kpi) => (
                <option key={kpi.id} value={kpi.id}>
                  {kpi.label || 'KPI sem legenda'}
                </option>
              ))}
            </select>
          </label>
          <label>
            Total
            <select
              value={card.donut.totalKpiId}
              onChange={(event) => update('totalKpiId', event.target.value)}
            >
              {card.auxiliaryKpis.map((kpi) => (
                <option key={kpi.id} value={kpi.id}>
                  {kpi.label || 'KPI sem legenda'}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </section>
  )
}
