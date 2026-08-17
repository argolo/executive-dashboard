# Painel Executivo

Dashboard responsivo de KPIs construído com Ionic React e TypeScript. Permite criar indicadores e notas, configurar gráficos de rosca, reorganizar cards e KPIs auxiliares por arrastar e soltar e selecionar o período de análise. O estado é persistido localmente no navegador.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Desenvolvimento

```bash
npm install
npm run dev
```

O Vite exibirá o endereço local da aplicação no terminal.

## Qualidade

```bash
npm run typecheck   # validação TypeScript
npm run lint        # análise estática
npm run format      # formatação automática
npm test            # testes unitários
npm run test:watch  # testes durante desenvolvimento
npm run coverage    # relatório de cobertura
npm run build       # build de produção
npm run check       # formato, lint, tipos, testes e build
```

## Funcionalidades

- Grade responsiva com quatro colunas no desktop.
- Indicadores com valor principal, legenda, KPIs auxiliares e rosca opcional.
- Notas com título, descrição multilinha e ícone.
- Reordenação por drag-and-drop.
- Intervalo de data e hora editável.
- Exportação do painel como JSON versionado.
- Importação de um JSON exportado anteriormente, com validação antes de aplicar os dados.
- Modo Apresentação sem controles ou reordenação; pressione `Esc` para sair.
- Persistência em `localStorage`, incluindo migração do formato legado.
- Estado inicial com seis indicadores demonstrativos.

## Arquitetura

```text
src/
├── app/             composição e fluxo principal
├── components/      dashboard, formulários, modais e componentes compartilhados
├── data/            dados demonstrativos
├── domain/          tipos, regras e operações puras
├── hooks/           estado e orquestração da persistência
├── infrastructure/ acesso ao armazenamento do navegador
├── styles/          tokens e estilos por responsabilidade
└── ui/              catálogo de ícones
```

As regras de negócio não dependem de React ou Ionic. Essa separação permite testes rápidos e mantém a camada visual focada em apresentação e interação.

## Persistência

Os dados permanecem no navegador atual. Não há backend, autenticação ou sincronização entre dispositivos. As chaves utilizadas estão centralizadas em `src/infrastructure/dashboardRepository.ts`.

## Licença

Uso interno. Projetado por [argolo.dev](https://argolo.dev).
