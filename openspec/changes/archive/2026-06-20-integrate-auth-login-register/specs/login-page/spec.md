## MODIFIED Requirements

### Requirement: Server Action loginWithEmail integrada ao backend
A Server Action `loginWithEmail` SHALL, após validação bem-sucedida dos campos, chamar `authService.login(email, password)`. Em caso de sucesso, SHALL armazenar o token retornado via `setSession(acess_token)` e redirecionar o usuário para `/home` via `redirect()`. Em caso de falha com status 401, SHALL retornar `{ success: false, message: "E-mail ou senha incorretos." }`. Em caso de erro de rede ou inesperado, SHALL retornar `{ success: false, message: "Erro inesperado. Tente novamente." }`.

#### Scenario: Login bem-sucedido redireciona para /home
- **WHEN** o usuário submete e-mail e senha válidos que a API aceita
- **THEN** o cookie `session` é criado e o usuário é redirecionado para `/home`

#### Scenario: Credenciais inválidas exibem mensagem de erro
- **WHEN** o usuário submete e-mail e senha válidos no formato mas que a API rejeita (401)
- **THEN** a ação retorna `{ success: false, message: "E-mail ou senha incorretos." }` e o formulário exibe a mensagem sem recarregar a página

#### Scenario: Erro de rede exibe mensagem genérica
- **WHEN** a API está inacessível ao submeter o formulário
- **THEN** a ação retorna `{ success: false, message: "Erro inesperado. Tente novamente." }` e o formulário exibe a mensagem
