# GTShop Admin Frontend

Frontend administrativo em Next.js 16 + TypeScript para integrar com um backend existente de automacao de estoque Shopee.

## Stack

- Next.js 16
- App Router
- TypeScript
- React 19
- Tailwind CSS 4

## Funcionalidades

- Login com JWT via `Authorization: Bearer`
- Persistencia de sessao no frontend
- Protecao de rotas privadas
- Tratamento global de `401`
- Dashboard operacional com resumo do sistema
- Edicao das configuracoes de estoque
- Modulo Shopee com conexao, status e refresh manual do token
- Ultima execucao e disparo manual da rotina de estoque
- Estados consistentes de loading, erro, vazio e sucesso

## Setup local

1. Instale dependencias:

```bash
npm install
```

2. Crie o arquivo de ambiente:

```bash
cp .env.example .env.local
```

3. Ajuste a URL da API se necessario:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

4. Rode o projeto:

```bash
npm run dev
```

5. Build de producao local:

```bash
npm run build
npm start
```

## Estrutura

```text
app/
components/
components/ui/
hooks/
lib/
lib/auth/
services/
types/
proxy.ts
```

## Arquitetura

### `app`

Contem as rotas do App Router.

- `/login`
- `/dashboard`
- `/stock`
- `/shopee`
- `/shopee/callback`

### `components`

Contem o shell autenticado, formulario de login e componentes de apresentacao.

### `components/ui`

Contem primitives reutilizaveis como `Button`, `Card`, `Input`, `Alert`, `Badge` e `Spinner`.

### `lib`

Contem utilitarios gerais, constantes, tratamento de erro e cliente HTTP.

### `lib/auth`

Contem a persistencia da sessao e o `AuthProvider` global.

### `services`

Contem a camada centralizada de acesso aos endpoints do backend.

### `hooks`

Contem hooks de dominio para autenticacao, settings, Shopee, health, ultima execucao e execucao manual.

### `types`

Contem tipagens explicitas dos payloads da API.

## Tipos principais

O projeto inclui tipagens explicitas para:

- `AuthUser`
- `LoginRequest`
- `LoginResponse`
- `SettingsResponse`
- `UpdateStockAutomationRequest`
- `ShopeeStatusResponse`
- `LatestJobExecutionResponse`
- `RunNowResponse`
- `ApiErrorResponse`

## Decisao de autenticacao

O frontend persiste o JWT em um cookie acessivel pelo navegador chamado `gtshop_admin_token`.

Motivo da escolha:

- o backend existente ja trabalha com Bearer Token e nao emite cookie HTTP-only para o frontend
- o cookie permite proteger rotas no App Router usando `proxy.ts`
- o token tambem fica acessivel para o cliente HTTP anexar `Authorization: Bearer <token>` automaticamente

Trade-off:

- como o cookie e controlado pelo frontend, ele nao e HTTP-only
- para compensar, a sessao e sempre revalidada com `GET /auth/me`
- qualquer `401` dispara limpeza da sessao e redirecionamento para `/login`

Se no futuro o backend puder emitir cookie seguro HTTP-only, esta e a evolucao natural recomendada.

## Fluxo de autenticacao

1. O usuario faz login em `/login`.
2. O token JWT e persistido no cookie do frontend.
3. O `AuthProvider` valida a sessao com `GET /auth/me`.
4. O `proxy.ts` protege todas as rotas privadas.
5. Em caso de `401`, o cliente HTTP limpa a sessao e o usuario volta para `/login`.

## Fluxo Shopee

1. Em `/shopee`, o botao de conexao chama `GET /shopee/auth/url`.
2. O frontend redireciona o navegador para a URL retornada.
3. A Shopee ou o backend redireciona para `/shopee/callback` com os parametros de retorno.
4. A tela de callback envia esses dados ao backend via `POST /shopee/callback` e exibe uma confirmacao ao usuario.
5. O usuario pode seguir para `/shopee` e conferir o estado atualizado da integracao.

## Cliente HTTP e erros

O cliente HTTP centralizado fica em `lib/api-client.ts`.

Ele faz:

- composicao da URL base via `NEXT_PUBLIC_API_BASE_URL`
- injecao automatica do token nas rotas autenticadas
- parse centralizado de JSON
- lancamento de `ApiError` tipado
- tratamento global de `401`

## Validacao local executada

Os seguintes comandos foram executados com sucesso neste workspace:

```bash
npm run lint
npm run build
```

## Resumo das principais decisoes

- Next.js App Router com shell autenticado separado das rotas publicas
- camada de servicos dedicada para evitar chamadas HTTP dentro das paginas
- hooks de dominio para manter paginas mais enxutas
- cookie JWT pragmatico para permitir persistencia e protecao de rotas
- interface administrativa com sidebar, glass panels e hierarquia visual forte

## Proximos passos curtos

1. Adicionar testes de integracao para fluxos de login e formularios.
2. Evoluir a sessao para cookie HTTP-only se o backend passar a suporta-lo.
3. Adicionar observabilidade de jobs com historico paginado, nao apenas ultima execucao.
