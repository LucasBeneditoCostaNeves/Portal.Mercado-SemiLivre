## Context

O portal possui um carrinho funcional (`/carrinho`) com seleção de itens, controle de quantidade e painel de resumo, mas o botão "Continuar" não leva a lugar nenhum. A integração com Stripe preenche essa lacuna usando o **Stripe Hosted Checkout** — o usuário é redirecionado para uma página de pagamento gerenciada pelo Stripe e retorna ao portal após confirmar ou cancelar.

O projeto é de portfólio, rodando em modo teste. Nenhum pagamento real será processado.

## Goals / Non-Goals

**Goals:**
- Criar uma Stripe Checkout Session com os itens selecionados do carrinho
- Redirecionar o usuário para a página de pagamento do Stripe
- Receber confirmação via webhook e persistir um `Order` no banco
- Exibir página de sucesso e página de cancelamento

**Non-Goals:**
- Stripe Elements embutido (desnecessário para portfólio — adiciona complexidade sem ganho de demonstração)
- Cálculo de frete real (usar R$ 0,00 ou valor fixo mock)
- Reembolsos, disputas ou gestão pós-venda
- Notificações por e-mail ao usuário

## Decisions

### D1: Stripe Hosted Checkout vs. Stripe Elements

**Escolha:** Stripe Hosted Checkout (redirect).

**Rationale:** Hosted Checkout não requer coleta de dados de cartão no front-end, elimina a necessidade de lidar com PCI compliance no código e é igualmente valorizado em portfólio. Stripe Elements exigiria mais código de UI sem agregar diferencial.

**Alternativa descartada:** Stripe Elements embutido — mais complexo, não agrega para o objetivo de portfólio.

---

### D2: Webhook via API Route, não Server Action

**Escolha:** `POST /api/webhooks/stripe` como Route Handler do Next.js (`app/api/webhooks/stripe/route.ts`).

**Rationale:** O Stripe assina os eventos com HMAC-SHA256. A validação exige acesso ao **raw body** da requisição (`Buffer`), que Server Actions não expõem. Route Handlers permitem ler `req.body` como `ArrayBuffer` e passá-lo para `stripe.webhooks.constructEvent()`.

**Implementação:** Usar `export const config = { api: { bodyParser: false } }` não se aplica ao App Router — em vez disso, ler o body com `request.arrayBuffer()` e converter para `Buffer`.

---

### D3: Persistência de Order após webhook, não após redirect

**Escolha:** Criar o `Order` somente quando o webhook `checkout.session.completed` for recebido.

**Rationale:** O redirect de sucesso (`/pedido/sucesso?session_id=...`) pode ser acessado pelo usuário antes do webhook chegar, ou pode ser manipulado. O webhook é a fonte de verdade do Stripe — só ele garante que o pagamento foi confirmado.

**Consequência:** A página de sucesso deve fazer polling ou exibir um estado intermediário caso o pedido ainda não exista no banco ao carregar.

---

### D4: Modelo de dados Order

```
Order {
  id          String   @id @default(cuid())
  userId      String
  stripeSessionId String @unique
  status      OrderStatus  // PENDING | PAID | FAILED | CANCELLED
  totalAmount Int      // em centavos
  createdAt   DateTime
  updatedAt   DateTime

  items       OrderItem[]
  user        User @relation(...)
}

OrderItem {
  id          String @id @default(cuid())
  orderId     String
  productId   String
  variantId   String?
  title       String
  imageUrl    String
  quantity    Int
  unitPrice   Int   // em centavos
}
```

**Rationale:** Armazenar snapshot dos dados do produto no `OrderItem` (título, preço, imagem) em vez de FK — produtos podem mudar de preço ou ser removidos após a compra.

---

### D5: Checkout Page como página de revisão simples

**Escolha:** A página `/checkout` exibe os itens selecionados, endereço (mock ou campo livre) e o total, com um botão que dispara a Server Action para criar a Checkout Session.

**Rationale:** Manter simples. Endereço pode ser um campo de texto livre ou dados fixos do usuário — não precisa de integração com serviço de CEP nesta fase.

## Risks / Trade-offs

- **Webhook em desenvolvimento local** → Usar `stripe listen --forward-to localhost:3000/api/webhooks/stripe` via Stripe CLI. Documentar no README.
- **Página de sucesso sem Order** → O webhook pode demorar alguns segundos. Mitigação: polling leve na página de sucesso com `setTimeout` ou exibir mensagem "Processando seu pedido…" com auto-refresh.
- **Carrinho não limpo automaticamente** → Após webhook `PAID`, limpar o carrinho do usuário via Server Action chamada dentro do webhook handler ou em rota separada.
- **Chaves de teste expostas no repositório** → Usar `.env.local` (já no `.gitignore`). Chaves públicas (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) são seguras no front-end por design do Stripe.
