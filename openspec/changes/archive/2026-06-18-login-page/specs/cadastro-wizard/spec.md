## ADDED Requirements

### Requirement: Link para login no RegisterForm
O `RegisterForm` (step-1 do cadastro) SHALL exibir um link "Já tem conta? Entrar" que navega para `/login`, permitindo que usuários existentes acessem a página de autenticação diretamente a partir do fluxo de cadastro.

#### Scenario: Link para login está presente no step-1
- **WHEN** o usuário visualiza o step-1 do cadastro (`RegisterForm`)
- **THEN** um link "Entrar" (ou equivalente) está visível e navega para `/login` ao ser clicado
