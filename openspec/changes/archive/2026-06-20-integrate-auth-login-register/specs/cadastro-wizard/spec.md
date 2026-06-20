## ADDED Requirements

### Requirement: Server Action registerWithEmail persiste usuário via API
A Server Action `registerWithEmail` SHALL, após validação bem-sucedida dos campos do step 1, chamar `authService.register()` com o payload mapeado: `name` (a partir de `firstName`), `lastName`, `email`, `password`, `status: true`, e `profileId` lido de `process.env.USER_PROFILE_ID`. Em caso de sucesso, SHALL retornar `{ success: true }`. Em caso de e-mail já cadastrado, SHALL retornar erro no campo `email`. Em caso de erro inesperado, SHALL retornar `{ success: false, message: "Erro inesperado. Tente novamente." }`.

#### Scenario: Cadastro bem-sucedido retorna success
- **WHEN** o usuário preenche os campos do step 1 com dados válidos e únicos e submete o formulário
- **THEN** `registerWithEmail` chama a API e retorna `{ success: true }`

#### Scenario: E-mail duplicado exibe erro no campo
- **WHEN** o usuário tenta cadastrar com um e-mail já existente na base
- **THEN** a ação retorna `errors.email` com mensagem indicando que o e-mail já está em uso

#### Scenario: Mapeamento correto dos campos do formulário para o contrato da API
- **WHEN** o formulário é submetido com `firstName: "João"`, `lastName: "Silva"`, `email: "joao@example.com"`, `password: "senha123"`
- **THEN** a chamada para `authService.register` recebe `{ name: "João", lastName: "Silva", email: "joao@example.com", password: "senha123", status: true, profileId: "<valor de USER_PROFILE_ID>" }`
