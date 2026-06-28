## Why

O usuário não possui nenhum fluxo de compra após visualizar um produto — sem carrinho, é impossível agregar itens e finalizar um pedido. Implementar o carrinho é o próximo passo crítico do funil de compras.

## What Changes

- Novo endpoint na API para gerenciar itens do carrinho (listar, adicionar/upsert, atualizar quantidade, remover).
- Nova tabela `cart_items` no banco de dados ligando usuário ↔ produto ↔ variante com quantidade.
- Lógica de upsert: adicionar o mesmo produto+variante soma na quantidade existente em vez de criar um registro duplicado.
- Nova página `/carrinho` no portal com:
  - Lista de itens agrupados por vendedor/origem.
  - Checkbox por item e seleção global.
  - Controle de quantidade (+ / −) com atualização otimista.
  - Botão de remover item.
  - Painel lateral com resumo da compra (subtotal, frete, total) e CTA "Continuar".

## Capabilities

### New Capabilities

- `cart-api`: Endpoints REST da API (`GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id`) com lógica de upsert e cálculo de totais.
- `cart-page`: Página `/carrinho` do portal — lista de itens, controles de quantidade, seleção e painel de resumo de compra.

### Modified Capabilities

<!-- Nenhuma spec existente tem seus requisitos alterados por esta mudança. -->

## Impact

- **API** (`Mercado-SemiLivre.api`): nova tabela `cart_items`, nova rota `/cart` com autenticação obrigatória.
- **Portal** (`Portal.Mercado-SemiLivre`): nova página `src/app/(home)/carrinho/page.tsx` e serviço `src/services/cart.service.ts`.
- **Autenticação**: todas as operações de carrinho exigem sessão autenticada; usuários não logados devem ser redirecionados para `/login`.
- **Sem breaking changes** em specs ou rotas existentes.
