## Why

As rotas `/login` e `/cadastro` do portal existem visualmente, mas as Server Actions retornam respostas hard-coded — nenhum usuário real consegue se autenticar ou criar conta. A API (`Mercado-SemiLivre.api`) já possui os endpoints `POST /login` e `POST /users` prontos para consumo; o que falta é a camada de integração no portal.

## What Changes

- A Server Action `loginWithEmail` passa a chamar `POST /login` na API, armazenar o JWT retornado em cookie HTTP-only e redirecionar para `/home` em caso de sucesso
- A Server Action `registerWithEmail` passa a chamar `POST /users` na API, mapeando os campos do formulário para o contrato da API (`firstName → name`, `status: true`, `profileId` via env)
- Novo cliente HTTP nativo (`fetch`) centralizado para todas as chamadas à API
- Novo utilitário de sessão para leitura/escrita do cookie JWT
- Novo `middleware.ts` do Next.js para proteger rotas privadas, redirecionando para `/login` quando não há sessão

## Capabilities

### New Capabilities
- `auth-session`: Gerenciamento de sessão JWT via cookie HTTP-only — funções de set/get/clear e middleware de proteção de rotas
- `auth-service`: Cliente HTTP e serviço de autenticação — wrapper sobre `fetch` nativo e chamadas tipadas para `POST /login` e `POST /users`

### Modified Capabilities
- `login-page`: O requisito "Server Action loginWithEmail (stub)" é substituído por integração real com o backend — sucesso redireciona para `/home`, falha exibe mensagem de erro da API
- `cadastro-wizard`: O step 1 (`registerWithEmail`) passa a persistir o usuário via API em vez de retornar resposta simulada

## Impact

- `src/app/login/actions.ts` — integração com `authService.login`, chamada a `setSession`, `redirect`
- `src/app/cadastro/actions.ts` — integração com `authService.register`, mapeamento de campos
- `src/lib/http-client.ts` — novo (wrapper fetch com base URL)
- `src/lib/session.ts` — novo (cookie HTTP-only com `next/headers`)
- `src/services/auth.service.ts` — novo (chamadas tipadas à API)
- `src/middleware.ts` — novo (proteção de rotas privadas)
- `.env.example` — novo (`NEXT_PUBLIC_API_URL`, `USER_PROFILE_ID`)
- **Dependência externa**: `Mercado-SemiLivre.api` precisa ter o perfil "usuário padrão" seedado no banco com UUID conhecido
