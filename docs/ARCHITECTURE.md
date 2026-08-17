# Arquitetura

## Fluxo de dados

1. `DashboardRepository` lê e normaliza o estado persistido.
2. `usePersistentDashboard` mantém o estado da sessão e grava alterações.
3. `App` coordena criação, edição e seleção de período.
4. Componentes recebem dados e callbacks tipados; não acessam `localStorage`.
5. Funções puras do domínio validam, calculam e reordenam dados.
6. `dashboardExport` produz um snapshot versionado que pode ser baixado como JSON.

## Compatibilidade

O repositório converte cards antigos sem `kind` para `indicator` e converte notas que armazenavam a descrição em `caption`. Essa normalização permite evoluir os modelos sem apagar dados existentes.

## Estratégia de testes

- Domínio: cálculos, validação, criação, atualização e reordenação.
- Datas: serialização local, intervalo padrão, validação e apresentação.
- Infraestrutura: persistência, recuperação de JSON inválido e migração legada.

Novas regras devem ser implementadas primeiro como funções puras no domínio e cobertas por testes antes da integração visual.
