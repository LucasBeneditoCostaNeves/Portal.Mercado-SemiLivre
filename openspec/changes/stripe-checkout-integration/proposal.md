## Why

O portal não possui fluxo de pagamento, tornando o checkout incompleto para um projeto de portfólio. A integração com Stripe em modo teste adiciona essa capacidade de forma profissional e reconhecível por recrutadores, sem exigir processamento de pagamentos reais.

## What Changes

- Novo fluxo de checkout: usuário revisa carrinho → confirma endereço → é redirecionado para Stripe Hosted Checkout → retorna ao portal com status do pedido
- Server Action que cria uma Stripe Checkout Session com os itens do carrinho
- Webhook handler que recebe eventos do Stripe e persiste o status do pedido
- Página de sucesso e página de cancelamento pós-pagamento
- Armazenamento de pedidos (`Order`) vinculados ao usuário autenticado

## Capabilities

### New Capabilities

- `stripe-checkout`: Criação de Stripe Checkout Session via Server Action e redirecionamento para página hospedada pelo Stripe
- `stripe-webhook`: Recebimento e processamento de eventos Stripe (`checkout.session.completed`, `payment_intent.payment_failed`) para atualizar status do pedido
- `checkout-page`: Página de revisão do pedido antes do pagamento (endereço, itens, total)
- `order-confirmation-page`: Página de sucesso exibida após retorno do Stripe com resumo do pedido
- `order-model`: Modelo de dados `Order` e `OrderItem` persistido no banco após confirmação do pagamento

### Modified Capabilities

- `cart-page`: Adicionar botão "Finalizar Compra" que inicia o fluxo de checkout

## Impact

- **Dependências**: `stripe` (SDK oficial), variáveis de ambiente `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **API Routes**: `POST /api/webhooks/stripe` (não pode ser Server Action — precisa de raw body para validação de assinatura)
- **Banco de dados**: novas tabelas `orders` e `order_items`
- **Autenticação**: checkout exige usuário autenticado; redirecionar para login se não autenticado
- **Modo teste**: usar apenas chaves de teste do Stripe; cartões de teste documentados na página de checkout
