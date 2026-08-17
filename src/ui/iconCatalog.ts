import {
  analyticsOutline,
  barChartOutline,
  briefcaseOutline,
  cashOutline,
  cartOutline,
  cloudOutline,
  codeSlashOutline,
  compassOutline,
  cubeOutline,
  documentTextOutline,
  flagOutline,
  folderOutline,
  globeOutline,
  heartOutline,
  keyOutline,
  leafOutline,
  mailOutline,
  medkitOutline,
  notificationsOutline,
  peopleOutline,
  pulseOutline,
  rocketOutline,
  shieldCheckmarkOutline,
  starOutline,
  thumbsDownOutline,
  thumbsUpOutline,
  timeOutline,
  trendingUpOutline,
} from 'ionicons/icons'

export interface IconOption {
  id: string
  label: string
  icon: string
}

export const iconCatalog: IconOption[] = [
  { id: 'analytics', label: 'Análise', icon: analyticsOutline },
  { id: 'cash', label: 'Receita', icon: cashOutline },
  { id: 'people', label: 'Pessoas', icon: peopleOutline },
  { id: 'trending', label: 'Crescimento', icon: trendingUpOutline },
  { id: 'rocket', label: 'Meta', icon: rocketOutline },
  { id: 'heart', label: 'Satisfação', icon: heartOutline },
  { id: 'briefcase', label: 'Negócios', icon: briefcaseOutline },
  { id: 'globe', label: 'Global', icon: globeOutline },
  { id: 'chart', label: 'Gráfico', icon: barChartOutline },
  { id: 'cart', label: 'Vendas', icon: cartOutline },
  { id: 'cloud', label: 'Nuvem', icon: cloudOutline },
  { id: 'code', label: 'Tecnologia', icon: codeSlashOutline },
  { id: 'compass', label: 'Direção', icon: compassOutline },
  { id: 'cube', label: 'Produto', icon: cubeOutline },
  { id: 'document', label: 'Documento', icon: documentTextOutline },
  { id: 'flag', label: 'Objetivo', icon: flagOutline },
  { id: 'folder', label: 'Projetos', icon: folderOutline },
  { id: 'key', label: 'Acesso', icon: keyOutline },
  { id: 'leaf', label: 'ESG', icon: leafOutline },
  { id: 'mail', label: 'Mensagens', icon: mailOutline },
  { id: 'medkit', label: 'Saúde', icon: medkitOutline },
  { id: 'notification', label: 'Alertas', icon: notificationsOutline },
  { id: 'pulse', label: 'Atividade', icon: pulseOutline },
  { id: 'shield', label: 'Segurança', icon: shieldCheckmarkOutline },
  { id: 'star', label: 'Qualidade', icon: starOutline },
  { id: 'time', label: 'Tempo', icon: timeOutline },
  { id: 'like', label: 'Like', icon: thumbsUpOutline },
  { id: 'dislike', label: 'Dislike', icon: thumbsDownOutline },
]

export function resolveIcon(id?: string): string | undefined {
  return iconCatalog.find((option) => option.id === id)?.icon
}
