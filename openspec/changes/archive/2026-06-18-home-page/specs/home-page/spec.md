## ADDED Requirements

### Requirement: Navbar renderizada no topo da home
A página home SHALL renderizar uma Navbar fixa no topo com fundo #FFE600, contendo: logo à esquerda, barra de busca centralizada (full-width) e ações de usuário à direita (Entrar → `/login`, Pedidos, Carrinho com badge).

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
Abaixo da Navbar, a página SHALL renderizar uma Subnav com fundo #2D3277 contendo links de categorias em scroll horizontal: Ofertas do dia, Supermercado, Moda, Eletrônicos, Celulares, Casa e jardim, Esportes, Automotivo, Saúde e beleza, Brinquedos.

#### Scenario: Scroll horizontal em mobile
- **WHEN** a viewport tem menos de 640px de largura
- **THEN** a Subnav permite scroll horizontal sem quebrar o layout

---

### Requirement: Hero Banner com campanha e estatísticas
A página SHALL renderizar um Hero Banner com fundo #2D3277 e bordas arredondadas, contendo: badge de campanha, título, subtítulo, botão CTA (amarelo #FFE600) e 3 stat cards (+120k produtos, 12x sem juros, 48h entrega full).

#### Scenario: Layout em desktop
- **WHEN** a viewport tem 1024px ou mais
- **THEN** o conteúdo textual fica à esquerda e os stat cards à direita em linha

#### Scenario: Layout em mobile
- **WHEN** a viewport tem menos de 1024px
- **THEN** os stat cards são renderizados abaixo do conteúdo textual, em linha horizontal

---

### Requirement: Seção de Departamentos com grid responsivo
A página SHALL renderizar uma seção "Departamentos" com header (título + link "Ver todos") e um grid de 6 cards de categoria em desktop, cada um com ícone Tabler circular (#FFE600) e label.

#### Scenario: Grid em desktop
- **WHEN** a viewport tem 1024px ou mais
- **THEN** as 6 categorias são exibidas em grid de 6 colunas

#### Scenario: Grid em mobile
- **WHEN** a viewport tem menos de 640px
- **THEN** as 6 categorias são exibidas em grid de 2 colunas (3 linhas)

---

### Requirement: Seção Mais Vendidos com product cards
A página SHALL renderizar uma seção "Mais vendidos" com 4 ProductCards em grid, usando dados mockados tipados com badge "OFERTA" ou "NOVO".

#### Scenario: Grid em desktop
- **WHEN** a viewport tem 1024px ou mais
- **THEN** os 4 cards são exibidos em grid de 4 colunas

#### Scenario: Grid em mobile
- **WHEN** a viewport tem menos de 1024px
- **THEN** os cards são exibidos em grid de 2 colunas

---

### Requirement: Faixa promocional com dois cards
A página SHALL renderizar uma faixa com dois cards lado a lado: card amarelo (Mercado Pago) e card azul (Entrega Full), cada um com ícones, título, descrição e botão CTA.

#### Scenario: Layout responsivo
- **WHEN** a viewport tem menos de 640px
- **THEN** os dois cards são empilhados verticalmente (1 coluna)

---

### Requirement: Seção Recomendados com product cards
A página SHALL renderizar uma seção "Recomendados para você" com 4 ProductCards em grid usando dados mockados tipados, sem badge de destaque.

#### Scenario: Grid consistente com Mais Vendidos
- **WHEN** a página é renderizada
- **THEN** o grid de Recomendados usa o mesmo layout responsivo da seção Mais Vendidos

---

### Requirement: Footer com copyright e links institucionais
A página SHALL renderizar um footer com fundo #2D3277 contendo copyright à esquerda e links (Privacidade, Termos, Ajuda, Vender) à direita.

#### Scenario: Footer visível em todas as viewports
- **WHEN** o usuário rola até o final da página
- **THEN** o footer é exibido com copyright e links visíveis

---

### Requirement: Página implementada como Server Component
A `src/app/page.tsx` SHALL ser um Server Component (sem `"use client"`), composta de sub-componentes também Server Components sempre que possível.

#### Scenario: Sem hidratação desnecessária
- **WHEN** a página é carregada
- **THEN** nenhum componente de apresentação estática dispara `"use client"` desnecessariamente
