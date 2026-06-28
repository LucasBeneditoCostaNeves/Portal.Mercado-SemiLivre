## Purpose

Define o cliente HTTP centralizado e os serviços de autenticação (login e cadastro) que intermediam a comunicação entre o portal e a API backend.

## Requirements

### Requirement: Cliente HTTP centralizado com prefixo de URL
O `apiClient<T>` (em `src/lib/http-client.ts`) SHALL prefixar toda URL de path com `process.env.NEXT_PUBLIC_API_URL`, enviar o body serializado como JSON com `Content-Type: application/json`, e retornar o JSON deserializado tipado como `T`. Para respostas com status fora de 2xx, SHALL lançar um `ApiError` com `status` e `message` extraídos da resposta.

#### Scenario: Requisição bem-sucedida retorna dados tipados
- **WHEN** `apiClient<{ id: string }>("/users", { method: "POST", body: ... })` é chamado e a API retorna 201
- **THEN** a função retorna o objeto deserializado tipado como `{ id: string }`

#### Scenario: Resposta não-2xx lança ApiError
- **WHEN** a API retorna status 401 ou 400
- **THEN** `apiClient` lança `ApiError` com `status` igual ao código HTTP e `message` extraída do corpo da resposta

#### Scenario: Erro de rede lança exceção
- **WHEN** a API está inacessível (timeout, DNS, recusa de conexão)
- **THEN** `apiClient` propaga a exceção de rede (não a engole)

---

### Requirement: Serviço de login via API
A função `authService.login(email, password)` (em `src/services/auth.service.ts`) SHALL chamar `POST /login` via `apiClient`, enviar `{ email, password }` no body, e retornar `{ acess_token: string }` em caso de sucesso.

#### Scenario: Login bem-sucedido retorna token
- **WHEN** `authService.login("user@example.com", "senha123")` é chamado com credenciais válidas
- **THEN** a função retorna `{ acess_token: "<jwt>" }`

#### Scenario: Credenciais inválidas propagam ApiError 401
- **WHEN** `authService.login` é chamado com credenciais inválidas
- **THEN** a função lança `ApiError` com `status: 401`

---

### Requirement: Serviço de cadastro via API
A função `authService.register(payload)` SHALL chamar `POST /users` via `apiClient`, enviar o payload completo no body (incluindo `name`, `lastName`, `email`, `password`, `status`, `profileId`), e retornar `{ id, name, email, status, createdAt, updatedAt }` em caso de sucesso.

#### Scenario: Cadastro bem-sucedido retorna dados do usuário criado
- **WHEN** `authService.register({ name: "João", lastName: "Silva", email: "joao@example.com", password: "senha123", status: true, profileId: "<uuid>" })` é chamado
- **THEN** a função retorna o objeto com `id`, `name`, `email`, `status`, `createdAt`, `updatedAt`

#### Scenario: E-mail já cadastrado propaga ApiError
- **WHEN** `authService.register` é chamado com um e-mail já existente no banco
- **THEN** a função lança `ApiError` com status 400 ou 409 e mensagem indicando e-mail duplicado

---

### Requirement: Variável de ambiente USER_PROFILE_ID obrigatória
O sistema SHALL falhar de forma explícita e imediata se `process.env.USER_PROFILE_ID` não estiver definida quando `registerWithEmail` for chamada. A mensagem de erro SHALL identificar a variável ausente.

#### Scenario: Variável ausente lança erro descritivo
- **WHEN** `registerWithEmail` é chamada e `process.env.USER_PROFILE_ID` é `undefined` ou vazia
- **THEN** a função retorna `{ success: false, message: "Configuração interna ausente. Contate o administrador." }` sem chamar a API
