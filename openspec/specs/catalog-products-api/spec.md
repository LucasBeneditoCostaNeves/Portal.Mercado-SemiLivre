## Purpose

Especificação do endpoint público de listagem de produtos do catálogo, com suporte a filtros de categoria, paginação e campos calculados no shape desnormalizado `CatalogProduct`.

## Requirements

### Requirement: Endpoint público de listagem de produtos do catálogo
O sistema SHALL expor `GET /catalog/products` sem autenticação, retornando produtos no shape desnormalizado `CatalogProduct` com suporte a filtros de categoria e paginação.

#### Scenario: Listagem de produtos mais vendidos
- **WHEN** cliente envia `GET /catalog/products?category=bestsellers&limit=4`
- **THEN** o sistema retorna `{ items: CatalogProduct[], total: number }` com no máximo 4 itens ordenados por `reviewCount` decrescente

#### Scenario: Listagem de produtos recomendados
- **WHEN** cliente envia `GET /catalog/products?category=recommended&limit=4`
- **THEN** o sistema retorna `{ items: CatalogProduct[], total: number }` com no máximo 4 itens ordenados por `reviewCount` decrescente (mesma lógica que bestsellers no MVP)

#### Scenario: Paginação via skip
- **WHEN** cliente envia `GET /catalog/products?limit=4&skip=4`
- **THEN** o sistema retorna os próximos 4 produtos após os primeiros 4

#### Scenario: Banco sem produtos
- **WHEN** não há produtos cadastrados e cliente chama `GET /catalog/products`
- **THEN** o sistema retorna `{ items: [], total: 0 }` com status 200

#### Scenario: Rota não requer autenticação
- **WHEN** cliente chama `GET /catalog/products` sem header `Authorization`
- **THEN** o sistema responde com status 200 (não 401)

---

### Requirement: Shape de CatalogProduct com campos calculados
O sistema SHALL retornar cada produto no formato `CatalogProduct` com campos calculados a partir dos dados brutos de `Product`, `ProductVariation` e `ReviewProduct`.

#### Scenario: Cálculo de installments
- **WHEN** o preço da variação for >= R$ 120,00
- **THEN** `installments` SHALL ser calculado como `"12x R$ <price/12 formatado> sem juros"`

#### Scenario: Preço menor que 120 reais
- **WHEN** o preço da variação for < R$ 120,00
- **THEN** `installments` SHALL ser `"à vista R$ <price formatado>"`

#### Scenario: freeShipping por valor mínimo
- **WHEN** o preço da variação for >= R$ 100,00
- **THEN** `freeShipping` SHALL ser `true`

#### Scenario: Badge OFERTA por desconto
- **WHEN** o produto tiver campo de desconto >= 10% (reservado para evolução futura; no MVP nenhum produto tem desconto cadastrado)
- **THEN** `badge` SHALL ser `"OFERTA"`

#### Scenario: Badge NOVO por data de criação
- **WHEN** o `Product.createdAt` for dentro dos últimos 7 dias
- **THEN** `badge` SHALL ser `"NOVO"`

#### Scenario: Sem badge
- **WHEN** produto não atende critérios de OFERTA nem NOVO
- **THEN** campo `badge` SHALL ser omitido da resposta (undefined)

#### Scenario: Rating calculado
- **WHEN** produto tem variações com reviews
- **THEN** `rating` SHALL ser a média dos `ReviewProduct.rating` de todas as variações do produto, arredondada para 1 casa decimal

#### Scenario: Sem reviews
- **WHEN** produto não tem reviews
- **THEN** `rating` SHALL ser `0` e `reviewCount` SHALL ser `0`

#### Scenario: Preço da variation mais barata ativa
- **WHEN** produto tem múltiplas variações com `status: true`
- **THEN** `price` SHALL ser o menor preço entre as variações ativas

#### Scenario: Produto sem variação ativa
- **WHEN** produto não tem variações com `status: true`
- **THEN** o produto SHALL ser excluído do resultado (não retornado)

---

### Requirement: Ícone mapeado a partir da categoria
O sistema SHALL mapear o nome da categoria (`CategoryProduct.name`) para uma classe de ícone Tabler, retornando `ti-package` como fallback quando o nome não constar no mapa.

#### Scenario: Categoria conhecida
- **WHEN** `CategoryProduct.name` for um dos nomes mapeados (ex: "Celulares", "Informática")
- **THEN** `icon` SHALL ser a classe Tabler correspondente (ex: `"ti-device-mobile"`, `"ti-cpu"`)

#### Scenario: Categoria desconhecida
- **WHEN** `CategoryProduct.name` não constar no mapa de ícones
- **THEN** `icon` SHALL ser `"ti-package"`
