## Why

Os cards de departamento da home são elementos visuais não navegáveis — o usuário vê as categorias mas não consegue explorar os produtos de uma delas. Esta mudança entrega a experiência de navegação por categoria: clicar em um departamento leva a uma página dedicada com todos os produtos daquela categoria, filtros avançados e infinite scroll.

## What Changes

- Os `<button>` do `DepartmentsGrid` passam a ser `<Link>` navegando para `/c/{department.id}`
- Nova página `/c/[categoryId]` busca o nome da categoria via `GET /catalog/departments` e os produtos via `GET /catalog/products?category={categoryId}`
- A página renderiza título com o nome da categoria, grid de produtos com infinite scroll (20 por vez), painel de filtros e estado vazio
- O painel de filtros replica o da busca, porém **sem** o filtro de categoria (já estamos dentro de uma)
- Todos os filtros ativos refletem na URL como query params (compartilhável, SSR-friendly)
- `loading.tsx` com skeleton do grid

## Capabilities

### New Capabilities

- `category-page`: Página `/c/[categoryId]` — Server Component que resolve o nome da categoria, renderiza produtos filtrados por `category=` com infinite scroll, painel de filtros e estado vazio
- `category-filters`: Painel de filtros da categoria — sidebar (desktop) / drawer (mobile) com ordenação, frete grátis, faixa de preço, avaliação mínima e marca; sem filtro de categoria; estado refletido na URL

### Modified Capabilities

- `home-page`: Os `<button>` do `DepartmentsGrid` passam a ser `<Link href="/c/{id}">`, tornando os departamentos navegáveis

## Impact

- **Frontend**: `src/app/(home)/_components/departments-grid.tsx` (modificado — button → Link), `src/app/(home)/c/[categoryId]/` (novo diretório com `page.tsx`, `loading.tsx`, `_components/`), `src/services/catalog.service.ts` (nova função `getProductsByCategory`), `src/types/category.ts` (novos tipos)
- **Backend** (`Mercado-SemiLivre.api`): nenhuma mudança — a página reutiliza `GET /catalog/products?category=` e `GET /catalog/departments` já existentes
- **Sem breaking changes** — todos os endpoints consumidos já existem; a única modificação em arquivo existente é `departments-grid.tsx`
