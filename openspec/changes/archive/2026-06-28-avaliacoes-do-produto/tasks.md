## 1. API — Endpoint de Reviews (Mercado-SemiLivre.api)

- [x] 1.1 Verificar schema do `ReviewProduct` no Prisma: confirmar existência dos campos `rating`, `text`, `photos`, `country`, `createdAt`; adicionar migration se campos estiverem faltando
- [x] 1.2 Adicionar método `findReviewsByProductId(productId, opts)` ao `CatalogRepository` (interface abstrata e implementação Prisma), aceitando `page`, `limit`, `rating` e `sort`
- [x] 1.3 Criar `GetProductReviewsUseCase` que: agrega `distribution`, `photos` e `aiSummary` (se existir); aplica filtros e paginação; retorna shape `ProductReviewsResponse`
- [x] 1.4 Criar o controller `GET /catalog/products/:id/reviews` que valida UUID, chama o use case e retorna 404 para produto inexistente
- [x] 1.5 Registrar a rota no módulo de catálogo e garantir que é pública (sem guard JWT)
- [x] 1.6 Testar manualmente os cenários: produto com reviews, sem reviews, filtro por rating, paginação e produto inexistente

## 2. Frontend — Tipos e Service (Portal.Mercado-SemiLivre)

- [x] 2.1 Adicionar tipos `ReviewItem`, `ReviewAggregate` e `ProductReviewsResponse` em `src/domain/catalog/types.ts`
- [x] 2.2 Adicionar função `getProductReviews(id, params)` em `src/services/catalog.service.ts` com `revalidate: 300` e construção de query string para `page`, `limit`, `rating` e `sort`

## 3. Frontend — Componentes (do menor para o maior)

- [x] 3.1 Criar `review-card.tsx` (Server Component): exibe estrelas, país, data relativa em pt-BR, texto opcional e faixa de fotos em miniatura
- [x] 3.2 Criar `review-list.tsx` (Server Component): renderiza lista de `ReviewItem[]` usando `ReviewCard` e botão "Ver mais avaliações" quando `hasMore: true`
- [x] 3.3 Criar `review-filters.tsx` (Client Component): dropdowns "Ordenar" (recent/top) e "Qualificação" (1–5 estrelas ou todos) que fazem `router.push` com os params atualizados
- [x] 3.4 Criar `review-photos-gallery.tsx` (Client Component): faixa horizontal com overflow-x scroll das fotos de compradores; clique abre lightbox/modal com a foto ampliada
- [x] 3.5 Criar `review-aggregate.tsx` (Server Component): nota média com estrelas, total de avaliações e barras de distribuição por estrela; clique na barra navega para `?rating=N`
- [x] 3.6 Criar `product-reviews-section.tsx` (async Server Component): lê `searchParams` da URL, chama `getProductReviews`, compõe `ReviewAggregate` + `ReviewPhotosGallery` + resumo de IA + `ReviewFilters` + `ReviewList`; retorna `null` quando `aggregate.reviewCount === 0`

## 4. Frontend — Integração na Página

- [x] 4.1 Adicionar `<Suspense fallback={<ReviewsSectionSkeleton />}>` ao redor de `<ProductReviewsSection productId={id} searchParams={searchParams} />` em `src/app/(home)/produto/[id]/page.tsx`, abaixo de `<ProductSpecs>`
- [x] 4.2 Criar skeleton `ReviewsSectionSkeleton` em `loading.tsx` ou como componente inline para o Suspense boundary da seção de reviews
- [x] 4.3 Atualizar a assinatura de `ProductDetailPage` para receber `searchParams` e passá-los ao `ProductReviewsSection`

## 5. Validação

- [x] 5.1 Verificar renderização da seção em produto com reviews: nota geral, barras, galeria de fotos, resumo de IA (se disponível), filtros e lista com cards completos
- [x] 5.2 Verificar que produto sem reviews não exibe a seção
- [x] 5.3 Testar filtro por estrela via clique nas barras e via dropdown de Qualificação
- [x] 5.4 Testar ordenação por "Mais recentes" e "Melhor avaliadas"
- [x] 5.5 Testar paginação: botão "Ver mais" carrega próxima página; some na última página
- [x] 5.6 Verificar que o Suspense boundary funciona: demais blocos da página carregam independentemente dos reviews
