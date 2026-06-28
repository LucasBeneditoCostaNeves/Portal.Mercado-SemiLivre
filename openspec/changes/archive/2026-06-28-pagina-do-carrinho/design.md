## Context

O projeto tem dois repositórios: a API (`Mercado-SemiLivre.api`) em NestJS + Prisma + PostgreSQL, e o portal (`Portal.Mercado-SemiLivre`) em Next.js. A autenticação usa JWT armazenado em cookie `session` (httpOnly) via `src/lib/session.ts`. Atualmente não existe nenhum conceito de carrinho em nenhum dos dois projetos.

Modelos Prisma relevantes:
- `User` — dono do carrinho
- `ProductVariation` — unidade comprável (preço, estoque, título, desconto)
- `Product` — agrupa variações; tem `thumbnail` (imageUrl no portal) e `title`

O portal segue o padrão: Server Components por padrão → lógica em `services/` → mutações via Server Actions.

## Goals / Non-Goals

**Goals:**
- Novo modelo `CartItem` no banco com constraint de unicidade `(userId, variationId)`.
- Upsert atômico: adicionar o mesmo item soma quantidade em vez de duplicar.
- Quatro endpoints autenticados na API: GET, POST (upsert), PATCH (quantidade), DELETE.
- Página `/carrinho` no portal com lista de itens e painel de resumo.
- Controles de quantidade (+ / −) e remoção interativos com atualização otimista.
- Redirecionamento para `/login` ao acessar `/carrinho` sem sessão.

**Non-Goals:**
- Checkout / pagamento (próxima feature).
- Carrinho para usuários não autenticados (localStorage/guest cart).
- Sincronização em tempo real (WebSocket).
- Cupons e cálculo de frete real (exibição de placeholder por ora).

## Decisions

### 1. Armazenamento server-side (PostgreSQL), não localStorage

Alternativa considerada: localStorage no browser.

Escolha: PostgreSQL via `CartItem` no banco. O localStorage não persiste entre dispositivos e não se integra com Server Components. Com o padrão atual do projeto (Server Actions, sessão httpOnly), o modelo server-side é mais coerente e sem overhead extra de sincronização.

### 2. Constraint única `(userId, productVariationId)` + upsert com Prisma

O upsert será implementado com `prisma.cartItem.upsert` usando o campo `@@unique([userId, productVariationId])` como chave. O `update` soma a quantidade recebida na existente (`quantity: { increment: qty }`). Isso garante atomicidade sem transações manuais e sem race condition em requests simultâneos.

### 3. Módulo `cart` isolado na API (NestJS)

Seguindo o padrão dos módulos existentes (`catalog`, `auth`, `product`). O módulo expõe um `CartController`, `CartService` e usa o `PrismaService` global. O `JwtAuthGuard` existente protege todos os endpoints.

### 4. `apiClient` estendido com token Bearer no portal

O `apiClient` atual (`src/lib/http-client.ts`) não passa o cookie de sessão. Para chamadas autenticadas do servidor Next.js para a API, a função precisa receber o token opcionalmente. O `cart.service.ts` chamará `getSession()` e passará o token no header `Authorization: Bearer <token>`.

Alternativa considerada: Route Handler Next.js que faz proxy. Rejeitada — adiciona latência e viola o princípio de não criar API Routes para dados que só o próprio app consome.

### 5. Server Actions para mutações de carrinho

Adicionar item, atualizar quantidade e remover item serão Server Actions em `src/app/(home)/carrinho/actions.ts`. Isso mantém o modelo atual do projeto e evita expor endpoints desnecessários. A revalidação usa `revalidatePath('/carrinho')` após cada mutação.

### 6. Componente Client para controles interativos

O layout da página `/carrinho` é um Server Component. Os controles de quantidade e checkbox (estado local) e o painel de resumo (recalcula ao selecionar itens) são Client Components. Atualização otimista via `useOptimistic` do React para os controles de + / −.

## Risks / Trade-offs

- **Race condition no incremento de quantidade**: `quantity: { increment: N }` no Prisma é traduzido para `UPDATE SET quantity = quantity + N`, que é atômico no PostgreSQL. Sem risco de lost update.
- **Itens com variação inativa no carrinho**: Se uma variação for desativada após ser adicionada, o item ainda aparece no carrinho. Mitigação: a camada de resposta do `GET /cart` filtra ou marca itens com `status: false` para exibição degradada na UI.
- **Stale data no painel de resumo**: O preço exibido é buscado no momento do `GET /cart`. Variações de preço entre sessões não são capturadas. Aceitável para MVP; o checkout fará validação final.
- **Sem limite de quantidade máxima**: Por ora não há validação de estoque disponível (`ProductVariation.quantity`). A spec da `cart-api` pode deixar isso como comportamento a ser definido.

## Migration Plan

1. Adicionar modelo `CartItem` no `product.prisma` ou em novo arquivo `cart.prisma`.
2. Rodar `npx prisma migrate dev --name add-cart-items`.
3. Regenerar o client Prisma (`npx prisma generate`).
4. Implementar o módulo `cart` na API e subir.
5. Implementar `cart.service.ts` e Server Actions no portal.
6. Implementar a página `/carrinho`.

Rollback: a migration é reversível com `npx prisma migrate resolve --rolled-back`. Nenhum dado existente é afetado pois `CartItem` é uma tabela nova.
