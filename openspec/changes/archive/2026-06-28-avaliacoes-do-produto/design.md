## Context

A página `/produto/[id]` já exibe `rating` e `reviewCount` agregados no bloco `ProductInfo`. O repositório de catálogo já faz eager loading de `ReviewProduct[]` (spec `catalog-product-detail-api`), mas esses dados não são expostos pela API nem consumidos pelo frontend. O banco já tem as entidades necessárias; falta apenas a camada de exposição e apresentação.

## Goals / Non-Goals

**Goals:**

- Expor um endpoint paginado e filtrável para reviews de um produto
- Renderizar a seção de avaliações na página de detalhe sem alterar blocos existentes
- Suportar filtro por qualificação (estrelas) e ordenação via URL search params para SSR correto

**Non-Goals:**

- Criar ou editar avaliações (formulário de review não está no escopo)
- Geração dinâmica de resumo de IA (exibir apenas o campo `aiSummary` já armazenado, se presente)
- Moderação ou denúncia de avaliações
- Internacionalização de países além do que já vem da API

## Decisions

### 1. Endpoint dedicado: `GET /catalog/products/:id/reviews`

**Alternativa descartada**: incluir reviews no response de `GET /catalog/products/:id`.  
**Razão**: o payload atual de detalhe já é completo e cacheado por 1h; adicionar uma lista paginada e filtrável no mesmo response tornaria o cache ineficiente e o payload imprevisível em tamanho. Endpoint separado permite estratégias de cache independentes e paginação limpa.

**Shape do response**:

```ts
{
  aggregate: {
    rating: number          // média já calculada (reutiliza campo existente)
    reviewCount: number
    distribution: Record<1|2|3|4|5, number>  // contagem por estrela
    aiSummary?: string
    photos: string[]        // todas as fotos de reviews, para a galeria
  },
  items: ReviewItem[]
  total: number
  hasMore: boolean
}

type ReviewItem = {
  id: string
  rating: number           // 1–5
  text?: string
  photos: string[]
  country?: string
  createdAt: string        // ISO 8601
}
```

**Query params**: `?page=1&limit=10&rating=5&sort=recent|top`

### 2. Filtros via URL Search Params (Server Component + `useRouter` no Client)

**Razão**: manter os filtros na URL permite SSR correto da lista inicial, compartilhamento de links e funcionamento sem JS. Os controles de filtro (dropdowns) são Client Components que fazem `router.push` com novos params — a página revalida automaticamente.

Não usar estado local (useState) nos filtros, pois perderia o SSR da lista.

### 3. Busca de reviews via `Suspense` na página

A `page.tsx` já busca `getProductDetail(id)`. Reviews terão fetch separado via `<Suspense>` ao redor de `<ProductReviewsSection>`, que é um async Server Component que chama `getProductReviews(id, params)`.

Isso garante que a página não bloqueia na lista de reviews (que pode ser lenta em produtos com muitas avaliações) e permite um skeleton específico para essa seção.

### 4. Cache: `revalidate: 300` para reviews

Reviews mudam com mais frequência que dados de produto. 5 minutos de cache é um equilíbrio razoável entre frescor e custo de rede.

### 5. Localização dos novos componentes

```
src/app/(home)/produto/[id]/_components/
  product-reviews-section.tsx   ← Server Component (orquestrador)
  review-aggregate.tsx          ← Server Component (nota geral + barras)
  review-photos-gallery.tsx     ← Client Component (scroll horizontal)
  review-filters.tsx            ← Client Component (sort + rating filter)
  review-list.tsx               ← Server Component (lista de cards)
  review-card.tsx               ← Server Component (card individual)
```

Tipos em `src/domain/catalog/types.ts` (extensão do arquivo existente).

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| `ReviewProduct` no banco não tem campo `country` ou `photos` | Verificar schema antes de implementar; se ausente, omitir do response sem quebrar contrato |
| `aiSummary` ausente na maioria dos produtos | Campo opcional no tipo; UI renderiza a subseção apenas quando presente |
| Produtos com milhares de reviews causando payload grande | Paginação com `limit=10` por padrão; endpoint nunca retorna todos os items de uma vez |
| Filtro por estrela via URL recarrega a página inteira | Aceitável para SSR; pode ser otimizado com React Server Actions + `startTransition` em iterações futuras |

## Migration Plan

1. Implementar e subir o endpoint no Mercado-SemiLivre.api
2. Adicionar `getProductReviews` em `catalog.service.ts` no portal
3. Adicionar os novos tipos em `domain/catalog/types.ts`
4. Implementar os componentes do menor para o maior (card → list → filters → aggregate → section)
5. Adicionar `<ProductReviewsSection>` na `page.tsx` abaixo de `<ProductSpecs>`
6. Deploy sem feature flag — a seção simplesmente não aparece se `reviewCount === 0`

Rollback: remover `<ProductReviewsSection>` da `page.tsx`; o restante da página é independente.
