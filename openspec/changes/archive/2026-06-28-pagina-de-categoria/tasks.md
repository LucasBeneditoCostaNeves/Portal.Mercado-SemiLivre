## 1. Tipos e Camada de Serviço

- [x] 1.1 Criar `src/types/category.ts` com o tipo `CategoryPageSearchParams` (sort, order, freeShipping, minPrice, maxPrice, minRating, brand)
- [x] 1.2 Criar função `getProductsByCategory(categoryId: string, params: CategoryPageSearchParams)` em `src/services/catalog.service.ts`, chamando `GET /catalog/products?category={categoryId}&...`
- [x] 1.3 Garantir que `getCatalogDepartments()` (ou equivalente) existe em `src/services/catalog.service.ts` e retorna `Department[]` — reutilizar se já existir

## 2. DepartmentsGrid: Botões Navegáveis

- [x] 2.1 Converter os `<button>` do `DepartmentsGrid` em `<Link href={/c/${dept.id}}>` mantendo todo o estilo visual existente

## 3. Fundação da Página de Categoria

- [x] 3.1 Criar diretório `src/app/(home)/c/[categoryId]/` e arquivo `loading.tsx` com skeleton do grid de produtos (mesmo padrão do skeleton da página de busca)
- [x] 3.2 Criar `src/app/(home)/c/[categoryId]/_components/category-header.tsx` — exibe `<h1>` com nome da categoria e subtítulo com contagem de produtos
- [x] 3.3 Criar `src/app/(home)/c/[categoryId]/_components/empty-category-state.tsx` — exibe mensagem e CTA adaptados ao contexto (sem filtros vs. com filtros ativos)
- [x] 3.4 Criar `src/app/(home)/c/[categoryId]/page.tsx` como Server Component: resolve nome da categoria via `getCatalogDepartments()` + `notFound()` se não encontrado, chama `getProductsByCategory`, exporta `metadata` com título e renderiza `CategoryHeader` + `CategoryResultsClient` (ou `EmptyCategoryState` se zero resultados)

## 4. CategoryResultsClient — Infinite Scroll

- [x] 4.1 Criar `src/app/(home)/c/[categoryId]/_components/category-results-client.tsx` como Client Component com grid `grid-cols-2 lg:grid-cols-5` usando `ProductCard`, sentinel element e Intersection Observer para carregar próximas páginas via `getProductsByCategory`
- [x] 4.2 Implementar skeleton cards exibidos durante carregamento de página adicional
- [x] 4.3 Implementar mensagem "Você viu todos os produtos" quando `hasMore` é `false`
- [x] 4.4 Implementar reset de `items` e `offset` para 0 via `useEffect` dependente das props iniciais (garante reset ao trocar filtros)

## 5. CategoryFiltersPanel

- [x] 5.1 Criar `src/app/(home)/c/[categoryId]/_components/category-filters-panel.tsx` com layout sidebar (desktop ≥1024px) e drawer deslizante de baixo para cima (mobile), sem biblioteca externa
- [x] 5.2 Implementar `SortSelect` dentro do painel com as 5 opções de ordenação (relevância, menor preço, maior preço, melhor avaliação, mais vendidos) mapeadas para `sort`/`order` na URL
- [x] 5.3 Implementar toggle "Frete grátis" mapeado para `freeShipping=true` na URL
- [x] 5.4 Implementar inputs de "Preço mínimo" e "Preço máximo" mapeados para `minPrice`/`maxPrice` na URL
- [x] 5.5 Implementar seletor de estrelas (1–5) para avaliação mínima, mapeado para `minRating` na URL; clicar na estrela já selecionada remove o filtro
- [x] 5.6 Implementar lista de marcas com checkboxes derivados dos resultados atuais, mapeados para `brand=A,B` na URL
- [x] 5.7 Implementar botões "Aplicar filtros" (`router.replace` com novos params) e "Limpar filtros" (remove todos os query params, URL volta para `/c/{categoryId}`)
- [x] 5.8 Implementar badge numérico no botão "Filtros" do mobile com contagem de filtros ativos (excluindo `sort`/`order`)
