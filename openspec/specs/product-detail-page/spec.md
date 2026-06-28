## Purpose

Especificação da página de detalhe de produto no frontend Next.js (`/produto/[id]`), cobrindo a rota Server Component, galeria de imagens interativa, área de informações, price box com CTAs, info cards, tabela de especificações, breadcrumbs e integração com a API via service layer.

## Requirements

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

---

### Requirement: Galeria de imagens interativa
O sistema SHALL exibir uma galeria com miniaturas verticais à esquerda e imagem principal à direita. A galeria SHALL ser um Client Component para permitir troca de imagem selecionada.

#### Scenario: Clique na miniatura troca a imagem principal
- **WHEN** o usuário clica em uma miniatura na lista vertical
- **THEN** a imagem principal muda para a imagem correspondente àquela miniatura

#### Scenario: Miniatura ativa tem indicação visual
- **WHEN** uma miniatura está selecionada como imagem principal
- **THEN** aquela miniatura tem borda destacada (border-color diferenciado)

#### Scenario: Sem imagens exibe ícone placeholder
- **WHEN** o produto não possui imagens em nenhuma variação
- **THEN** a galeria exibe um ícone placeholder na área principal

---

### Requirement: Área de informações do produto
O sistema SHALL renderizar como Server Component as informações textuais do produto: nome, rating com estrelas, contagem de reviews, nome do vendedor, badges, descrição curta.

#### Scenario: Rating exibe estrelas proporcional ao valor
- **WHEN** `rating = 4.7`
- **THEN** o sistema exibe 4 estrelas cheias e meia estrela (representação visual arredondada)

#### Scenario: Badges são exibidos conforme valor retornado pela API
- **WHEN** `badge = "OFERTA"`
- **THEN** o badge "Oferta" é exibido com estilo de destaque azul

#### Scenario: Badge ausente não exibe nenhum badge
- **WHEN** `badge` é `undefined`
- **THEN** nenhum elemento de badge é renderizado

---

### Requirement: Price box com CTAs
O sistema SHALL renderizar um card de compra como Client Component contendo: preço formatado, informação de parcelamento, indicador de frete grátis, botões "Adicionar ao carrinho" e "Comprar agora", e opções de entrega (radio: Envio / Retirar).

#### Scenario: Preço formatado em BRL
- **WHEN** `price = 1299.9`
- **THEN** o preço exibido é `R$ 1.299,90`

#### Scenario: Frete grátis exibido quando aplicável
- **WHEN** `freeShipping = true`
- **THEN** o indicador "Frete grátis" é visível no price box

#### Scenario: Frete grátis oculto quando não aplicável
- **WHEN** `freeShipping = false`
- **THEN** o indicador de frete grátis não é renderizado

#### Scenario: Opção de entrega selecionada muda o radio ativo
- **WHEN** o usuário clica em "Retirar"
- **THEN** o radio "Retirar" fica marcado e "Envio" desmarcado

---

### Requirement: Info cards de garantia, devolução e segurança
O sistema SHALL renderizar como Server Component três cards fixos em grid 3 colunas: Garantia (exibe `warrantyInformation`), Devolução (texto fixo sobre política) e Segurança (texto fixo sobre compra protegida).

#### Scenario: Card de garantia exibe informação do produto
- **WHEN** `warrantyInformation = "12 meses de garantia do fabricante"`
- **THEN** o card de garantia exibe esse texto

---

### Requirement: Tabela de especificações
O sistema SHALL renderizar como Server Component uma tabela listando as variações do produto com seus respectivos título, preço e quantidade em estoque.

#### Scenario: Tabela lista todas as variações ativas
- **WHEN** o produto tem 3 variações ativas
- **THEN** a tabela exibe 3 linhas, cada uma com título e preço da variação

---

### Requirement: Breadcrumbs de navegação
O sistema SHALL renderizar breadcrumbs no topo da página refletindo a hierarquia: Início → [categoria do produto] → [nome do produto truncado].

#### Scenario: Breadcrumbs refletem a categoria real do produto
- **WHEN** o produto pertence à categoria `"Celulares e smartphones"`
- **THEN** os breadcrumbs mostram: Início > Celulares e smartphones > [nome do produto]

---

### Requirement: Integração com a API de detalhe via service layer
O frontend SHALL buscar dados exclusivamente via `getProductDetail(id)` em `catalog.service.ts`, que usa `catalogFetch<T>()` com `revalidate: 3600`. A page SHALL não chamar `fetch()` diretamente.

#### Scenario: Service usa revalidação de 1 hora
- **WHEN** `getProductDetail` é chamado
- **THEN** o fetch é feito com `next: { revalidate: 3600 }` para permitir ISR

#### Scenario: Tipo ProductDetail é verificado em tempo de compilação
- **WHEN** a API retorna o objeto de detalhe
- **THEN** o TypeScript valida que todos os campos obrigatórios estão presentes via tipo `ProductDetail`
