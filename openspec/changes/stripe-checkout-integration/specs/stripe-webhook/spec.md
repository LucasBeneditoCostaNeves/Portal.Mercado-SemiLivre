## ADDED Requirements

### Requirement: Receber e validar eventos do Stripe via webhook
O sistema SHALL expor um endpoint `POST /api/webhooks/stripe` que recebe eventos do Stripe, valida a assinatura HMAC-SHA256 e processa os eventos relevantes.

#### Scenario: Evento com assinatura válida é processado
- **WHEN** o Stripe envia um evento com cabeçalho `Stripe-Signature` correto
- **THEN** o sistema valida a assinatura com `stripe.webhooks.constructEvent()` e processa o evento

#### Scenario: Evento com assinatura inválida é rejeitado
- **WHEN** o Stripe envia um evento com `Stripe-Signature` inválido ou ausente
- **THEN** o sistema retorna HTTP 400 sem processar o evento

### Requirement: Persistir pedido ao receber confirmação de pagamento
O sistema SHALL criar um `Order` com status `PAID` e os `OrderItems` correspondentes ao receber o evento `checkout.session.completed`.

#### Scenario: Order criado após checkout.session.completed
- **WHEN** o webhook recebe `checkout.session.completed` com `payment_status: "paid"`
- **THEN** o sistema cria um `Order` com `status: PAID`, `stripeSessionId`, `userId` e `totalAmount`, e cria os `OrderItems` com snapshot dos dados do produto

#### Scenario: Carrinho limpo após criação do pedido
- **WHEN** o `Order` é criado com sucesso
- **THEN** todos os itens do carrinho do usuário que foram incluídos no pedido são removidos

#### Scenario: Evento duplicado é ignorado
- **WHEN** o webhook recebe um evento com `stripeSessionId` já existente no banco
- **THEN** o sistema retorna HTTP 200 sem criar um segundo `Order`

### Requirement: Registrar falha de pagamento
O sistema SHALL atualizar o status do `Order` para `FAILED` ao receber `payment_intent.payment_failed`.

#### Scenario: Order marcado como FAILED
- **WHEN** o webhook recebe `payment_intent.payment_failed`
- **THEN** o sistema localiza o `Order` pelo `stripeSessionId` e atualiza `status` para `FAILED`
