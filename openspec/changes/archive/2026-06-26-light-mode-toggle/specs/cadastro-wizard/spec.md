## ADDED Requirements

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
