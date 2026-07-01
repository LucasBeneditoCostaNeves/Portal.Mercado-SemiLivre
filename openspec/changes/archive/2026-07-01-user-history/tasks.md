## 1. Backend — Banco de Dados

- [x] 1.1 Criar migration para tabela `user_search_history` com campos `id`, `user_id`, `term`, `searched_at` e índice `(user_id, searched_at DESC)`
- [x] 1.2 Criar migration para tabela `user_product_clicks` com campos `id`, `user_id`, `product_id`, `source_page`, `clicked_at` e índice `(user_id, clicked_at DESC)`
- [x] 1.3 Rodar migrations no ambiente de desenvolvimento e validar estrutura das tabelas

## 2. Backend — Rotas de Histórico

- [x] 2.1 Criar rota `POST /history/search` com validação de token, validação de `term` (2–255 chars) e lógica de deduplicação de 60 segundos
- [x] 2.2 Criar rota `POST /history/product-click` com validação de token, `productId` e enum de `sourcePage` (`home`, `search`, `category`, `product`)
- [x] 2.3 Criar rota `GET /history/searches` que retorna até 10 termos distintos ordenados pelo mais recente
- [x] 2.4 Adicionar guard de autenticação (401) em todas as rotas `/history/*`
- [ ] 2.5 Testar os três endpoints manualmente com token válido e inválido

## 3. Frontend — Service e Tipos

- [x] 3.1 Criar tipos TypeScript para `UserSearchHistoryItem` e `UserProductClickEvent` em `src/types/history.ts`
- [x] 3.2 Criar Server Action `recordSearch(term: string)` em `src/actions/history.ts` que chama `POST /history/search` com o token de `getSession()`
- [x] 3.3 Criar Server Action `recordProductClick(productId: string, sourcePage: string)` que chama `POST /history/product-click`
- [x] 3.4 Criar função `fetchSearchHistory(): Promise<UserSearchHistoryItem[]>` que chama `GET /history/searches` server-side

## 4. Frontend — Integração na Página de Busca

- [x] 4.1 Chamar `recordSearch(q)` de forma fire-and-forget no Server Component da página `/buscar` após validação do param `q` (somente se usuário autenticado)

## 5. Frontend — SearchBar com Histórico

- [x] 5.1 Converter `SearchBar` para Client Component (se ainda for Server Component) para suportar estado de foco e dropdown
- [x] 5.2 Ao focar no input, buscar histórico via route handler ou passar como prop server-side e exibir dropdown com até 5 itens (label "Buscas recentes", ícone de relógio)
- [x] 5.3 Ao clicar em item do dropdown, preencher input e navegar para `/buscar?q={termo}`
- [x] 5.4 Fechar dropdown ao clicar fora (usar `onBlur` com delay ou `mousedown` no document)
- [x] 5.5 Não exibir dropdown para usuário não autenticado

## 6. Frontend — Registro de Clique em Produto

- [x] 6.1 Adicionar prop `sourcePage` ao `ProductCard` (ou ao componente wrapper que o usa)
- [x] 6.2 No `onClick` do `ProductCard`, chamar `recordProductClick(productId, sourcePage)` fire-and-forget antes de navegar
- [x] 6.3 Passar `sourcePage: "search"` nos ProductCards da página `/buscar`
- [x] 6.4 Passar `sourcePage: "home"` nos ProductCards da home
- [x] 6.5 Passar `sourcePage: "category"` nos ProductCards da página de categoria

## 7. Validação e QA

- [ ] 7.1 Verificar que buscas são registradas ao navegar para `/buscar` (confirmar no banco)
- [ ] 7.2 Verificar que o dropdown de histórico exibe os termos corretos ao focar no SearchBar
- [ ] 7.3 Verificar que cliques em produtos geram registros com `source_page` correto
- [ ] 7.4 Verificar que usuário não autenticado não gera nenhum registro e não vê dropdown
- [ ] 7.5 Verificar que falha no backend de histórico não quebra nenhuma ação do usuário
