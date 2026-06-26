## Purpose

Define o comportamento do `CadastroWizard` — o componente orquestrador do fluxo de cadastro multi-passo. Cobre a renderização de cada passo, navegação entre passos, conteúdo do painel de marketing e do banner mobile por passo.

## Requirements

### Requirement: Renderização do passo 3
O passo 3 do `CadastroWizard` SHALL renderizar o componente `PreferencesForm` com a prop `onSuccess`, que ao ser chamada redireciona para `/` via `useRouter().push('/')`.

#### Scenario: Passo 3 renderiza PreferencesForm
- **WHEN** `step === 3`
- **THEN** o wizard renderiza `<PreferencesForm onSuccess={handleStep3Success} />` no lugar do placeholder

#### Scenario: onSuccess do passo 3 redireciona para home
- **WHEN** `PreferencesForm` chama `onSuccess()`
- **THEN** `router.push('/')` é executado e o usuário navega para a home

---

### Requirement: Textos do passo 3 no MarketingPanel
O `MarketingPanel` SHALL exibir textos específicos do passo 3 quando `step === 3`:
- Headline: "Você está quase lá! Personalize sua experiência"
- Subtexto: "Escolha suas categorias favoritas e receba ofertas e recomendações personalizadas."
- Checklist com passos 1 e 2 marcados como concluídos e passo 3 como em andamento.

#### Scenario: MarketingPanel no passo 3
- **WHEN** `step === 3`
- **THEN** o painel esquerdo exibe a headline de personalização e o checklist com os dois primeiros passos concluídos

---

### Requirement: Textos do passo 3 no MobileMarketingBanner
O `MobileMarketingBanner` SHALL exibir o título "Quase lá!" e subtítulo "Passo 3 de 3 — preferências" quando `step === 3`.

#### Scenario: MobileMarketingBanner no passo 3
- **WHEN** `step === 3` em viewport mobile
- **THEN** o banner exibe "Quase lá!" e "Passo 3 de 3 — preferências"

---

### Requirement: Link para login no RegisterForm
O `RegisterForm` (step-1 do cadastro) SHALL exibir um link "Já tem conta? Entrar" que navega para `/login`, permitindo que usuários existentes acessem a página de autenticação diretamente a partir do fluxo de cadastro.

#### Scenario: Link para login está presente no step-1
- **WHEN** o usuário visualiza o step-1 do cadastro (`RegisterForm`)
- **THEN** um link "Entrar" (ou equivalente) está visível e navega para `/login` ao ser clicado

---

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

---

### Requirement: ThemeToggle presente nas páginas de cadastro
O `CadastroWizard` SHALL renderizar o `ThemeToggle` no canto superior direito do painel do formulário, visível em todas as viewports e em todos os passos do wizard.

#### Scenario: Toggle visível em desktop em qualquer passo
- **WHEN** o usuário está em qualquer passo do cadastro em viewport `>= lg`
- **THEN** o `ThemeToggle` é exibido no painel do formulário (coluna direita), acessível

#### Scenario: Toggle visível em mobile em qualquer passo
- **WHEN** o usuário está em qualquer passo do cadastro em viewport `< lg`
- **THEN** o `ThemeToggle` é exibido no painel do formulário, acessível (o `MobileMarketingBanner` não deve ocultar o toggle)

---

### Requirement: Wizard adapta cores ao tema ativo
Todos os elementos do `CadastroWizard` que não usam as cores de marca fixas SHALL usar os tokens de tema (`--color-bg-primary`, `--color-bg-secondary`, `--color-text-primary`, `--color-text-secondary`, `--color-border`), adaptando visualmente ao dark ou light mode em todos os passos.

#### Scenario: Painel de marketing mantém fundo amarelo em ambos os temas
- **WHEN** o tema ativo é `light` ou `dark`
- **THEN** o `MarketingPanel` mantém fundo `--color-brand` (`#FFE600`) com texto escuro `--color-brand-dark`

#### Scenario: Painel do formulário adapta ao tema
- **WHEN** o tema ativo é `light`
- **THEN** o painel do formulário usa fundo `--color-bg-primary` (`#ffffff`) e texto `--color-text-primary` (`#18181b`)

#### Scenario: Campos e checklist do wizard adaptam ao tema
- **WHEN** o tema ativo muda durante a navegação entre passos
- **THEN** os campos de input, bordas e textos secundários do checklist atualizam conforme os tokens de tema
