## ADDED Requirements

### Requirement: ThemeToggle renderiza botão de alternância de tema
O `ThemeToggle` SHALL ser um Client Component que consome o contexto do `ThemeProvider` e renderiza um `<button>` que, ao ser clicado, chama `toggleTheme()`. O botão SHALL exibir um ícone de sol (`ti-sun`) quando o tema ativo for `dark` (indicando que clicar ativará o light mode) e um ícone de lua (`ti-moon`) quando o tema ativo for `light`.

#### Scenario: Ícone correto para dark mode ativo
- **WHEN** o tema ativo é `dark`
- **THEN** o botão exibe o ícone de sol (`ti-sun`)

#### Scenario: Ícone correto para light mode ativo
- **WHEN** o tema ativo é `light`
- **THEN** o botão exibe o ícone de lua (`ti-moon`)

#### Scenario: Clique no botão alterna o tema
- **WHEN** o usuário clica no `ThemeToggle`
- **THEN** o tema é alternado entre `dark` e `light`, o ícone é atualizado e a mudança visual é aplicada imediatamente em toda a página

---

### Requirement: ThemeToggle presente em todas as páginas do app
Todas as páginas do Portal SHALL incluir o `ThemeToggle` em local visível e acessível:
- **Home**: canto direito da `Navbar`, ao lado das ações de usuário (Pedidos, Carrinho)
- **Login**: canto superior direito do painel do formulário de autenticação
- **Cadastro**: canto superior direito do painel do formulário de cadastro

#### Scenario: Toggle visível na home page
- **WHEN** o usuário acessa a home page
- **THEN** o `ThemeToggle` está visível na Navbar, no canto direito

#### Scenario: Toggle visível na página de login
- **WHEN** o usuário acessa `/login`
- **THEN** o `ThemeToggle` está visível no painel do formulário, acessível independente da viewport

#### Scenario: Toggle visível na página de cadastro
- **WHEN** o usuário acessa `/cadastro`
- **THEN** o `ThemeToggle` está visível no painel do formulário, acessível independente da viewport

---

### Requirement: ThemeToggle acessível via teclado
O `ThemeToggle` SHALL ser um elemento `<button>` nativo com `aria-label` descritivo ("Ativar modo claro" ou "Ativar modo escuro" conforme o tema atual), permitindo navegação e ativação via teclado.

#### Scenario: aria-label reflete a ação a ser executada
- **WHEN** o tema ativo é `dark`
- **THEN** o botão tem `aria-label="Ativar modo claro"`

#### Scenario: Ativação via teclado
- **WHEN** o botão está focado e o usuário pressiona `Enter` ou `Space`
- **THEN** o tema é alternado, equivalente ao clique com mouse
