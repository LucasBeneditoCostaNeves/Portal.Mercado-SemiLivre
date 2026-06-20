## Context

O portal usa Next.js 15 App Router com Server Actions para mutações. O backend (`Mercado-SemiLivre.api`) expõe `POST /login` (retorna JWT Bearer) e `POST /users` (cria usuário). Nenhuma das duas rotas exige autenticação prévia (`@Public()`). O JWT tem validade de 30 dias e é extraído via header `Authorization: Bearer <token>` nas rotas protegidas da API.

Estado atual: as Server Actions `loginWithEmail` e `registerWithEmail` validam campos no servidor mas retornam respostas fixas, sem persistência.

Restrição de dependência: o campo `profileId` (UUID, obrigatório em `POST /users`) não vem do formulário — deve ser provido pelo ambiente (`USER_PROFILE_ID`). O perfil "usuário padrão" precisa estar seedado na API antes do portal funcionar.

## Goals / Non-Goals

**Goals:**
- `loginWithEmail` chama `POST /login`, persiste o token em cookie HTTP-only, redireciona para `/home`
- `registerWithEmail` chama `POST /users` com campo mapeado e dados de ambiente
- Rotas privadas bloqueadas por middleware quando não há sessão
- Erros HTTP da API traduzidos para mensagens amigáveis no formulário

**Non-Goals:**
- Refresh de token / rotação de sessão
- Login com Google OAuth
- Passos 2 e 3 do cadastro (dados pessoais e preferências)
- Recuperação de senha
- Proteção de endpoints da própria API (responsabilidade do backend)

## Decisions

### D1 — Cookie HTTP-only para armazenar o JWT

**Decisão:** Armazenar o token em cookie HTTP-only via `cookies()` do `next/headers` dentro da Server Action.

**Alternativas consideradas:**
- `localStorage`: acessível a scripts, vulnerável a XSS. Descartado.
- `sessionStorage`: mesmo problema do localStorage, perdido ao fechar aba. Descartado.
- Cookie com `js-cookie` client-side: não HTTP-only por padrão; requer `"use client"`. Descartado.

**Rationale:** Cookie HTTP-only é inacessível ao JavaScript do browser (proteção XSS), lido automaticamente pelo middleware do Next.js (`request.cookies`) e lido em Server Components/Actions via `cookies()` sem IR ao client.

Configuração do cookie:
```
name: "session"
httpOnly: true
secure: true em produção (NODE_ENV === "production")
sameSite: "lax"
maxAge: 60 * 60 * 24 * 30  (30 dias — espelha validade do JWT)
path: "/"
```

---

### D2 — `fetch` nativo como cliente HTTP (sem Axios)

**Decisão:** Wrapper fino sobre `fetch` nativo com prefixo de `NEXT_PUBLIC_API_URL`.

**Alternativas consideradas:**
- Axios: biblioteca extra sem benefício real; perde integração nativa com o cache do Next.js.

**Rationale:** O `fetch` nativo é estendido pelo Next.js para suportar `cache`, `revalidate` e tags de cache. Axios contorna essa extensão. Manter `fetch` garante que, no futuro, chamadas GET possam se beneficiar de cache server-side sem mudança de cliente.

Interface mínima:
```ts
apiClient<T>(path: string, options?: RequestInit): Promise<T>
```
Lança `ApiError` (com `status: number` e `message: string`) para respostas HTTP fora da faixa 2xx.

---

### D3 — Middleware do Next.js para proteção de rotas

**Decisão:** `src/middleware.ts` lê o cookie `session` via `request.cookies` e redireciona para `/login` se ausente nas rotas privadas.

**Alternativas consideradas:**
- Verificação em cada layout/page Server Component: funciona, mas duplica lógica e não bloqueia a renderização antes do fetch de dados.
- Middleware com verificação JWT criptográfica: mais seguro, mas exige expor `JWT_SECRET` no edge; desnecessário no escopo atual.

**Rationale:** O middleware executa antes de qualquer renderização e cobre todas as rotas filhas por pattern matching em `config.matcher`. A verificação é apenas presença do cookie (sem validar assinatura) — a API rejeita tokens inválidos ou expirados quando rotas protegidas forem chamadas.

---

### D4 — Mapeamento de campos no cadastro dentro da Server Action

**Decisão:** A Server Action faz o mapeamento `firstName → name` e injeta `status: true` e `profileId: process.env.USER_PROFILE_ID` antes de chamar o serviço.

**Alternativas consideradas:**
- Mudar o backend para aceitar `firstName`: introduz breaking change na API e acoplamento desnecessário.
- Mover mapeamento para o `auth.service.ts`: o serviço ficaria acoplado ao contrato do formulário, não ao contrato da API.

**Rationale:** A Server Action é a fronteira entre "o que o formulário coleta" e "o que a API espera". O serviço (`auth.service.ts`) deve falar apenas o contrato da API.

---

### D5 — Tratamento do typo `acess_token` no contrato da API

**Decisão:** Consumir `acess_token` (sem segundo `c`) exatamente como retornado pela API, sem wrapper/alias.

**Rationale:** Corrigir o campo no frontend (renomeando para `access_token`) criaria divergência silenciosa com a API atual. A correção deve acontecer no backend via breaking change coordenada. Por ora, o tipo reflete o contrato real.

## Risks / Trade-offs

- **`USER_PROFILE_ID` não configurado** → A Server Action lança erro em runtime na primeira tentativa de cadastro. Mitigação: validar variável em startup (ex: em `src/lib/env.ts`) e falhar rápido com mensagem clara.

- **Cookie sem validação de assinatura no middleware** → Um cookie forjado com qualquer valor passa pelo middleware mas falha nas chamadas à API (401). Risco aceitável no escopo atual; mitigação futura é verificar a assinatura JWT no edge com `jose`.

- **CORS** → O Next.js chama a API server-side (dentro de Server Actions), não do browser — CORS não é relevante aqui. Se no futuro houver chamadas client-side, precisará ser endereçado na API.

- **`acess_token` typo** → Risco de quebra silenciosa se o backend corrigir o typo sem coordenação. Mitigação: tipagem explícita em `auth.service.ts` centraliza o impacto em um único ponto.

## Migration Plan

1. Seed do perfil "usuário padrão" na API (pré-requisito; feito na API, não no portal)
2. Adicionar `.env.local` com `NEXT_PUBLIC_API_URL` e `USER_PROFILE_ID`
3. Implementar novos arquivos (`http-client`, `session`, `auth.service`, `middleware`)
4. Atualizar Server Actions
5. Testar fluxo completo manualmente (checklist no PRD)

**Rollback:** Reverter as alterações nas Server Actions restaura o comportamento de stub anterior. Os novos arquivos (`lib/`, `services/`, `middleware.ts`) são aditivos e não quebram nada se presentes sem uso.

## Open Questions

- **Q1:** Qual é o UUID do perfil "usuário padrão" na API? Precisa ser definido e seedado antes da implementação. O `.env.example` da API deve incluir `USER_PROFILE_ID`.
- **Q2:** Para onde redirecionar após o cadastro bem-sucedido? O step 2 (dados pessoais) ainda não tem integração. Por ora, redirecionar para `/login` com mensagem de sucesso é seguro.
