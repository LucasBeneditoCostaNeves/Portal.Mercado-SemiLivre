## 1. Setup e Dependências

- [ ] 1.1 Instalar pacote `stripe` (`npm install stripe`)
- [ ] 1.2 Adicionar variáveis de ambiente ao `.env.local`: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] 1.3 Criar `src/lib/stripe.ts` com instância singleton do Stripe SDK

## 2. Modelo de Dados

- [ ] 2.1 Criar migration Prisma com models `Order` e `OrderItem` conforme design.md
- [ ] 2.2 Adicionar enum `OrderStatus` (PENDING, PAID, FAILED, CANCELLED) ao schema Prisma
- [ ] 2.3 Executar `prisma migrate dev` e `prisma generate`

## 3. Carrinho — Botão "Finalizar Compra"

- [ ] 3.1 Substituir o texto do CTA no painel de resumo de "Continuar" para "Finalizar Compra"
- [ ] 3.2 Alterar o comportamento do CTA para navegar para `/checkout` ao invés de nenhuma ação

## 4. Página de Checkout (`/checkout`)

- [ ] 4.1 Criar route `app/(shop)/checkout/page.tsx` como Server Component
- [ ] 4.2 Implementar redirecionamento para `/carrinho` se nenhum item estiver selecionado
- [ ] 4.3 Implementar redirecionamento para `/login` se usuário não autenticado
- [ ] 4.4 Exibir lista de itens selecionados com thumbnail, título, quantidade e preço
- [ ] 4.5 Exibir total calculado corretamente
- [ ] 4.6 Adicionar banner de modo teste com cartão `4242 4242 4242 4242`
- [ ] 4.7 Criar componente `CheckoutSubmitButton` (Client Component) com estado de loading

## 5. Server Action — Criar Checkout Session

- [ ] 5.1 Criar `src/features/checkout/actions/create-checkout-session.ts`
- [ ] 5.2 Implementar criação de `line_items` a partir dos itens selecionados do carrinho
- [ ] 5.3 Configurar `success_url` e `cancel_url`
- [ ] 5.4 Adicionar `metadata` com `userId` e `cartItemIds` à session
- [ ] 5.5 Retornar erro tratado se a chamada ao Stripe falhar

## 6. Webhook Handler

- [ ] 6.1 Criar `app/api/webhooks/stripe/route.ts` como Route Handler
- [ ] 6.2 Implementar leitura do raw body com `request.arrayBuffer()`
- [ ] 6.3 Validar assinatura com `stripe.webhooks.constructEvent()` usando `STRIPE_WEBHOOK_SECRET`
- [ ] 6.4 Processar evento `checkout.session.completed`: criar `Order` + `OrderItems` + limpar carrinho
- [ ] 6.5 Processar evento `payment_intent.payment_failed`: atualizar `Order.status` para FAILED
- [ ] 6.6 Implementar idempotência: verificar se `stripeSessionId` já existe antes de criar `Order`
- [ ] 6.7 Retornar HTTP 400 para assinatura inválida e HTTP 200 para eventos processados/ignorados

## 7. Página de Confirmação (`/pedido/sucesso`)

- [ ] 7.1 Criar route `app/(shop)/pedido/sucesso/page.tsx`
- [ ] 7.2 Implementar leitura do `session_id` da query string
- [ ] 7.3 Buscar `Order` pelo `stripeSessionId` com seus `OrderItems`
- [ ] 7.4 Exibir resumo do pedido (número, itens, total) quando `Order` existir
- [ ] 7.5 Implementar polling com retry (3 tentativas, 3s de intervalo) para pedidos ainda não processados
- [ ] 7.6 Exibir mensagem de erro após esgotadas as tentativas de polling
- [ ] 7.7 Adicionar link "Continuar comprando" para `/`
