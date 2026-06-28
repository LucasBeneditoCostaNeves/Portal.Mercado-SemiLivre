## Purpose

Especifica o comportamento e estrutura da página de categoria (`/c/[categoryId]`), incluindo roteamento, cabeçalho, grid de produtos, infinite scroll, estado vazio e loading state.

---

## Requirements

### Requirement: Rota /c/[categoryId] com produtos filtrados por categoria
A página SHALL existir em `/c/[categoryId]` e aceitar o parâmetro de rota `categoryId` (string). O sistema SHALL resolver o nome da categoria chamando `GET /catalog/departments` e localizando o department com `id === categoryId`. Se nenhum department corresponder, o sistema SHALL chamar `notFound()` retornando 404. A página SHALL ser um Server Component com `<title>{label} | Mercado SemiLivre</title>` e sem `<meta name="robots" content="noindex">` (páginas de categoria são indexáveis).

#### Scenario: Acesso com categoryId válido
- **WHEN** usuário acessa `/c/smartphones` e `GET /catalog/departments` retorna um department com `id: "smartphones"`
- **THEN** a página renderiza com título "Smartphones | Mercado SemiLivre" e lista de produtos da categoria

#### Scenario: Acesso com categoryId inválido
- **WHEN** usuário acessa `/c/categoria-inexistente` e nenhum department tem aquele id
- **THEN** o sistema retorna 404

#### Scenario: Primeira carga SSR com 20 produtos
- **WHEN** a página é carregada pela primeira vez
- **THEN** os primeiros 20 produtos já estão no HTML (sem loading spinner inicial)

---

### Requirement: Cabeçalho com nome da categoria e contagem de resultados
A página SHALL renderizar um `CategoryHeader` exibindo o nome da categoria como título `<h1>` e a contagem "{N} produtos" abaixo, onde N é o `total` retornado pelo backend.

#### Scenario: Título com nome da categoria
- **WHEN** o usuário acessa `/c/laptops`
- **THEN** o `<h1>` exibe "Laptops"

#### Scenario: Contagem de produtos
- **WHEN** a categoria tem 134 produtos
- **THEN** o subtítulo exibe "134 produtos"

#### Scenario: Resultado único
- **WHEN** a categoria tem 1 produto
- **THEN** o subtítulo exibe "1 produto"

---

### Requirement: Grid de produtos reutiliza ProductCard
A página SHALL renderizar os produtos em grid responsivo `grid-cols-2 lg:grid-cols-5`, usando o componente `ProductCard` existente sem modificações.

#### Scenario: Grid em desktop
- **WHEN** a viewport tem 1024px ou mais
- **THEN** os produtos são exibidos em 5 colunas

#### Scenario: Grid em mobile
- **WHEN** a viewport tem menos de 1024px
- **THEN** os produtos são exibidos em 2 colunas

#### Scenario: Cada card linka para /produto/[id]
- **WHEN** usuário clica em um ProductCard na página de categoria
- **THEN** o sistema navega para `/produto/{id}` do produto

---

### Requirement: Infinite scroll com Intersection Observer
A partir da primeira carga de 20 produtos, a página SHALL carregar mais 20 produtos automaticamente quando o usuário rolar até o sentinel element no final da lista. O carregamento SHALL ser client-side via `fetch` com `offset` incrementado.

#### Scenario: Carregamento de próxima página ao atingir sentinel
- **WHEN** o usuário rola até o final da lista e `hasMore` é `true`
- **THEN** o sistema busca os próximos 20 produtos e os adiciona ao grid sem reload

#### Scenario: Skeleton durante carregamento de mais itens
- **WHEN** o carregamento da próxima página está em progresso
- **THEN** o grid exibe skeleton cards no final da lista

#### Scenario: Fim dos resultados
- **WHEN** `hasMore` é `false`
- **THEN** o sentinel é removido e a mensagem "Você viu todos os produtos" é exibida no final do grid

#### Scenario: Reset ao mudar filtros
- **WHEN** o usuário aplica ou altera qualquer filtro
- **THEN** a lista é resetada para os primeiros 20 resultados (offset 0) e o scroll retorna ao topo da lista

---

### Requirement: Estado vazio quando sem resultados
Quando a consulta retornar 0 produtos (com ou sem filtros ativos), a página SHALL exibir um `EmptyCategoryState` com ícone, mensagem "Nenhum produto encontrado em {label}" (sem filtros) ou "Nenhum produto encontrado com os filtros selecionados" (com filtros), e botão CTA "Limpar filtros" (com filtros) ou "Voltar para a home" (sem filtros).

#### Scenario: Zero resultados sem filtros
- **WHEN** a categoria não tem produtos e nenhum filtro está ativo
- **THEN** exibe "Nenhum produto encontrado em {label}" e botão "Voltar para a home"

#### Scenario: Zero resultados com filtros ativos
- **WHEN** a combinação de filtros não retorna produtos
- **THEN** exibe "Nenhum produto encontrado com os filtros selecionados" e botão "Limpar filtros"

#### Scenario: CTA Limpar filtros no estado vazio
- **WHEN** usuário clica em "Limpar filtros" no estado vazio
- **THEN** todos os query params de filtro são removidos e a URL volta para `/c/{categoryId}` limpa

---

### Requirement: Loading state com skeleton do grid
A rota SHALL ter um `loading.tsx` que exibe um skeleton do grid de produtos durante o carregamento do Server Component.

#### Scenario: Skeleton exibido durante navegação para categoria
- **WHEN** o usuário clica em um card de departamento
- **THEN** o skeleton do grid é exibido enquanto o Server Component carrega
