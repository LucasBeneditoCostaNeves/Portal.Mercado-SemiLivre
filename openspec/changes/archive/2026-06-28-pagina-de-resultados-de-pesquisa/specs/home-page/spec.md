## MODIFIED Requirements

### Requirement: Navbar renderizada no topo da home
A página home SHALL renderizar uma Navbar fixa no topo com fundo `--color-brand` (`#FFE600`), contendo: logo à esquerda, barra de busca centralizada (full-width) como `<form>` funcional com `action="/buscar"` e `method="GET"`, ações de usuário à direita (Entrar → `/login`, Pedidos, Carrinho com badge) e `ThemeToggle`. O `<input>` de busca SHALL ter `name="q"`, `required`, `role="search"` no form e `aria-label="Buscar produtos"`. Quando o usuário está na página `/buscar`, o input SHALL aparecer preenchido com o valor atual de `q`.

#### Scenario: Logo leva para a home
- **WHEN** o usuário clica no logo na Navbar
- **THEN** o sistema navega para `/`

#### Scenario: Botão Entrar leva para login
- **WHEN** o usuário clica em "Entrar" na Navbar
- **THEN** o sistema navega para `/login`

#### Scenario: Barra de busca visível em mobile
- **WHEN** a viewport tem menos de 1024px de largura
- **THEN** a barra de busca ocupa a largura completa abaixo do logo e ações

#### Scenario: Submissão da busca pelo Enter
- **WHEN** o usuário digita um termo no input e pressiona Enter
- **THEN** o sistema navega para `/buscar?q={termo}`

#### Scenario: Submissão da busca pelo botão de lupa
- **WHEN** o usuário digita um termo e clica no botão de lupa
- **THEN** o sistema navega para `/buscar?q={termo}`

#### Scenario: Input preenchido na página de busca
- **WHEN** o usuário está em `/buscar?q=notebook`
- **THEN** o input de busca da Navbar exibe "notebook" pré-preenchido

#### Scenario: Funciona sem JavaScript
- **WHEN** o JavaScript está desabilitado no browser
- **THEN** o formulário ainda submete via GET nativo do browser para `/buscar?q={termo}`
