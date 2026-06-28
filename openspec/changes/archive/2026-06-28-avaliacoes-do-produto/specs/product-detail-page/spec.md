## MODIFIED Requirements

### Requirement: Rota de detalhe de produto no Next.js
O sistema SHALL renderizar a página de detalhe de produto na rota `/(home)/produto/[id]` como Server Component, herdando o layout (Navbar + SubNav) do route group `(home)`. A página SHALL incluir a seção `<ProductReviewsSection>` abaixo da tabela de especificações, envolta em `<Suspense>` com skeleton dedicado.

#### Scenario: Acesso com ID válido renderiza a página completa incluindo a seção de avaliações
- **WHEN** o usuário acessa `/produto/:id` com um ID de produto existente e ativo
- **THEN** a página é renderizada com todos os blocos: breadcrumbs, galeria, área de info do produto, price box, info cards, tabela de especificações e seção de avaliações (quando `reviewCount > 0`)

#### Scenario: Acesso com ID inexistente renderiza página 404
- **WHEN** o usuário acessa `/produto/:id` com um ID que retorna 404 da API
- **THEN** a página exibe a tela de not-found do Next.js (via `notFound()`)

#### Scenario: Metatag de título reflete o nome do produto
- **WHEN** a página é renderizada com `title = "Smartphone Samsung Galaxy A55"`
- **THEN** o `<title>` da página é `"Smartphone Samsung Galaxy A55 | Mercado SemiLivre"` (ou padrão do layout)

#### Scenario: Loading state exibe skeleton durante o fetch de produto
- **WHEN** o fetch da API de produto ainda não completou
- **THEN** o Next.js exibe o `loading.tsx` com skeleton visual no lugar do conteúdo

#### Scenario: Seção de avaliações carrega de forma independente via Suspense
- **WHEN** o fetch de produto completa mas o fetch de reviews ainda não
- **THEN** os blocos existentes são exibidos e a área de avaliações exibe skeleton próprio enquanto aguarda
