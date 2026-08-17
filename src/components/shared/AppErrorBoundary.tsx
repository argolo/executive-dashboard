import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

/** Última barreira contra falhas de renderização, evitando uma tela branca silenciosa. */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Falha ao iniciar o painel:', error, info)
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children
    return (
      <main className="startup-error">
        <h1>Não foi possível carregar o painel</h1>
        <p>{this.state.error.message}</p>
        <button onClick={() => location.reload()}>Tentar novamente</button>
      </main>
    )
  }
}
