## Why

A página de detalhe do produto exibe `rating` e `reviewCount` agregados, mas não oferece nenhuma seção de avaliações individuais — o usuário não consegue ler opiniões, ver fotos de compradores reais ou filtrar por qualificação. A ausência dessas informações reduz a confiança na compra e aumenta a taxa de abandono.

## What Changes

- Novo endpoint público `GET /catalog/products/:id/reviews` com suporte a paginação, filtro por qualificação e ordenação
- Nova seção "Opiniões do produto" adicionada abaixo da tabela de especificações na página `/produto/[id]`, contendo:
  - Nota geral com estrelas e total de avaliações
  - Distribuição por estrelas (barras de progresso clicáveis como filtro rápido)
  - Galeria horizontal de fotos enviadas por compradores
  - Resumo gerado por IA (texto estático exibido quando disponível na API)
  - Controles de ordenação (mais recentes, melhor avaliadas) e filtro por qualificação
  - Lista paginada de avaliações individuais (estrelas, país, data relativa, texto, fotos)

## Capabilities

### New Capabilities

- `product-reviews-section`: Seção de avaliações na página do produto — nota geral, barras de distribuição, galeria de fotos, resumo de IA, filtros e lista de reviews individuais
- `catalog-product-reviews-api`: Endpoint `GET /catalog/products/:id/reviews` com paginação, filtro por rating e ordenação, retornando dados de `ReviewProduct` já carregados no repositório

### Modified Capabilities

- `product-detail-page`: A página passa a renderizar `<ProductReviewsSection>` abaixo da tabela de especificações, recebendo o `productId` como prop; nenhum outro bloco existente é alterado

## Impact

- **API (Mercado-SemiLivre.api)**: novo controller, use case e rota em `/catalog/products/:id/reviews`; reutiliza o eager loading de `ReviewProduct[]` já presente no `CatalogRepository`
- **Frontend (Portal.Mercado-SemiLivre)**: novos componentes em `src/app/(home)/produto/[id]/`; nova função `getProductReviews()` em `catalog.service.ts`; novos tipos em `types/reviews.ts`
- **Sem breaking changes**: a rota de detalhe existente e seu contrato de resposta não são alterados
