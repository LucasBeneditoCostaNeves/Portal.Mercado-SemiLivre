## Context

O backend (`Mercado-SemiLivre.api`) possui módulo `catalog` com `CatalogRepository` (interface abstrata) e `PrismaCatalogRepository` (implementação). A rota `GET /catalog/products` já agrega dados de `ProductVariation`, `ReviewProduct` e `CategoryProducts` para listagem. O módulo `product` é focado em operações de escrita (CRUD privado do seller); o módulo `catalog` é a face pública de leitura.

O frontend consome `catalogFetch<T>()` em `src/services/catalog.service.ts`, que abstrai `fetch()` nativo com `next: { revalidate: 60 }`. A home renderiza `ProductCard` com os campos de `CatalogProduct`. Não existe tipo, função ou rota para detalhe individual.

**Restrições existentes:**
- Backend: Use Cases não acessam Prisma diretamente (DIP via `CatalogRepository`)
- Frontend: componentes de UI não chamam APIs diretamente (service layer)
- Sem Axios; fetch nativo
- Server Components por padrão; `"use client"` apenas quando necessário

## Goals / Non-Goals

**Goals:**
- Expor `GET /catalog/products/:id` no backend retornando dados completos de um produto
- Renderizar página de detalhe no frontend como Server Component com SEO via `generateMetadata`
- Manter separação de camadas em ambos os projetos (Repository → Use Case → Controller; Service → Page → Components)
- Zero breaking changes nos contratos existentes

**Non-Goals:**
- Carrinho de compras ou fluxo de checkout (fora do escopo desta mudança)
- Sistema de favoritos persistido (botão pode existir mas sem backend)
- Reviews detalhados com comentários paginados (só contagem e rating agregado)
- Variação de produto selecionável em tempo real (price box mostra o menor preço da variação mais barata)
- Autenticação necessária para visualizar (rota pública `@Public()`)

## Decisions

### 1. Shape do `CatalogProductDetail` — resposta da API

**Decisão:** O endpoint retorna um objeto plano (`flat`), não a entidade raw do Prisma. O Use Case agrega os dados da mesma forma que `ListCatalogProductsUseCase`, mas com campos adicionais: `images` (array de URLs de todas as variações), `description` (da variação mais barata), `warrantyInformation`, `brand`, `category`, `seller`, `variations` (array simplificado para a tabela de specs).

```typescript
type CatalogProductDetail = {
  id: string
  title: string
  price: number           // menor preço entre variações ativas
  installments: string
  freeShipping: boolean
  rating: number
  reviewCount: number
  badge?: 'OFERTA' | 'NOVO'
  imageUrl: string        // thumbnail principal
  images: string[]        // todas as imagens de todas as variações
  description: string     // descrição da variação com menor preço
  warrantyInformation: string
  brand: string
  category: string
  seller: string
  variations: Array<{
    id: string
    title: string
    price: number
    quantity: number
    discountPercentage: number
  }>
}
```

**Alternativa descartada:** Retornar o objeto raw (com relações Prisma aninhadas) e fazer a transformação no frontend. Rejeitado porque expõe detalhes internos de schema, aumenta o payload e viola clean architecture — lógica de negócio (cálculo de badge, parcelamento) pertence ao backend.

### 2. Extensão do `CatalogRepository` vs. novo repositório

**Decisão:** Adicionar `findProductById(id: string)` ao `CatalogRepository` existente e à implementação `PrismaCatalogRepository`. O include do Prisma precisa de campos adicionais: `brand`, `user` (seller), e `productVariationImages` dentro de cada `ProductVariation`.

**Alternativa descartada:** Criar `ProductDetailRepository` separado. Descartado porque o padrão existente é um repositório por agregado de domínio de leitura (`catalog`), e a responsabilidade de "ler produtos para exibição pública" já pertence a `CatalogRepository`.

### 3. `RawCatalogProductDetail` — tipo do retorno do Prisma

**Decisão:** Criar tipo `RawCatalogProductDetail` em `CatalogRepository.ts` extendendo `RawCatalogProduct` com os campos adicionais (`brand`, `user`, variações com imagens):

```typescript
export type RawCatalogProductDetail = Product & {
  brand: Brand
  categoryProducts: CategoryProducts
  user: { name: string }
  ProductVariation: (ProductVariation & {
    ReviewProduct: ReviewProduct[]
    productVariationImages: productVariationImages[]
  })[]
}
```

### 4. Rota Next.js — estrutura de diretório

**Decisão:** `src/app/(home)/produto/[id]/page.tsx` dentro do route group `(home)` para herdar o layout com Navbar e SubNav existentes.

**Alternativa descartada:** Rota fora do route group `(home)` (ex: `src/app/produto/[id]/`). Descartado porque a navbar amarela e a subnav azul são parte do layout da experiência de loja, que já está encapsulada no layout do `(home)`.

### 5. Estratégia de cache no frontend

**Decisão:** `getProductDetail` usa `{ next: { revalidate: 3600 } }` (1 hora). Dados de produto mudam pouco (preço, imagem), e um ISR de 1h é adequado sem exigir `no-store`.

**Alternativa descartada:** `cache: 'no-store'`. Descartado porque aumenta latência em cada request sem benefício real para dados que raramente mudam em segundos.

### 6. Client Components na página

**Decisão:** Apenas `product-gallery.tsx` e `price-box.tsx` são `"use client"`:
- `product-gallery`: requer `useState` para trocar a imagem principal ao clicar nas miniaturas
- `price-box`: requer `useState` para o radio de entrega (Envio / Retirar)

Todos os outros componentes (`product-info`, `product-info-cards`, `product-specs`, `breadcrumbs`) são Server Components puros.

## Risks / Trade-offs

**[Risco] Produto sem variações ativas** → O Use Case verifica `ProductVariation.length === 0` e lança `NotFoundException` (404). O frontend trata com `notFound()` do Next.js.

**[Risco] `thumbnail` vazio no produto** → `images` cai para array vazio; o componente de galeria exibe ícone placeholder (padrão existente do mockup com `ti-device-mobile`).

**[Risco] Produto inativo (`status: false`)** → O Use Case inclui `where: { status: true }` na query; retorna 404 para produtos inativos.

**[Trade-off] `variations` na resposta como array simplificado** → Suficiente para a tabela de specs do mockup. Se no futuro precisarmos de seleção de variação (cor, tamanho), a resposta já contém o array e o contrato não quebra — basta adicionar campos a cada variação.

**[Trade-off] Rating agregado global (todas as variações)** → Consistente com `ListCatalogProductsUseCase`. Um rating por variação seria mais preciso mas o mockup não mostra essa granularidade.

## Migration Plan

Mudança puramente aditiva — nenhuma migração de banco necessário, nenhum contrato existente alterado.

1. Implementar backend (repositório → use case → controller → DTO)
2. Validar endpoint com `curl GET /catalog/products/:id`
3. Implementar frontend (tipos → service → page → components)
4. Testar rota em `localhost:3000/produto/:id` com um ID real do seed

Rollback: remover os arquivos adicionados e o novo método do controlador. Sem risco para rotas existentes.
