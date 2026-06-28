## Context

O marketplace tem uma home com grid de departamentos (`DepartmentsGrid`) cujos cards são `<button>` não navegáveis. O backend expõe `GET /catalog/departments` (id, label, icon) e `GET /catalog/products?category=` (paginação por offset, filtros avançados, `hasMore`). A mudança é inteiramente frontend — nenhuma nova rota de backend é necessária. A change de busca (`pagina-de-resultados-de-pesquisa`) adiciona ao endpoint `catalog/products` os params de filtros avançados, paginação e `hasMore` que esta mudança também reutiliza.

## Goals / Non-Goals

**Goals:**
- Tornar os cards de departamento navegáveis com URL `/c/{categoryId}` compartilhável
- Renderizar SSR da primeira carga (20 produtos) com infinite scroll client-side subsequente
- Reutilizar `ProductCard`, layout de grid e os sub-componentes de filtro já existentes
- Filtros refletidos na URL para compatibilidade com back/forward e compartilhamento

**Non-Goals:**
- Busca textual dentro da categoria (barra de busca da Navbar já cobre isso)
- Breadcrumb hierárquico de subcategorias
- Contagem de resultados por filtro (facetas)
- Ordenação e filtragem server-side paginada sem infinite scroll

## Decisions

### D1 — Rota de parâmetro de caminho `/c/[categoryId]`, não query param

A categoria é parte da identidade da página, não um filtro opcional. Usar rota dinâmica `/c/[categoryId]` torna URLs limpas e semânticas (`/c/smartphones` vs `/categoria?cat=smartphones`). Os demais filtros continuam como query params.

**Alternativa descartada:** `?category=X` na mesma rota `/categoria` — perde semântica de URL e dificulta cache por rota no Next.js.

### D2 — Resolução do nome da categoria via GET /catalog/departments no Server Component

O `categoryId` na rota é o `id` do Department. O Server Component chama `GET /catalog/departments` para encontrar o `label` correspondente e exibir o título da página. Se nenhum department com aquele `id` existir, chama `notFound()` (404 automático do Next.js).

**Alternativa descartada:** passar o `label` como query param `?name=Smartphones` — frágil (manipulável, pode ficar fora de sync com o backend) e ilegível na URL.

### D3 — CategoryFiltersPanel independente do SearchFiltersPanel

O painel de filtros da categoria é estruturalmente idêntico ao da busca, exceto pela ausência do filtro de categoria. Em vez de acoplar ao `SearchFiltersPanel` via prop `showCategoryFilter`, criamos um `CategoryFiltersPanel` independente. As duas changes podem evoluir sem interferência, e a duplicação de código é mínima (o comportamento dos sub-filtros é simples).

**Alternativa descartada:** `FiltersPanel` genérico com prop `showCategoryFilter` — cria acoplamento entre duas changes com ciclos de vida independentes.

### D4 — Arquitetura híbrida: primeira carga SSR + infinite scroll client-side

Idêntica à da página de busca (D2 da change `pagina-de-resultados-de-pesquisa`): `page.tsx` é Server Component, busca os primeiros 20 produtos e passa `items` + `hasMore` para `CategoryResultsClient`, que gerencia o scroll via Intersection Observer.

### D5 — "Limpar filtros" remove todos os query params (rota permanece `/c/{id}`)

Na página de busca, limpar filtros preserva `?q=`. Aqui, a categoria está no path — limpar filtros remove apenas os query params, e a URL volta para `/c/{categoryId}` limpa.

### D6 — DepartmentsGrid: button → Link

Trocar `<button>` por `<Link href={/c/${dept.id}}>` no componente existente. A mudança é pontual e não altera o visual. O componente permanece Server Component.

## Risks / Trade-offs

**[Risk] Categoria inválida na URL** → Mitigação: Server Component chama `notFound()` se o `categoryId` não corresponder a nenhum department retornado por `/catalog/departments`.

**[Risk] GET /catalog/departments chamado a cada render da categoria** → Mitigação: usar `next: { revalidate: 3600 }` no fetch — lista de departamentos muda raramente.

**[Risk] Infinite scroll com troca de filtros: lista deve resetar** → Mitigação: `CategoryResultsClient` monitora mudança das props iniciais (nova URL = novo render SSR com novos dados); `useEffect` dependente das props reseta `items` e `offset`.

**[Trade-off] Dois painéis de filtro quase idênticos (categoria e busca)** → A duplicação é justificada pelo desacoplamento entre as duas changes e pela pequena superfície de código (cada filtro individual é simples). Se um terceiro contexto surgir, extrair sub-componentes compartilhados.

## Migration Plan

1. Frontend: implementar `getProductsByCategory` no service e novos tipos em `src/types/category.ts`
2. Frontend: criar página `/c/[categoryId]/` com `page.tsx`, `loading.tsx` e `_components/`
3. Frontend: trocar `<button>` por `<Link>` no `DepartmentsGrid`
4. Smoke test manual: clicar em departamento, aplicar filtros, rolar até o fim (infinite scroll), URL compartilhável, categoria inválida retorna 404

Rollback: a única mudança em arquivo existente é `departments-grid.tsx`. Reverter o `<Link>` para `<button>` não afeta nenhuma outra página.

## Open Questions

- O `id` dos departments retornado por `GET /catalog/departments` é estável (ex: slug ou UUID)? Isso determina se a URL é legível (`/c/smartphones`) ou opaca (`/c/abc123`).
- A change `pagina-de-resultados-de-pesquisa` estará implementada antes desta? Se não, os parâmetros de filtro avançado no endpoint precisam ser verificados com o backend antes de expor os filtros.
