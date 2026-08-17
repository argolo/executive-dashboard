import { createId, type DashboardCard } from '../domain/dashboard'

type SeedDefinition = {
  title: string
  mainValue: string
  caption: string
  icon: string
  donut: boolean
  kpis: [label: string, value: number, displayValue: string][]
}

const definitions: SeedDefinition[] = [
  {
    title: 'Receita líquida',
    mainValue: 'R$ 2,48 mi',
    caption: 'Acumulado no mês',
    icon: 'cash',
    donut: true,
    kpis: [
      ['Meta', 2_500_000, 'R$ 2,50 mi'],
      ['Ano anterior', 2_180_000, 'R$ 2,18 mi'],
    ],
  },
  {
    title: 'Margem EBITDA',
    mainValue: '24,6%',
    caption: 'Resultado operacional',
    icon: 'trending',
    donut: true,
    kpis: [
      ['Meta', 25, '25,0%'],
      ['Mês anterior', 23.8, '23,8%'],
    ],
  },
  {
    title: 'Novos clientes',
    mainValue: '184',
    caption: 'Entradas no período',
    icon: 'people',
    donut: true,
    kpis: [
      ['Meta', 220, '220'],
      ['Conversão', 31, '31%'],
    ],
  },
  {
    title: 'NPS',
    mainValue: '72',
    caption: 'Satisfação dos clientes',
    icon: 'heart',
    donut: false,
    kpis: [
      ['Meta', 80, '80'],
      ['Promotores', 76, '76%'],
    ],
  },
  {
    title: 'Churn',
    mainValue: '1,8%',
    caption: 'Cancelamentos mensais',
    icon: 'analytics',
    donut: false,
    kpis: [
      ['Limite', 2.5, '2,5%'],
      ['Mês anterior', 2.1, '2,1%'],
    ],
  },
  {
    title: 'Pipeline',
    mainValue: 'R$ 5,2 mi',
    caption: 'Oportunidades abertas',
    icon: 'briefcase',
    donut: true,
    kpis: [
      ['Meta', 6_000_000, 'R$ 6,0 mi'],
      ['Cobertura', 3.1, '3,1x'],
    ],
  },
]

/** Dados demonstrativos exibidos apenas quando não existe estado persistido. */
export const seedCards: DashboardCard[] = definitions.map((definition) => {
  const auxiliaryKpis = definition.kpis.map(([label, value, displayValue]) => ({
    id: createId(),
    label,
    value,
    displayValue,
  }))
  return {
    id: createId(),
    kind: 'indicator',
    title: definition.title,
    mainValue: definition.mainValue,
    caption: definition.caption,
    icon: definition.icon,
    auxiliaryKpis,
    donut: definition.donut
      ? { enabled: true, partKpiId: auxiliaryKpis[1].id, totalKpiId: auxiliaryKpis[0].id }
      : undefined,
  }
})
