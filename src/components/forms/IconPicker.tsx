import { IonIcon } from '@ionic/react'
import { iconCatalog } from '../../ui/iconCatalog'

interface Props {
  value?: string
  onChange: (value?: string) => void
}

export function IconPicker({ value, onChange }: Props) {
  return (
    <section className="form-section">
      <h3>Ícone</h3>
      <div className="icon-picker">
        <button type="button" className={!value ? 'selected' : ''} onClick={() => onChange(undefined)}>
          Sem ícone
        </button>
        {iconCatalog.map((option) => (
          <button
            type="button"
            key={option.id}
            className={value === option.id ? 'selected' : ''}
            aria-label={option.label}
            title={option.label}
            onClick={() => onChange(option.id)}
          >
            <IonIcon icon={option.icon} />
          </button>
        ))}
      </div>
    </section>
  )
}
