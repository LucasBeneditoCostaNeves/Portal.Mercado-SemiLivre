# PRD: Integração de Autenticação — Portal ↔ API

**Data:** 2026-06-19  
**Branch:** `v0.3.0-integration-backend`  
**Projetos envolvidos:**
- `Portal.Mercado-SemiLivre` (Next.js 15, App Router)
- `Mercado-SemiLivre.api` (NestJS + Prisma + JWT)

---

## Objetivo

Fazer as rotas de **cadastro** (`/cadastro`) e **login** (`/login`) do portal funcionarem de ponta a ponta com o backend, incluindo criação de sessão via JWT armazenado em cookie HTTP-only.

---

## Estado Atual

### Frontend
- Páginas `/login` e `/cadastro` existem com UI e validação client-side funcionando.
- Server Actions (`actions.ts`) validam os campos mas retornam respostas hard-coded — nenhuma chamada ao backend é feita.
- Nenhum cliente HTTP, nenhum gerenciamento de sessão, nenhum `.env.example`.

### Backend
- `POST /login` — autenticação com Passport Local + JWT; retorna `{ acess_token: string }`.
- `POST /users` — criação de usuário; retorna `{ id, name, email, status, createdAt, updatedAt }`.
- Ambos os endpoints são `@Public()` (sem JWT obrigatório).
- JWT dura 30 dias, extraído via `Authorization: Bearer <token>` nas rotas protegidas.

---

## Problemas Identificados

### 1. Campo `profileId` obrigatório no cadastro
O endpoint `POST /users` exige `profileId: UUID`, mas o formulário de cadastro não coleta esse dado — e não deveria. Trata-se de um detalhe de infraestrutura (perfil "usuário padrão") que o frontend deve injetar via variável de ambiente.

**Solução:** A Server Action lê `process.env.USER_PROFILE_ID` e inclui no body. O UUID corresponde ao seed do perfil "usuário" no banco do backend.

### 2. Campos `status` e mapeamento de nomes
- Frontend envia `firstName` → Backend espera `name`.
- Frontend não envia `status` → Backend exige `status: boolean`.

**Solução:** A Server Action mapeia `firstName → name` e injeta `status: true` antes de chamar a API.

### 3. Typo no campo do token
O backend retorna `acess_token` (faltou o `c`). O frontend deve consumir esse campo exatamente como está — **não corrigir aqui** para não quebrar contrato.

### 4. Gerenciamento de sessão ausente
Sem armazenamento do token, rotas protegidas não funcionam e o estado de "logado" não persiste entre requests.

**Solução:** Armazenar JWT em **cookie HTTP-only** via `cookies()` do Next.js dentro da Server Action. Middleware protegerá rotas privadas.

---

## Contratos de API

### `POST /login`

```
Request Body:
  { email: string, password: string }

Response 200:
  { acess_token: string }

Response 401:
  Unauthorized (credenciais inválidas)
```

### `POST /users`

```
Request Body:
  {
    name: string,       // mapeado do campo `firstName` do form
    lastName: string,
    email: string,
    password: string,
    status: boolean,    // sempre `true` para novos usuários
    profileId: string   // UUID do perfil padrão, via env
  }

Response 201:
  { id, name, email, status, createdAt, updatedAt }

Response 400:
  Erro de validação (Zod)

Response 409 / domínio:
  EmailAlreadyInUseError
```

---

## Escopo de Implementação

### Fora do escopo deste PRD
- Etapas 2 e 3 do cadastro (dados pessoais e preferências) — permanecem com TODO.
- Refresh de token / expiração da sessão.
- Recuperação de senha.

---

## Tarefas

### [API] Pré-requisito — Seed do perfil padrão

- [ ] **API-1:** Verificar se existe seed de Profile "usuario" no banco. Se não existir, criar seed com UUID fixo e registrar o UUID no `.env.example` da API como `USER_PROFILE_ID`.

> Esse UUID deve ser igual ao que o frontend vai usar em `USER_PROFILE_ID`.

---

### [Frontend] Infraestrutura

- [ ] **FE-1: Criar `.env.example`**

  ```
  NEXT_PUBLIC_API_URL=http://localhost:3000
  USER_PROFILE_ID=<uuid-do-perfil-usuario>
  ```

  `USER_PROFILE_ID` não tem o prefixo `NEXT_PUBLIC_` — só é acessível server-side (Server Actions).

- [ ] **FE-2: Criar cliente HTTP em `src/lib/http-client.ts`**

  Wrapper sobre `fetch` nativo que:
  - Prefixar toda URL com `process.env.NEXT_PUBLIC_API_URL`
  - Aceitar opções `method`, `body`, `headers` adicionais
  - Retornar tipado via generics: `apiClient<T>(path, options): Promise<T>`

  > Não usar Axios. O `fetch` nativo tem integração com o cache do Next.js.

