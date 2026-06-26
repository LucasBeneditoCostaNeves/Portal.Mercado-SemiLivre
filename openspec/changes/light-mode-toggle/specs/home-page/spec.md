## ADDED Requirements

### Requirement: Navbar inclui ThemeToggle
A `Navbar` da home page SHALL renderizar o `ThemeToggle` no grupo de ações do usuário, ao lado dos ícones de Pedidos e Carrinho, no canto direito.

#### Scenario: ThemeToggle visível na Navbar
- **WHEN** o usuário acessa a home page
- **THEN** o `ThemeToggle` é exibido na Navbar ao lado das ações de usuário, visível em todas as viewports

---

## MODIFIED Requirements

### Requirement: Navbar renderizada no topo da home
A página home SHALL renderizar uma Navbar fixa no topo com fundo `--color-brand` (`#FFE600`), contendo: logo à esquerda, barra de busca centralizada (full-width), ações de usuário à direita (Entrar → `/login`, Pedidos, Carrinho com badge) e `ThemeToggle`.

#### Scenario: Logo leva para a home
- **WHEN** o usuário clica no logo na Navbar
- **THEN** o sistema navega para `/`

#### Scenario: Botão Entrar leva para login
- **WHEN** o usuário clica em "Entrar" na Navbar
- **THEN** o sistema navega para `/login`

#### Scenario: Barra de busca visível em mobile
- **WHEN** a viewport tem menos de 1024px de largura
- **THEN** a barra de busca ocupa a largura completa abaixo do logo e ações

---

### Requirement: Subnav com categorias de navegação rápida
Abaixo da Navbar, a página SHALL renderizar uma Subnav com fundo `--color-brand-dark` contendo links de categorias em scroll horizontal: Ofertas do dia, Supermercado, Moda, Eletrônicos, Celulares, Casa e jardim, Esportes, Automotivo, Saúde e beleza, Brinquedos. O texto dos links SHALL usar `--color-text-primary` invertido (branco em dark, branco em light sobre fundo escuro azul).

#### Scenario: Scroll horizontal em mobile
- **WHEN** a viewport tem menos de 640px de largura
- **THEN** a Subnav permite scroll horizontal sem quebrar o layout

---

### Requirement: Hero Banner com campanha e estatísticas
A página SHALL renderizar um Hero Banner com fundo `--color-brand-dark` e bordas arredondadas, contendo: badge de campanha, título, subtítulo, botão CTA (fundo `--color-brand`) e 3 stat cards.

#### Scenario: Layout em desktop
- **WHEN** a viewport tem 1024px ou mais
- **THEN** o conteúdo textual fica à esquerda e os stat cards à direita em linha

#### Scenario: Layout em mobile
- **WHEN** a viewport tem menos de 1024px
- **THEN** os stat cards são renderizados abaixo do conteúdo textual, em linha horizontal

---

### Requirement: Faixa promocional com dois cards
A página SHALL renderizar uma faixa com dois cards lado a lado: card com fundo `--color-brand` (Mercado Pago) e card com fundo `--color-brand-dark` (Entrega Full), cada um com ícones, título, descrição e botão CTA.

#### Scenario: Layout responsivo
- **WHEN** a viewport tem menos de 640px
- **THEN** os dois cards são empilhados verticalmente (1 coluna)

---

### Requirement: Footer com copyright e links institucionais
A página SHALL renderizar um footer com fundo `--color-brand-dark` contendo copyright à esquerda e links (Privacidade, Termos, Ajuda, Vender) à direita.

#### Scenario: Footer visível em todas as viewports
- **WHEN** o usuário rola até o final da página
- **THEN** o footer é exibido com copyright e links visíveis

---

### Requirement: Página adapta cores ao tema ativo
Todos os elementos da home que não usam as cores de marca fixas (`--color-brand`, `--color-brand-dark`) SHALL usar os tokens de tema (`--color-bg-primary`, `--color-bg-secondary`, `--color-text-primary`, `--color-text-secondary`, `--color-border`, `--color-surface-card`), adaptando visualmente ao dark ou light mode conforme a preferência do usuário.

#### Scenario: Fundo da página em dark mode
- **WHEN** o tema ativo é `dark`
- **THEN** o fundo principal da página usa `--color-bg-primary` (`#18181b`)

#### Scenario: Fundo da página em light mode
- **WHEN** o tema ativo é `light`
- **THEN** o fundo principal da página usa `--color-bg-primary` (`#ffffff`)

#### Scenario: Product cards adaptam ao tema
- **WHEN** o tema muda de dark para light
- **THEN** os `ProductCard`s atualizam fundo e texto conforme os tokens de tema, sem reload
