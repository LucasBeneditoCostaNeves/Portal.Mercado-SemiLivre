## Why

O portal não possui página de detalhe de produto — ao clicar em qualquer card da home, não há destino. Isso impede a jornada de compra e torna o e-commerce incompleto. O backend já tem os dados necessários (produto, variações, reviews, imagens) mas não expõe uma rota de detalhe individual.

## What Changes

- **Nova rota pública no backend**: `GET /catalog/products/:id` retornando todos os dados necessários para renderizar a página de detalhe
- **Novo Use Case no backend**: `GetProductDetailUseCase` no módulo `catalog`, seguindo o padrão existente de separação por camadas
- **Extensão do `CatalogRepository`**: novo método `findProductById(id)` com eager loading de brand, categoria, seller, variações, imagens e reviews
- **Novo tipo `ProductDetail`** no domínio do frontend (`src/domain/catalog/types.ts`)
- **Nova função `getProductDetail(id)`** no `catalog.service.ts` do frontend
- **Nova rota Next.js**: `src/app/(home)/produto/[id]/page.tsx` — Server Component com `generateMetadata`
- **Novos componentes** em `src/app/(home)/produto/[id]/_components/`: galeria de imagens, área de info, price box, info cards, tabela de specs, breadcrumbs
- **Loading UI** (`loading.tsx`) com skeleton para a rota

## Capabilities

### New Capabilities

- `catalog-product-detail-api`: Endpoint público `GET /catalog/products/:id` no backend que retorna dados completos do produto (info, variações, imagens, ratings agregados, seller, brand, categoria) para renderização da página de detalhe
- `product-detail-page`: Página de detalhe de produto no frontend com galeria de imagens, área de compra (preço, parcelamento, CTAs), info cards (garantia, devolução, segurança) e tabela de especificações, integrada à API de detalhe

### Modified Capabilities

- `catalog-products-api`: Nenhuma alteração nos requisitos da listagem — o endpoint `GET /catalog/products` permanece inalterado; apenas o `CatalogRepository` e o `CatalogController` recebem adições sem breaking changes

## Impact

**Backend (`Mercado-SemiLivre.api`)**
- `src/modules/catalog/repositories/CatalogRepository.ts` — novo método `findProductById`
- `src/infra/database/` — implementação Prisma do novo método
- `src/modules/catalog/useCases/getProductDetail/` — novo diretório com Use Case
- `src/modules/catalog/types/` — novo tipo `CatalogProductDetail`
- `src/infra/http/modules/catalog/catalog.controller.ts` — novo endpoint `GET /catalog/products/:id`
- `src/infra/http/modules/catalog/dto/catalog.dto.ts` — DTO de validação do param `:id`

**Frontend (`Portal.Mercado-SemiLivre`)**
- `src/domain/catalog/types.ts` — adição do tipo `ProductDetail` e subtipos (`ProductVariationDetail`, `ReviewSummary`)
- `src/services/catalog.service.ts` — adição da função `getProductDetail(id: string)`
- `src/app/(home)/produto/[id]/` — nova rota com page.tsx, loading.tsx e _components/

**Sem breaking changes** — todas as rotas e tipos existentes permanecem intactos.
