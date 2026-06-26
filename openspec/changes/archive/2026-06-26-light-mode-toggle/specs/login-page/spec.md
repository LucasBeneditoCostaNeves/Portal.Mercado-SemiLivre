## ADDED Requirements

### Requirement: ThemeToggle presente na página de login
A página `/login` SHALL renderizar o `ThemeToggle` no canto superior direito do painel do formulário, visível em todas as viewports (inclusive mobile, onde o painel de marketing é ocultado).

#### Scenario: Toggle visível em desktop
- **WHEN** o usuário acessa `/login` em viewport `>= lg`
- **THEN** o `ThemeToggle` é exibido no painel do formulário (coluna direita), acessível

#### Scenario: Toggle visível em mobile
- **WHEN** o usuário acessa `/login` em viewport `< lg`
- **THEN** o `ThemeToggle` é exibido no único painel visível (formulário), acessível

---

### Requirement: Página de login adapta cores ao tema ativo
Todos os elementos da página `/login` que não usam as cores de marca fixas SHALL usar os tokens de tema (`--color-bg-primary`, `--color-bg-secondary`, `--color-text-primary`, `--color-text-secondary`, `--color-border`), adaptando visualmente ao dark ou light mode.

#### Scenario: Painel de marketing mantém fundo amarelo em ambos os temas
- **WHEN** o tema ativo é `light` ou `dark`
- **THEN** o painel esquerdo (marketing) mantém fundo `--color-brand` (`#FFE600`)

#### Scenario: Formulário adapta fundo ao tema
- **WHEN** o tema ativo é `light`
- **THEN** o painel do formulário usa fundo `--color-bg-primary` (`#ffffff`) com texto `--color-text-primary` (`#18181b`)

#### Scenario: Formulário mantém contraste em dark mode
- **WHEN** o tema ativo é `dark`
- **THEN** o painel do formulário usa fundo `--color-bg-primary` (`#18181b`) com texto `--color-text-primary` (`#ffffff`)

#### Scenario: Campos de input adaptam ao tema
- **WHEN** o tema ativo muda
- **THEN** os campos de e-mail e senha atualizam bordas e fundo conforme `--color-border` e `--color-bg-secondary`
