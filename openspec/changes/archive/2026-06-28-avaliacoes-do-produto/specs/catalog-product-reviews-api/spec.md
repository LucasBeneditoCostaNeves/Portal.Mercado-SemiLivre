## ADDED Requirements

### Requirement: Endpoint de reviews de produto
O sistema SHALL expor o endpoint público `GET /catalog/products/:id/reviews` que retorna avaliações paginadas e filtráveis para um produto ativo.

#### Scenario: Produto com reviews retorna 200 com dados agregados e lista paginada
- **WHEN** uma requisição `GET /catalog/products/:id/reviews` é feita com um ID de produto existente e ativo
- **THEN** o sistema retorna HTTP 200 com um objeto contendo `aggregate` (com `rating`, `reviewCount`, `distribution`, `photos` e `aiSummary` opcional) e `items` (array de `ReviewItem`), `total` e `hasMore`

#### Scenario: Filtro por rating retorna apenas reviews com aquela nota
- **WHEN** a requisição inclui `?rating=5`
- **THEN** todos os `ReviewItem` retornados têm `rating === 5`

#### Scenario: Ordenação por mais recentes
- **WHEN** a requisição inclui `?sort=recent`
- **THEN** os itens são retornados em ordem decrescente de `createdAt`

#### Scenario: Ordenação por melhor avaliadas
- **WHEN** a requisição inclui `?sort=top`
- **THEN** os itens são retornados em ordem decrescente de `rating`

#### Scenario: Paginação retorna subconjunto correto
- **WHEN** a requisição inclui `?page=2&limit=10` e existem 25 reviews
- **THEN** o response retorna os itens 11–20, `total: 25` e `hasMore: true`

#### Scenario: Última página retorna hasMore false
- **WHEN** a requisição inclui `?page=3&limit=10` e existem 25 reviews
- **THEN** o response retorna 5 itens, `total: 25` e `hasMore: false`

#### Scenario: Produto sem reviews retorna aggregate zerado e lista vazia
- **WHEN** o produto existe mas não tem nenhuma avaliação
- **THEN** o response retorna HTTP 200 com `aggregate.reviewCount: 0`, `aggregate.photos: []`, `items: []`, `total: 0` e `hasMore: false`

#### Scenario: Produto inexistente retorna 404
- **WHEN** o `:id` não corresponde a nenhum produto ativo
- **THEN** o sistema retorna HTTP 404

#### Scenario: Endpoint é público
- **WHEN** a requisição é feita sem header de autenticação
- **THEN** o sistema processa normalmente, sem exigir token JWT

---

### Requirement: Shape do objeto ReviewItem
O sistema SHALL retornar cada avaliação no shape `ReviewItem` com campos obrigatórios e opcionais bem definidos.

#### Scenario: ReviewItem com todos os campos opcionais preenchidos
- **WHEN** uma avaliação tem texto, fotos e país cadastrados
- **THEN** o `ReviewItem` retornado contém `id`, `rating`, `text`, `photos` (array de URLs), `country` e `createdAt` (ISO 8601)

#### Scenario: ReviewItem sem campos opcionais omite as chaves ausentes
- **WHEN** uma avaliação não tem texto, fotos nem país
- **THEN** o `ReviewItem` retornado contém apenas `id`, `rating` e `createdAt`; `text`, `photos` e `country` são omitidos ou `undefined`

---

### Requirement: Campo distribution no aggregate
O sistema SHALL calcular e retornar a distribuição de avaliações por estrela no campo `aggregate.distribution`.

#### Scenario: Distribution reflete contagem real por estrela
- **WHEN** um produto tem 10 reviews com rating 5, 4 com rating 4 e 1 com rating 2
- **THEN** `aggregate.distribution` é `{ 5: 10, 4: 4, 3: 0, 2: 1, 1: 0 }`

---

### Requirement: Campo photos no aggregate
O sistema SHALL agregar todas as fotos de todas as avaliações no campo `aggregate.photos` para exibição na galeria.

#### Scenario: Photos agrega fotos de todos os reviews do produto (sem filtro de rating)
- **WHEN** a requisição é feita com ou sem filtro de rating
- **THEN** `aggregate.photos` contém as URLs de todas as fotos de todos os reviews do produto, independente do filtro aplicado aos `items`
