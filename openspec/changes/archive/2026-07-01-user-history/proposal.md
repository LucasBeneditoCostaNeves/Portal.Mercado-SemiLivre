## Why

Atualmente o sistema não registra nenhuma ação do usuário, perdendo dados valiosos de comportamento e impedindo features de UX como histórico de buscas no input. Registrar buscas e cliques em produtos permite melhorar a descoberta de produtos e criar experiências personalizadas no curto prazo.

## What Changes

- Criação de rotas no backend (`Mercado-SemiLivre.api`) para receber e consultar eventos de histórico do usuário
- Criação de tabelas no banco de dados para armazenar buscas realizadas e produtos clicados por usuário autenticado
- Exibição do histórico de buscas recentes ao focar no input de pesquisa (`SearchBar`)
- Envio silencioso (fire-and-forget) de eventos do front-end para o back-end quando o usuário realiza uma busca ou clica em um produto

## Capabilities

### New Capabilities

- `user-search-history`: Registrar termos de busca por usuário autenticado e exibi-los como sugestões ao focar no `SearchBar`
- `user-product-click-history`: Registrar cliques em produtos (product_id, origem da página) por usuário autenticado
- `user-history-api`: Rotas REST no backend para receber (`POST`) e consultar (`GET`) eventos de histórico do usuário

### Modified Capabilities

- `product-search-page`: Adicionar envio de evento de busca ao navegar para `/buscar?q=`

## Impact

- **Backend** (`Mercado-SemiLivre.api`): novas tabelas `user_search_history` e `user_product_clicks`, novas rotas `POST /history/search`, `POST /history/product-click`, `GET /history/searches`
- **Frontend**: `SearchBar` passa a consultar e exibir histórico; `ProductCard` e página de busca passam a emitir eventos
- **Auth**: rotas de histórico exigem usuário autenticado (session token); usuários não autenticados não registram histórico
- **Performance**: todas as chamadas de registro são fire-and-forget (não bloqueiam navegação)
