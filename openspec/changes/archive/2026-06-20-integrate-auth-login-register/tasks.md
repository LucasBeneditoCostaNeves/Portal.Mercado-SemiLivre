## 1. Pré-requisito: API

- [x] 1.1 Verificar se existe seed do perfil "usuário padrão" no banco da API (`Mercado-SemiLivre.api`); criar se necessário com UUID fixo
- [x] 1.2 Adicionar `USER_PROFILE_ID=<uuid>` ao `.env.example` da API com o UUID do perfil criado

## 2. Configuração de Ambiente (Portal)

- [x] 2.1 Criar `.env.example` na raiz do portal com `NEXT_PUBLIC_API_URL=http://localhost:3000` e `USER_PROFILE_ID=<uuid>`
- [x] 2.2 Criar `.env.local` com os valores reais para desenvolvimento local

## 3. Cliente HTTP

- [x] 3.1 Criar `src/lib/http-client.ts` com a classe/tipo `ApiError` (campos `status: number` e `message: string`)
- [x] 3.2 Implementar `apiClient<T>(path, options?)` que prefixe `NEXT_PUBLIC_API_URL`, envie `Content-Type: application/json`, deserialize a resposta como `T` e lance `ApiError` para status não-2xx

## 4. Gerenciamento de Sessão

- [x] 4.1 Criar `src/lib/session.ts` com `setSession(token: string)` usando `cookies().set` com flags `httpOnly`, `secure` (somente em produção), `sameSite: "lax"`, `maxAge: 30 dias`, `path: "/"`
- [x] 4.2 Implementar `getSession(): string | undefined` retornando `cookies().get("session")?.value`
- [x] 4.3 Implementar `clearSession()` chamando `cookies().delete("session")`

## 5. Serviço de Autenticação

- [x] 5.1 Criar `src/services/auth.service.ts` com o tipo `RegisterApiPayload` (`name`, `lastName`, `email`, `password`, `status`, `profileId`)
- [x] 5.2 Implementar `authService.login(email, password)` chamando `POST /login` e retornando `{ acess_token: string }`
- [x] 5.3 Implementar `authService.register(payload: RegisterApiPayload)` chamando `POST /users` e retornando o objeto de usuário criado

## 6. Server Action: Login

- [x] 6.1 Atualizar `src/app/login/actions.ts`: após validação, chamar `authService.login`, chamar `setSession(acess_token)` em sucesso e `redirect("/home")`
- [x] 6.2 Tratar `ApiError` com `status === 401` retornando `{ success: false, message: "E-mail ou senha incorretos." }`
- [x] 6.3 Tratar erros inesperados/de rede retornando `{ success: false, message: "Erro inesperado. Tente novamente." }`

## 7. Server Action: Cadastro

- [x] 7.1 Atualizar `src/app/cadastro/actions.ts`: após validação, verificar `process.env.USER_PROFILE_ID`; retornar erro de configuração se ausente
- [x] 7.2 Montar payload mapeando `firstName → name`, `status: true`, `profileId: process.env.USER_PROFILE_ID` e chamar `authService.register(payload)`
- [x] 7.3 Tratar `ApiError` de e-mail duplicado retornando `errors.email` com mensagem adequada
- [x] 7.4 Tratar erros inesperados retornando `{ success: false, message: "Erro inesperado. Tente novamente." }`
- [x] 7.5 Verificar se `RegisterFormState` suporta `message?: string` de nível global; adicionar ao tipo se necessário

## 8. Middleware de Rotas

- [x] 8.1 Criar `src/middleware.ts` que leia `request.cookies.get("session")` e redirecione para `/login` quando ausente nas rotas privadas
- [x] 8.2 Configurar `export const config` com `matcher` cobrindo `/home/:path*`, `/perfil/:path*`, `/anuncios/:path*` (ajustar conforme rotas existentes no projeto)

## 9. Validação Manual

- [X] 9.1 Cadastrar novo usuário com dados válidos e verificar criação no banco via API
- [X] 9.2 Tentar cadastrar com e-mail já existente e verificar erro no campo
- [X] 9.3 Fazer login com credenciais corretas e verificar cookie `session` no browser e redirecionamento para `/home`
- [X] 9.4 Fazer login com senha errada e verificar mensagem "E-mail ou senha incorretos."
- [X] 9.5 Acessar `/home` sem cookie e verificar redirecionamento para `/login`
- [X] 9.6 Acessar `/home` com cookie válido e verificar que o acesso é permitido
