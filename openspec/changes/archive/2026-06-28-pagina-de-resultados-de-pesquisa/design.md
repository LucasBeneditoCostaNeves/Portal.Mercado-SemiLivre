## Context

O marketplace tem uma home com grid de produtos (Server Components, fetch direto ao backend) e uma Navbar com input de busca não funcional. O backend expõe `GET /catalog/products` com filtros de categoria e paginação por `skip`. O frontend usa fetch nativo com cache de 60s, sem Axios. A mudança abrange dois repositórios: `Portal.Mercado-SemiLivre` (frontend Next.js 16) e `Mercado-SemiLivre.api` (backend).

## Goals / Non-Goals

**Goals:**
- Tornar a busca funcional de ponta a ponta (Navbar → página de resultados → backend)
- Suportar filtros avançados refletidos na URL para compartilhamento e SSR
- Infinite scroll client-side com primeira carga SSR
- Reutilizar `ProductCard` e padrões visuais existentes sem duplicar código

**Non-Goals:**
- Autocomplete / sugestões em tempo real durante a digitação
- Histórico de buscas ou buscas salvas
- Busca por voz
- Facetas com contagem de resultados por filtro

## Decisions

### D1 — Filtros na URL, não em estado React

Os filtros (`?q=notebook&sort=price&order=asc&freeShipping=true&minPrice=100`) vivem na URL via `useRouter` + `useSearchParams`. Alternativa descartada: estado local React (perde compartilhamento, back/forward e SSR da primeira carga).

**Como funciona:** `FiltersPanel` é um Client Component que lê `useSearchParams` para inicializar o estado local dos filtros. Ao aplicar, chama `router.push` com os novos params. A mudança de URL dispara uma nova requisição SSR na página.

### D2 — Arquitetura híbrida: primeira carga SSR + infinite scroll client-side

`buscar/page.tsx` é um Server Component que lê `searchParams`, chama `searchProducts` e passa os primeiros 20 resultados + `hasMore` como props para `SearchResultsClient`. O client component gerencia o scroll e busca as páginas seguintes via `fetch` direto ao backend (não Server Actions — Server Actions são para mutações).

**Por que não tudo client-side:** a primeira carga SSR garante que o conteúdo seja indexável e que o usuário veja resultados imediatos sem loading spinner. Os resultados de busca têm `noindex`, então indexabilidade não é o driver aqui — mas a ausência de loading spinner na primeira carga é UX relevante.

**Por que não tudo server-side com paginação tradicional:** o produto exige infinite scroll, que por natureza é client-side.

### D3 — Busca textual via query param `q` no endpoint existente

Estender `GET /catalog/products` com `q` (substring match case-insensitive no `title`) em vez de criar um endpoint separado `/catalog/search`. Isso mantém o contrato de resposta consistente e evita duplicação de lógica de paginação e shape no backend.

**Alternativa descartada:** endpoint separado `/catalog/search` — aumentaria a superfície de API sem benefício real no MVP.

### D4 — Paginação por `offset`, não por `skip` + cursor

O endpoint atual usa `skip`. A mudança padroniza para `offset` (semântica mais clara para infinite scroll). Os dois nomes são sinônimos — backend pode aceitar ambos ou migrar o parâmetro.

**Alternativa descartada:** cursor-based pagination — mais complexa de implementar no backend relacional e desnecessária para o volume atual.

### D5 — FiltersPanel: sidebar em desktop, drawer em mobile

Em desktop (≥1024px): sidebar fixa à esquerda do grid, sempre visível. Em mobile: botão "Filtros" com badge de contagem abre um drawer deslizante de baixo para cima (dialog/aside posicionado fixo). Sem biblioteca externa — implementado com `position: fixed` + `transform` + `transition`.

**Alternativa descartada:** modal overlay — perde o contexto visual dos resultados no mobile.

### D6 — Navbar: Client Component com `useSearchParams`

O `Navbar` precisa ler o `q` atual para preencher o input quando o usuário está em `/buscar`. `useSearchParams` requer `"use client"`. O Navbar já tem interatividade (ThemeToggle), então a mudança de boundary é zero — já era ou será Client Component. O `<form>` usa `action="/buscar"` e `method="GET"` para funcionar inclusive sem JS.

## Risks / Trade-offs

**[Risk] Filtros aplicados via `router.push` causam full page reload no Next.js App Router** → Mitigação: usar `router.replace` com `scroll: false` para navegação shallow dentro da mesma página. O Server Component reexecuta, mas o layout não desmonta.

**[Risk] Infinite scroll com filtros: ao mudar filtro, a lista deve resetar para offset 0** → Mitigação: `SearchResultsClient` observa mudanças nas props iniciais (quando a URL muda, o Server Component re-renderiza e passa novos dados); o estado de `items` e `offset` é resetado via `useEffect` dependente das props iniciais.

**[Risk] Backend não suporta os novos parâmetros ainda** → Mitigação: `searchProducts` no frontend é desenvolvido em paralelo com o backend. Os filtros são aplicados com os parâmetros disponíveis; a função tem tipagem clara para facilitar o contrato.

**[Trade-off] Primeira carga SSR + client scroll vs. tudo client-side** → A abordagem híbrida adiciona complexidade de sincronização de estado (reset ao mudar filtros), mas entrega melhor UX na primeira carga e mantém URLs compartilháveis.

## Migration Plan

1. Backend (`Mercado-SemiLivre.api`): adicionar suporte aos novos params em `GET /catalog/products` — todos opcionais, sem breaking change
2. Frontend: implementar `searchProducts` no service e os novos tipos em `src/types/search.ts`
3. Frontend: implementar a página `/buscar` com componentes
4. Frontend: conectar o Navbar
5. Smoke test manual: busca por termo existente, filtros combinados, estado vazio, compartilhar URL com filtros

Rollback: a mudança no Navbar é a única que afeta página existente. Se necessário, reverter `navbar.tsx` para o input estático sem form — sem impacto em outras páginas.

## Open Questions

- O backend retornará `brands` e `categories` disponíveis para os checkboxes de filtro, ou esses valores serão derivados dos resultados da primeira página? (Se não houver endpoint dedicado, mostrar apenas os valores presentes nos resultados atuais.)
- Qual o limite máximo de resultados que o backend suporta por página? (Assumindo 20 até confirmação.)
