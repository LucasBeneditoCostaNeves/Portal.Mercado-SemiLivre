## 1. Tipos e Contrato de API

- [x] 1.1 Criar `src/types/search.ts` com os tipos `SearchParams`, `SearchResult`, `SortOption`, `FilterState`
- [x] 1.2 Adicionar função `searchProducts(query: string, params: SearchParams): Promise<SearchResult>` em `src/services/catalog.service.ts` — endpoint `GET /catalog/products?q=...` com cache de 30s
- [x] 1.3 Atualizar o tipo de retorno do backend em `catalog.service.ts` para incluir `hasMore: boolean` na resposta de `SearchResult`

## 2. Navbar — Busca Funcional

- [x] 2.1 Envolver o input e botão de busca em `<form action="/buscar" method="GET" role="search" aria-label="Buscar produtos">` em `src/app/(home)/_components/navbar.tsx`
- [x] 2.2 Adicionar `name="q"` e `required` ao `<input>` de busca
- [x] 2.3 Fazer o Navbar ler o query param `q` atual (via `useSearchParams` ou prop do Server Component) e preencher o input quando na página `/buscar`

## 3. Página de Resultados — Estrutura Base

- [x] 3.1 Criar o diretório `src/app/(home)/buscar/` e o Server Component `page.tsx` que lê `searchParams.q` e redireciona para `/` se ausente ou `< 2 chars`
- [x] 3.2 Adicionar `<title>` e `<meta name="robots" content="noindex">` via `generateMetadata` em `buscar/page.tsx`
- [x] 3.3 Criar `src/app/(home)/buscar/loading.tsx` com skeleton do grid (reutilizar padrão de `produto/[id]/loading.tsx`)
- [x] 3.4 Criar `src/app/(home)/buscar/_components/search-header.tsx` — exibe "{N} resultado(s) para '{q}'"
- [x] 3.5 Criar `src/app/(home)/buscar/_components/empty-search-state.tsx` — ícone de lupa, mensagem, CTA para `/`

## 4. Infinite Scroll

- [x] 4.1 Criar `src/app/(home)/buscar/_components/product-grid-skeleton.tsx` com skeleton de cards para loading de próxima página
- [x] 4.2 Criar `src/app/(home)/buscar/_components/search-results-client.tsx` — Client Component que recebe `initialItems`, `initialHasMore`, `query` e `filters` como props
- [x] 4.3 Implementar Intersection Observer no `SearchResultsClient` para detectar quando o sentinel é visível e disparar fetch da próxima página
- [x] 4.4 Implementar lógica de reset de `items` e `offset` quando as props de filtro mudarem (via `useEffect`)
- [x] 4.5 Exibir "Você viu todos os resultados" quando `hasMore` for `false`

## 5. Filtros e Ordenação

- [x] 5.1 Criar `src/app/(home)/buscar/_components/sort-select.tsx` — dropdown com as 5 opções de ordenação; ao mudar, chama `router.replace` com novos params
- [x] 5.2 Criar `src/app/(home)/buscar/_components/filters-panel.tsx` — Client Component com sidebar (desktop) e drawer (mobile)
- [x] 5.3 Implementar toggle "Frete grátis" no `FiltersPanel`
- [x] 5.4 Implementar inputs "Preço mínimo" e "Preço máximo" no `FiltersPanel`
- [x] 5.5 Implementar seletor de estrelas (avaliação mínima 1–5) no `FiltersPanel`
- [x] 5.6 Implementar lista de checkboxes de marcas no `FiltersPanel` (derivadas dos resultados atuais)
- [x] 5.7 Implementar lista de checkboxes de categorias no `FiltersPanel` (derivadas dos resultados atuais)
- [x] 5.8 Implementar botões "Aplicar filtros" e "Limpar filtros" — "Aplicar" chama `router.replace`; "Limpar" remove todos os params exceto `q`
- [x] 5.9 Implementar badge de contagem de filtros ativos no botão "Filtros" do mobile

## 6. Composição Final da Página

- [x] 6.1 Compor `buscar/page.tsx` com `SearchHeader`, `FiltersPanel` e `SearchResultsClient`, passando os dados da primeira carga SSR como props
- [x] 6.2 Garantir layout responsivo: sidebar à esquerda + grid à direita em desktop; botão "Filtros" + grid em mobile
- [x] 6.3 Garantir que `EmptySearchState` é renderizado quando `total === 0`

## 7. Backend — Novos Parâmetros do Endpoint

- [x] 7.1 Adicionar suporte ao param `q` (substring match case-insensitive no `title`) em `GET /catalog/products` na API (`Mercado-SemiLivre.api`)
- [x] 7.2 Adicionar suporte aos params `sort` e `order` na API
- [x] 7.3 Adicionar suporte aos params `freeShipping`, `minPrice`, `maxPrice`, `minRating`, `brand`, `category` na API
- [x] 7.4 Adicionar suporte ao param `offset` (além do `skip` existente) e incluir `hasMore: boolean` na resposta