- [ ] **FE-3: Criar `src/lib/session.ts`**

  Funções:
  ```ts
  setSession(token: string): void    // cookies().set('session', token, { httpOnly: true, secure, sameSite, maxAge: 30d })
  getSession(): string | undefined   // cookies().get('session')?.value
  clearSession(): void               // cookies().delete('session')
  ```

  > Usar `cookies()` do `next/headers` — só funciona em Server Components e Server Actions.

---

### [Frontend] Serviços de autenticação

- [ ] **FE-4: Criar `src/services/auth.service.ts`**

  ```ts
  login(email: string, password: string): Promise<{ acess_token: string }>
  register(data: RegisterApiPayload): Promise<{ id: string; name: string; email: string }>
  ```

  Onde `RegisterApiPayload`:
  ```ts
  {
    name: string
    lastName: string
    email: string
    password: string
    status: boolean
    profileId: string
  }
  ```

  Erros HTTP devem ser propagados como exceções tipadas (ex: `ApiError` com `status` e `message`).

---

### [Frontend] Atualizar Server Actions

- [ ] **FE-5: Atualizar `src/app/login/actions.ts`**

  Após validação bem-sucedida:
  1. Chamar `authService.login(email, password)`
  2. Em sucesso: chamar `setSession(acess_token)` e fazer `redirect('/home')`
  3. Em erro 401: retornar `{ success: false, message: 'E-mail ou senha incorretos.' }`
  4. Em erro de rede/inesperado: retornar `{ success: false, message: 'Erro inesperado. Tente novamente.' }`

  ```ts
  // Antes do return final:
  try {
    const { acess_token } = await authService.login(email, password)
    setSession(acess_token)
    redirect('/home')
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return { success: false, message: 'E-mail ou senha incorretos.' }
    }
    return { success: false, message: 'Erro inesperado. Tente novamente.' }
  }
  ```

- [ ] **FE-6: Atualizar `src/app/cadastro/actions.ts` — função `registerWithEmail`**

  Após validação bem-sucedida:
  1. Montar payload com mapeamento `firstName → name`, `status: true`, `profileId: process.env.USER_PROFILE_ID`
  2. Chamar `authService.register(payload)`
  3. Em sucesso: retornar `{ success: true }` (redirecionar para próximo passo ou login)
  4. Em erro de e-mail duplicado (domínio ou 409/400 com mensagem): retornar erro específico no campo `email`
  5. Em erro inesperado: retornar `{ success: false, message: 'Erro inesperado. Tente novamente.' }`

  > O campo `RegisterFormState` pode precisar de `message?: string` para erros de nível global — verificar se já existe.

---

### [Frontend] Middleware de rotas protegidas

- [ ] **FE-7: Criar `src/middleware.ts`**

  Proteger rotas privadas (ex: `/home`, `/perfil`, `/anuncios`) redirecionando para `/login` se não houver sessão:

  ```ts
  import { NextResponse } from 'next/server'
  import type { NextRequest } from 'next/server'

  const PRIVATE_ROUTES = ['/home', '/perfil', '/anuncios']

  export function middleware(request: NextRequest) {
    const session = request.cookies.get('session')
    const isPrivate = PRIVATE_ROUTES.some(r => request.nextUrl.pathname.startsWith(r))

    if (isPrivate && !session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  export const config = {
    matcher: ['/home/:path*', '/perfil/:path*', '/anuncios/:path*'],
  }
  ```

---

## Tratamento de Erros

| Cenário | Status HTTP | Resposta ao usuário |
|---|---|---|
| Credenciais inválidas (login) | 401 | "E-mail ou senha incorretos." |
| E-mail já cadastrado (cadastro) | 400/409 | Erro no campo e-mail |
| Validação Zod falha (cadastro) | 400 | Erro no campo específico |
| Backend fora do ar | Network error | "Erro inesperado. Tente novamente." |
| `USER_PROFILE_ID` não configurado | — | Lançar erro em build/startup |

---

## Ordem de Execução Recomendada

1. `API-1` — seed do perfil (pré-requisito para tudo)
2. `FE-1` — `.env.example` e `.env.local`
3. `FE-2` — cliente HTTP
4. `FE-3` — gerenciamento de sessão
5. `FE-4` — serviço de autenticação
6. `FE-5` — action de login (mais simples, bom para validar a integração)
7. `FE-6` — action de cadastro (mais complexo pelo mapeamento de campos)
8. `FE-7` — middleware (habilitar rotas protegidas)

---

## Checklist de Testes Manuais

- [X] Cadastrar novo usuário → verificar criação no banco
- [ ] Tentar cadastrar com e-mail já existente → ver erro no campo
- [ ] Login com credenciais corretas → cookie `session` criado, redireciona para `/home`
- [ ] Login com senha errada → mensagem de erro
- [ ] Acessar rota protegida sem cookie → redireciona para `/login`
- [ ] Acessar rota protegida com cookie → acesso permitido
