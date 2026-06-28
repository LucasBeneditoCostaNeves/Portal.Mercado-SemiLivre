## Why

O input de busca da Navbar existe visualmente mas não tem funcionalidade — usuários que pesquisam algo ficam presos na home sem resultado. Esta mudança entrega a experiência de busca completa: submissão pelo Navbar, página de resultados com infinite scroll, filtros avançados e ordenação, tornando o marketplace utilizável como ferramenta de descoberta de produtos.

## What Changes

- O `<input>` de busca da Navbar passa a ser um `<form>` funcional que redireciona para `/buscar?q={termo}`
- Nova página `/buscar` renderiza produtos filtrados por nome a partir do backend
- O endpoint `GET /catalog/products` recebe novos parâmetros: `q`, `offset`, `sort`, `order`, `freeShipping`, `minPrice`, `maxPrice`, `minRating`, `brand`, `category`
- A resposta do endpoint passa a incluir `hasMore: boolean` para suportar infinite scroll
- Infinite scroll client-side carrega 20 produtos por vez via Intersection Observer
- Painel de filtros com: ordenação (5 opções), frete grátis, faixa de preço, avaliação mínima, marca e categoria
- Todos os filtros ativos refletem na URL como query params (compartilhável, SSR-friendly)
- Estado vazio quando nenhum produto corresponde à pesquisa
- `loading.tsx` com skeleton do grid

## Capabilities

### New Capabilities

- `product-search-page`: Página `/buscar?q={termo}` — Server Component que lê query params, renderiza resultados paginados com infinite scroll, painel de filtros e estado vazio
- `search-filters`: Componentes de filtro e ordenação — painel sidebar (desktop) / drawer (mobile) com ordenação, frete grátis, faixa de preço, avaliação mínima, marca e categoria; estado refletido na URL

### Modified Capabilities

- `catalog-products-api`: Adiciona suporte a busca textual (`q`), paginação por offset, ordenação (`sort`, `order`) e filtros avançados (`freeShipping`, `minPrice`, `maxPrice`, `minRating`, `brand`, `category`); resposta passa a incluir `hasMore: boolean`
- `home-page`: Requisito da Navbar é expandido — o input de busca passa a ser um `<form>` funcional com `action="/buscar"`, preenchido com o termo atual quando o usuário está na página de resultados

## Impact

- **Frontend**: `src/app/(home)/_components/navbar.tsx` (modificado), `src/app/(home)/buscar/` (novo diretório com `page.tsx`, `loading.tsx`, `_components/`), `src/services/catalog.service.ts` (nova função `searchProducts`), `src/types/search.ts` (novos tipos)
- **Backend** (`Mercado-SemiLivre.api`): `GET /catalog/products` precisa aceitar os novos parâmetros de busca e retornar `hasMore`
- **Sem breaking changes** para consumidores existentes do endpoint — todos os novos parâmetros são opcionais
