## ADDED Requirements

### Requirement: Busca textual por nome de produto
O endpoint `GET /catalog/products` SHALL aceitar o query param opcional `q` (string). Quando presente, SHALL filtrar produtos cujo `title` contenha `q` como substring, de forma case-insensitive.

#### Scenario: Busca por termo parcial
- **WHEN** cliente envia `GET /catalog/products?q=note`
- **THEN** o sistema retorna apenas produtos cujo `title` contém "note" (ex: "Notebook", "Notepad"), case-insensitive

#### Scenario: Busca sem resultados
- **WHEN** cliente envia `GET /catalog/products?q=xyzabc123`
- **THEN** o sistema retorna `{ items: [], total: 0, hasMore: false }` com status 200

#### Scenario: q ausente não altera comportamento existente
- **WHEN** cliente envia `GET /catalog/products` sem `q`
- **THEN** o sistema retorna todos os produtos sem filtro textual (comportamento atual preservado)

---

### Requirement: Ordenação por campo e direção
O endpoint SHALL aceitar os query params opcionais `sort` (campo) e `order` (`asc` | `desc`). Combinações válidas: `sort=price`, `sort=rating`, `sort=sales`. Sem `sort`, a ordenação padrão é por relevância (sem critério específico).

#### Scenario: Ordenar por menor preço
- **WHEN** cliente envia `?sort=price&order=asc`
- **THEN** os produtos são retornados em ordem crescente de `price`

#### Scenario: Ordenar por maior preço
- **WHEN** cliente envia `?sort=price&order=desc`
- **THEN** os produtos são retornados em ordem decrescente de `price`

#### Scenario: Ordenar por melhor avaliação
- **WHEN** cliente envia `?sort=rating&order=desc`
- **THEN** os produtos são retornados em ordem decrescente de `rating`

#### Scenario: Ordenar por mais vendidos
- **WHEN** cliente envia `?sort=sales&order=desc`
- **THEN** os produtos são retornados em ordem decrescente de `reviewCount`

#### Scenario: sort inválido ignorado
- **WHEN** cliente envia `?sort=unknown`
- **THEN** o sistema ignora o param e retorna com ordenação padrão (status 200)

---

### Requirement: Filtros avançados de produto
O endpoint SHALL aceitar os query params opcionais: `freeShipping` (boolean), `minPrice` (number), `maxPrice` (number), `minRating` (number 1-5), `brand` (string, múltiplos valores separados por vírgula), `category` (string, múltiplos valores separados por vírgula).

#### Scenario: Filtrar por frete grátis
- **WHEN** cliente envia `?freeShipping=true`
- **THEN** apenas produtos com `freeShipping: true` são retornados

#### Scenario: Filtrar por faixa de preço
- **WHEN** cliente envia `?minPrice=100&maxPrice=500`
- **THEN** apenas produtos com `price >= 100` e `price <= 500` são retornados

#### Scenario: Filtrar por avaliação mínima
- **WHEN** cliente envia `?minRating=4`
- **THEN** apenas produtos com `rating >= 4` são retornados

#### Scenario: Filtrar por múltiplas marcas
- **WHEN** cliente envia `?brand=Samsung,Apple`
- **THEN** apenas produtos das marcas "Samsung" ou "Apple" são retornados

#### Scenario: Filtrar por múltiplas categorias
- **WHEN** cliente envia `?category=Celulares,Informatica`
- **THEN** apenas produtos das categorias listadas são retornados

#### Scenario: Combinação de filtros
- **WHEN** cliente envia `?q=pro&freeShipping=true&minPrice=200&sort=price&order=asc`
- **THEN** o sistema aplica todos os filtros em conjunção (AND) e retorna produtos ordenados por preço crescente

---

### Requirement: Paginação por offset e campo hasMore na resposta
O endpoint SHALL aceitar o query param `offset` (number, padrão 0) para paginação. A resposta SHALL incluir `hasMore: boolean` indicando se existem mais produtos além dos retornados.

#### Scenario: Paginação pela segunda página
- **WHEN** cliente envia `?limit=20&offset=20`
- **THEN** o sistema retorna os produtos de índice 20 a 39

#### Scenario: hasMore true quando há mais resultados
- **WHEN** existem 47 produtos correspondentes e `limit=20&offset=0`
- **THEN** `hasMore` é `true` e `total` é `47`

#### Scenario: hasMore false na última página
- **WHEN** existem 47 produtos e `limit=20&offset=40`
- **THEN** `hasMore` é `false` (apenas 7 produtos retornados)

---

## MODIFIED Requirements

### Requirement: Endpoint público de listagem de produtos do catálogo
O sistema SHALL expor `GET /catalog/products` sem autenticação, retornando produtos no shape desnormalizado `CatalogProduct` com suporte a filtros de categoria, busca textual, ordenação, filtros avançados e paginação por offset. A resposta SHALL incluir `hasMore: boolean`.

#### Scenario: Listagem de produtos mais vendidos
- **WHEN** cliente envia `GET /catalog/products?category=bestsellers&limit=4`
- **THEN** o sistema retorna `{ items: CatalogProduct[], total: number, hasMore: boolean }` com no máximo 4 itens ordenados por `reviewCount` decrescente

#### Scenario: Listagem de produtos recomendados
- **WHEN** cliente envia `GET /catalog/products?category=recommended&limit=4`
- **THEN** o sistema retorna `{ items: CatalogProduct[], total: number, hasMore: boolean }` com no máximo 4 itens

#### Scenario: Paginação via offset
- **WHEN** cliente envia `GET /catalog/products?limit=20&offset=20`
- **THEN** o sistema retorna os próximos 20 produtos após os primeiros 20

#### Scenario: Banco sem produtos
- **WHEN** não há produtos cadastrados e cliente chama `GET /catalog/products`
- **THEN** o sistema retorna `{ items: [], total: 0, hasMore: false }` com status 200

#### Scenario: Rota não requer autenticação
- **WHEN** cliente chama `GET /catalog/products` sem header `Authorization`
- **THEN** o sistema responde com status 200 (não 401)
