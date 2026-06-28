## Purpose

Especificação da seção de avaliações de produto no frontend Next.js, cobrindo exibição de nota geral com estrelas, barras de distribuição, galeria de fotos de compradores, resumo por IA, controles de filtro e ordenação, lista paginada de avaliações individuais e busca via service layer.

## Requirements

### Requirement: Seção de avaliações na página do produto
O sistema SHALL renderizar um bloco "Opiniões do produto" abaixo da tabela de especificações na rota `/produto/[id]`, exibindo dados aggregados e a lista de avaliações. A seção SHALL ser omitida quando `reviewCount === 0`.

#### Scenario: Produto com reviews exibe a seção completa
- **WHEN** o usuário acessa `/produto/:id` e o produto tem `reviewCount > 0`
- **THEN** a seção "Opiniões do produto" é renderizada abaixo de `ProductSpecs`

#### Scenario: Produto sem reviews não exibe a seção
- **WHEN** o produto tem `reviewCount === 0`
- **THEN** nenhum elemento da seção de avaliações é renderizado

#### Scenario: Loading state da seção exibe skeleton enquanto reviews carregam
- **WHEN** o fetch de reviews ainda não completou
- **THEN** um skeleton visual é exibido no lugar da seção, sem bloquear o restante da página

---

### Requirement: Nota geral com estrelas e total de avaliações
O sistema SHALL exibir a nota média com representação visual em estrelas e o total de avaliações como âncora visual no topo da seção.

#### Scenario: Nota média exibida com uma casa decimal
- **WHEN** `aggregate.rating = 4.9`
- **THEN** o número "4.9" é exibido em destaque ao lado das estrelas

#### Scenario: Estrelas refletem proporcionalmente a nota média
- **WHEN** `aggregate.rating = 4.5`
- **THEN** 4 estrelas cheias e meia estrela são exibidas

#### Scenario: Total de avaliações exibido abaixo da nota
- **WHEN** `aggregate.reviewCount = 17`
- **THEN** o texto "17 avaliações" é exibido abaixo da nota e das estrelas

---

### Requirement: Barras de distribuição por estrelas
O sistema SHALL exibir uma barra de progresso para cada nível de estrela (5 a 1), indicando visualmente a proporção de avaliações naquele nível.

#### Scenario: Largura da barra proporcional ao percentual de reviews naquele nível
- **WHEN** 80% das avaliações têm 5 estrelas
- **THEN** a barra do nível 5 tem 80% de preenchimento; as demais barras são proporcionais

#### Scenario: Clique em uma barra aplica filtro por aquele nível de estrela
- **WHEN** o usuário clica na barra ou label de 4 estrelas
- **THEN** a URL é atualizada com `?rating=4` e a lista exibe apenas reviews de 4 estrelas

#### Scenario: Barra de nível sem avaliações tem largura zero
- **WHEN** `distribution[3] = 0`
- **THEN** a barra de 3 estrelas aparece vazia (largura 0%)

---

### Requirement: Galeria de fotos de compradores
O sistema SHALL exibir uma galeria horizontal com miniaturas das fotos enviadas por compradores nas avaliações.

#### Scenario: Galeria exibe thumbnails das fotos dos reviews
- **WHEN** `aggregate.photos` contém pelo menos uma URL
- **THEN** as fotos são exibidas em uma faixa horizontal rolável com miniaturas quadradas

#### Scenario: Galeria oculta quando não há fotos
- **WHEN** `aggregate.photos` está vazio
- **THEN** a subseção de galeria de fotos não é renderizada

#### Scenario: Clique em miniatura abre foto em tamanho ampliado
- **WHEN** o usuário clica em uma miniatura da galeria
- **THEN** a foto é exibida em destaque (lightbox ou modal)

---

### Requirement: Resumo gerado por IA
O sistema SHALL exibir um bloco de resumo de opiniões quando o campo `aiSummary` estiver presente na resposta da API.

#### Scenario: Resumo exibido quando disponível
- **WHEN** `aggregate.aiSummary` é uma string não vazia
- **THEN** o texto do resumo é exibido com label "Resumo de opiniões gerado por IA"

#### Scenario: Resumo oculto quando ausente
- **WHEN** `aggregate.aiSummary` é `undefined` ou vazio
- **THEN** nenhum elemento de resumo é renderizado

---

### Requirement: Controles de filtro e ordenação
O sistema SHALL oferecer controles para ordenar as avaliações e filtrar por qualificação, refletindo as seleções na URL.

#### Scenario: Dropdown "Ordenar" permite selecionar mais recentes ou melhor avaliadas
- **WHEN** o usuário abre o dropdown "Ordenar" e seleciona "Mais recentes"
- **THEN** a URL é atualizada com `?sort=recent` e a lista recarrega com a nova ordenação

#### Scenario: Dropdown "Qualificação" permite filtrar por número de estrelas
- **WHEN** o usuário seleciona "5 estrelas" no dropdown de Qualificação
- **THEN** a URL é atualizada com `?rating=5` e apenas reviews de 5 estrelas são exibidos

#### Scenario: Filtros podem ser combinados
- **WHEN** a URL contém `?sort=top&rating=4`
- **THEN** a lista exibe avaliações de 4 estrelas ordenadas pela melhor nota

#### Scenario: Limpar filtro de qualificação exibe todos os ratings
- **WHEN** o usuário seleciona "Todas as qualificações" no dropdown
- **THEN** o parâmetro `rating` é removido da URL e todos os reviews são exibidos

---

### Requirement: Lista paginada de avaliações individuais
O sistema SHALL renderizar cards de avaliação individuais com todas as informações disponíveis, com suporte a carregar mais.

#### Scenario: Card de avaliação exibe estrelas, país, data relativa e texto
- **WHEN** um `ReviewItem` tem `rating=5`, `country="Colombia"`, `createdAt` de 5 meses atrás e `text` preenchido
- **THEN** o card exibe 5 estrelas, "Colômbia", "Há 5 meses" e o texto da avaliação

#### Scenario: Data relativa exibida em português
- **WHEN** `createdAt` corresponde a 5 meses atrás
- **THEN** o texto exibido é "Há 5 meses"

#### Scenario: Fotos do review exibidas em faixa horizontal abaixo do texto
- **WHEN** `ReviewItem.photos` contém 3 URLs
- **THEN** 3 miniaturas são exibidas abaixo do texto da avaliação

#### Scenario: Review sem texto não exibe área de texto
- **WHEN** `ReviewItem.text` é `undefined`
- **THEN** nenhum elemento de texto é renderizado no card

#### Scenario: Botão "Ver mais" carrega próxima página de avaliações
- **WHEN** `hasMore: true` e o usuário clica em "Ver mais avaliações"
- **THEN** a página seguinte é buscada e os novos cards são adicionados abaixo dos existentes

#### Scenario: Botão "Ver mais" oculto na última página
- **WHEN** `hasMore: false`
- **THEN** o botão "Ver mais avaliações" não é renderizado

---

### Requirement: Busca de reviews via service layer
O frontend SHALL buscar dados de reviews exclusivamente via `getProductReviews(id, params)` em `catalog.service.ts`, com `revalidate: 300`.

#### Scenario: Service usa revalidação de 5 minutos
- **WHEN** `getProductReviews` é chamado
- **THEN** o fetch é feito com `next: { revalidate: 300 }`

#### Scenario: Parâmetros de filtro e ordenação são passados como query string
- **WHEN** `getProductReviews` é chamado com `{ rating: 5, sort: 'recent', page: 2 }`
- **THEN** o fetch é feito para `/catalog/products/:id/reviews?rating=5&sort=recent&page=2`
