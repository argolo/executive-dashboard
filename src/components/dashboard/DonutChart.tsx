import type { IndicatorCard } from '../../domain/dashboard'
import { calculateDonutPercent } from '../../domain/dashboard'

export function DonutChart({ card }: { card: IndicatorCard }) {
  const percent = calculateDonutPercent(card)
  if (percent === null)
    return (
      <div className="donut donut--invalid" title="Dados insuficientes para o gráfico">
        —
      </div>
    )
  return (
    <div
      className="donut"
      style={{ background: `conic-gradient(var(--ion-color-primary) ${percent}%, #e8edf7 0)` }}
    >
      <div>
        <strong>{Math.round(percent)}%</strong>
        <small>progresso</small>
      </div>
    </div>
  )
}
