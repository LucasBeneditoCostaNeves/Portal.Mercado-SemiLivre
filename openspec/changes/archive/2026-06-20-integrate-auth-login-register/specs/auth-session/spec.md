## ADDED Requirements

### Requirement: Armazenar token JWT em cookie HTTP-only após login
Após autenticação bem-sucedida, o sistema SHALL persistir o token JWT retornado pela API em um cookie HTTP-only chamado `session`, com `sameSite: "lax"`, `path: "/"`, `maxAge` de 30 dias, e `secure: true` apenas em produção (`NODE_ENV === "production"`).

#### Scenario: Cookie criado após login bem-sucedido
- **WHEN** a Server Action `loginWithEmail` recebe resposta 200 da API com `acess_token`
- **THEN** um cookie `session` HTTP-only é criado no navegador com o valor do token e validade de 30 dias

#### Scenario: Cookie não acessível via JavaScript
- **WHEN** o cookie `session` está presente
- **THEN** `document.cookie` não expõe o cookie `session` (flag `httpOnly`)

---

### Requirement: Leitura de sessão server-side
O utilitário `getSession()` (em `src/lib/session.ts`) SHALL retornar o valor do cookie `session` quando presente, ou `undefined` quando ausente. Deve ser chamado exclusivamente em contextos server-side (Server Actions, Server Components, middleware).

#### Scenario: Sessão presente retorna token
- **WHEN** o cookie `session` existe com valor de um JWT
- **THEN** `getSession()` retorna a string do token

#### Scenario: Sessão ausente retorna undefined
- **WHEN** o cookie `session` não existe
- **THEN** `getSession()` retorna `undefined`

---

### Requirement: Remoção de sessão (logout)
O utilitário `clearSession()` SHALL remover o cookie `session`, efetivamente encerrando a sessão do usuário no portal.

#### Scenario: Cookie removido ao chamar clearSession
- **WHEN** `clearSession()` é chamado
- **THEN** o cookie `session` é deletado e `getSession()` passa a retornar `undefined`

---

### Requirement: Middleware de proteção de rotas privadas
O `src/middleware.ts` SHALL interceptar requisições para rotas privadas (ex: `/home`, `/perfil`, `/anuncios` e seus sub-paths) e redirecionar para `/login` quando o cookie `session` estiver ausente. Rotas públicas (`/login`, `/cadastro`, `/`) não devem ser afetadas.

#### Scenario: Acesso a rota privada sem sessão redireciona para login
- **WHEN** um usuário sem cookie `session` acessa `/home`
- **THEN** o middleware redireciona para `/login`

#### Scenario: Acesso a rota privada com sessão é permitido
- **WHEN** um usuário com cookie `session` válido acessa `/home`
- **THEN** a requisição passa pelo middleware sem redirecionamento

#### Scenario: Rotas públicas não são afetadas pelo middleware
- **WHEN** qualquer usuário acessa `/login` ou `/cadastro`
- **THEN** o middleware não interfere, independentemente da presença ou ausência de sessão
