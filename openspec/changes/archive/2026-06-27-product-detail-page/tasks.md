## 1. Backend — Tipos e Repositório

- [x] 1.1 Criar tipo `RawCatalogProductDetail` em `src/modules/catalog/repositories/CatalogRepository.ts` com eager loading de `brand`, `user`, `productVariationImages`
- [x] 1.2 Declarar método abstrato `findProductById(id: string): Promise<RawCatalogProductDetail | null>` em `CatalogRepository`
- [x] 1.3 Implementar `findProductById` em `PrismaCatalogRepository` (`src/infra/database/prisma/repositories/PrismaCatalogRepository.ts`) com Prisma `findFirst` incluindo todas as relações necessárias e `where: { id, status: true }`

## 2. Backend — Use Case de Detalhe

- [x] 2.1 Criar diretório `src/modules/catalog/useCases/getProductDetail/`
- [x] 2.2 Criar tipo `CatalogProductDetail` em `src/modules/catalog/types/CatalogProductDetail.ts` com todos os campos do design (id, title, price, installments, freeShipping, rating, reviewCount, badge, imageUrl, images, description, warrantyInformation, brand, category, seller, variations)
- [x] 2.3 Implementar `GetProductDetailUseCase` em `src/modules/catalog/useCases/getProductDetail/GetProductDetailUseCase.ts`, reutilizando as constantes e funções utilitárias de `ListCatalogProductsUseCase` (FREE_SHIPPING_THRESHOLD, INSTALLMENTS_*, formatBRL, toNumber)
- [x] 2.4 Fazer o Use Case lançar `NotFoundException` quando `findProductById` retornar `null` ou produto não tiver variações ativas

## 3. Backend — Controller e DTO

- [x] 3.1 Criar schema Zod `getProductDetailParamsSchema` em `src/infra/http/modules/catalog/schemas/catalog.schemas.ts` validando `:id` como UUID
- [x] 3.2 Criar `GetProductDetailParamsDto` em `src/infra/http/modules/catalog/dto/catalog.dto.ts` usando `createZodDto`
- [x] 3.3 Adicionar endpoint `@Get('products/:id')` ao `CatalogController`, decorado com `@Public()`, injetando e chamando `GetProductDetailUseCase`
- [x] 3.4 Registrar `GetProductDetailUseCase` no módulo `catalog.module.ts`

## 4. Frontend — Tipos e Service

- [x] 4.1 Adicionar tipos `ProductVariationDetail`, `ProductDetail` em `src/domain/catalog/types.ts` conforme shape definido no design
- [x] 4.2 Adicionar função `getProductDetail(id: string): Promise<ProductDetail>` em `src/services/catalog.service.ts` usando `catalogFetch<ProductDetail>` com `revalidate: 3600`

## 5. Frontend — Componentes Server

- [x] 5.1 Criar `src/app/(home)/produto/[id]/_components/breadcrumbs.tsx` — Server Component exibindo Início > [category] > [title truncado]
- [x] 5.2 Criar `src/app/(home)/produto/[id]/_components/product-info.tsx` — Server Component com nome, estrelas de rating, contagem de reviews, vendedor, badges e descrição
- [x] 5.3 Criar `src/app/(home)/produto/[id]/_components/product-info-cards.tsx` — Server Component com grid 3 colunas: Garantia (warrantyInformation), Devolução e Segurança
- [x] 5.4 Criar `src/app/(home)/produto/[id]/_components/product-specs.tsx` — Server Component com tabela de variações (título, preço, estoque)

## 6. Frontend — Componentes Client

- [x] 6.1 Criar `src/app/(home)/produto/[id]/_components/product-gallery.tsx` — Client Component (`"use client"`) com `useState` para imagem principal selecionada, lista de thumbnails verticais e fallback de ícone placeholder
- [x] 6.2 Criar `src/app/(home)/produto/[id]/_components/price-box.tsx` — Client Component (`"use client"`) com preço formatado em BRL, parcelamento, badge de frete grátis, botões de CTA e radio de entrega com `useState`

## 7. Frontend — Page e Loading

- [x] 7.1 Criar `src/app/(home)/produto/[id]/page.tsx` — Server Component que chama `getProductDetail(params.id)`, trata 404 com `notFound()`, exporta `generateMetadata` com o título do produto, e compõe todos os subcomponentes no layout de 2 colunas conforme mockup
- [x] 7.2 Criar `src/app/(home)/produto/[id]/loading.tsx` — skeleton visual com placeholders para galeria, área de info e price box

## 8. Validação e Smoke Test

- [ ] 8.1 Iniciar o backend e confirmar que `GET /catalog/products/:id` retorna 200 com payload completo para um ID válido do seed
- [ ] 8.2 Confirmar que IDs inexistentes retornam 404 e IDs malformados retornam 400
- [ ] 8.3 Iniciar o frontend e navegar para `/produto/:id` confirmando que todos os blocos renderizam sem erros
- [ ] 8.4 Verificar que a troca de thumbnail na galeria funciona corretamente no browser
- [ ] 8.5 Verificar que o `<title>` da página reflete o nome do produto no HTML renderizado

