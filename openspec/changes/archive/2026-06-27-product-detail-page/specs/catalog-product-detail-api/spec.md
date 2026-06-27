## ADDED Requirements

### Requirement: Endpoint de detalhe de produto no catálogo
O sistema SHALL expor o endpoint público `GET /catalog/products/:id` que retorna os dados completos de um produto ativo para renderização da página de detalhe.

#### Scenario: Produto ativo com variações retorna 200
- **WHEN** uma requisição `GET /catalog/products/:id` é feita com um ID válido de produto com status `true` e pelo menos uma variação ativa
- **THEN** o sistema retorna HTTP 200 com o objeto `CatalogProductDetail` contendo: `id`, `title`, `price` (menor preço entre variações ativas), `installments`, `freeShipping`, `rating`, `reviewCount`, `badge`, `imageUrl`, `images`, `description`, `warrantyInformation`, `brand`, `category`, `seller`, `variations`

#### Scenario: Produto inexistente retorna 404
- **WHEN** uma requisição `GET /catalog/products/:id` é feita com um ID que não existe no banco
- **THEN** o sistema retorna HTTP 404

#### Scenario: Produto inativo retorna 404
- **WHEN** uma requisição `GET /catalog/products/:id` é feita com um ID de produto com status `false`
- **THEN** o sistema retorna HTTP 404

#### Scenario: Produto sem variações ativas retorna 404
- **WHEN** uma requisição `GET /catalog/products/:id` é feita com um ID de produto que não possui nenhuma `ProductVariation` com status `true`
- **THEN** o sistema retorna HTTP 404

#### Scenario: ID com formato inválido retorna 400
- **WHEN** uma requisição `GET /catalog/products/:id` é feita com um valor de `:id` que não é UUID válido
- **THEN** o sistema retorna HTTP 400

#### Scenario: Endpoint é público (sem autenticação)
- **WHEN** uma requisição `GET /catalog/products/:id` é feita sem header de autenticação
- **THEN** o sistema processa normalmente, sem exigir token JWT

### Requirement: Agregação de dados do produto no Use Case
O `GetProductDetailUseCase` SHALL computar todos os campos agregados usando as mesmas regras de negócio do `ListCatalogProductsUseCase` para consistência entre listagem e detalhe.

#### Scenario: Campo `price` é o menor preço entre variações ativas
- **WHEN** o produto tem variações com preços `[150.00, 200.00, 99.90]`
- **THEN** o campo `price` retornado é `99.90`

#### Scenario: Campo `freeShipping` é `true` quando preço mínimo >= 100
- **WHEN** o menor preço do produto é `R$ 120,00`
- **THEN** `freeShipping` é `true`

#### Scenario: Campo `freeShipping` é `false` quando preço mínimo < 100
- **WHEN** o menor preço do produto é `R$ 89,90`
- **THEN** `freeShipping` é `false`

#### Scenario: Campo `badge` é OFERTA quando alguma variação tem desconto >= 10%
- **WHEN** ao menos uma variação tem `discountPercentage >= 10`
- **THEN** `badge` é `"OFERTA"`

#### Scenario: Campo `badge` é NOVO quando produto foi criado nos últimos 7 dias e sem desconto
- **WHEN** `product.createdAt` está dentro de 7 dias e nenhuma variação tem `discountPercentage >= 10`
- **THEN** `badge` é `"NOVO"`

#### Scenario: Campo `images` agrega todas as imagens de todas as variações
- **WHEN** o produto tem variações com imagens `[img1, img2]` e `[img3]`
- **THEN** `images` é `["img1", "img2", "img3"]`

#### Scenario: Campo `description` vem da variação com menor preço
- **WHEN** a variação com menor preço tem `description = "Tela Super AMOLED..."`
- **THEN** o campo `description` retornado é `"Tela Super AMOLED..."`

### Requirement: Extensão do CatalogRepository com método findProductById
O `CatalogRepository` SHALL declarar o método abstrato `findProductById(id: string): Promise<RawCatalogProductDetail | null>` e a implementação Prisma SHALL fazer eager loading de: `brand`, `categoryProducts`, `user` (seller), `ProductVariation` com `productVariationImages` e `ReviewProduct`.

#### Scenario: Produto encontrado retorna objeto com todas as relações
- **WHEN** `findProductById` é chamado com um ID de produto existente
- **THEN** o resultado contém `brand.name`, `categoryProducts.name`, `user.name`, e cada variação contém `productVariationImages[]` e `ReviewProduct[]`

#### Scenario: Produto não encontrado retorna null
- **WHEN** `findProductById` é chamado com um ID que não existe
- **THEN** o resultado é `null`
