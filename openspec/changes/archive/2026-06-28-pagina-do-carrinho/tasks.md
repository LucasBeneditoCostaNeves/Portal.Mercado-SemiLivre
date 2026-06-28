## 1. API — Modelo de Dados

- [x] 1.1 Criar arquivo `prisma/schema/cart.prisma` com modelo `CartItem` (campos: `id`, `userId`, `productVariationId`, `quantity`) e constraint única `@@unique([userId, productVariationId])` com `onDelete: Cascade` em ambas as FKs
- [x] 1.2 Adicionar relação `CartItem[]` ao modelo `User` em `user.prisma` e relação `CartItem[]` ao modelo `ProductVariation` em `product.prisma`
- [x] 1.3 Rodar `npx prisma migrate dev --name add-cart-items` e confirmar que a migration é gerada corretamente
- [x] 1.4 Rodar `npx prisma generate` e verificar que o tipo `CartItem` aparece no client gerado

## 2. API — Módulo Cart (NestJS)

- [x] 2.1 Criar estrutura de pastas `src/modules/cart/` com `cart.module.ts`, `cart.controller.ts`, `cart.service.ts`
- [x] 2.2 Registrar `CartModule` no `AppModule`
- [x] 2.3 Implementar `CartService.findByUser(userId)` que busca todos os `CartItem` do usuário com `include` em `productVariation.product` e `productVariation.product.user` (seller) e mapeia para o shape de resposta (`id`, `quantity`, `productId`, `productTitle`, `productThumbnail`, `variationId`, `variationTitle`, `price`, `discountPercentage`, `sellerName`)
- [x] 2.4 Implementar `CartService.upsertItem(userId, productVariationId, quantity)` usando `prisma.cartItem.upsert` com `update: { quantity: { increment: quantity } }` e `create: { userId, productVariationId, quantity }`; lançar `NotFoundException` se a `ProductVariation` não existir
- [x] 2.5 Implementar `CartService.updateQuantity(userId, cartItemId, quantity)` que busca o `CartItem` por `id` e `userId` (404 se não encontrar) e atualiza `quantity`
- [x] 2.6 Implementar `CartService.removeItem(userId, cartItemId)` que busca o `CartItem` por `id` e `userId` (404 se não encontrar) e deleta
- [x] 2.7 Implementar `CartController` com rotas: `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id`, todas protegidas pelo `JwtAuthGuard` existente
- [x] 2.8 Criar DTOs com validação via `class-validator`: `AddCartItemDto` (`productVariationId: string UUID`, `quantity: number min 1`) e `UpdateCartItemDto` (`quantity: number min 1`)

## 3. Portal — Tipos e Serviço

- [x] 3.1 Criar `src/types/cart.ts` com interfaces `CartItem` e `Cart` (shape da resposta da API)
- [x] 3.2 Criar `src/services/cart.service.ts` com `getCart(token: string): Promise<Cart>` que chama `GET /cart` com `Authorization: Bearer <token>` e `cache: 'no-store'` (dados pessoais, sem cache compartilhado)
- [x] 3.3 Criar função auxiliar `authenticatedFetch<T>(path, token, options?)` em `cart.service.ts` ou em `lib/http-client.ts` para reutilização futura de chamadas autenticadas server-side

## 4. Portal — Server Actions

- [x] 4.1 Criar `src/app/(home)/carrinho/actions.ts` com Server Action `addToCart(productVariationId: string, quantity: number)` que obtém o token via `getSession()`, chama `POST /cart/items` e chama `revalidatePath('/carrinho')`
- [x] 4.2 Implementar Server Action `updateCartItemQuantity(cartItemId: string, quantity: number)` em `actions.ts` com `PATCH /cart/items/:id` e `revalidatePath('/carrinho')`
- [x] 4.3 Implementar Server Action `removeCartItem(cartItemId: string)` em `actions.ts` com `DELETE /cart/items/:id` e `revalidatePath('/carrinho')`
- [x] 4.4 Exportar `addToCart` em `actions.ts` e importar no botão "Adicionar ao carrinho" da página de detalhe do produto (`src/app/(home)/produto/[id]/page.tsx`)

## 5. Portal — Página `/carrinho`

- [x] 5.1 Criar `src/app/(home)/carrinho/page.tsx` como Server Component: verificar sessão com `getSession()`, redirecionar para `/login` se ausente, buscar carrinho com `cart.service.getCart(token)`
- [x] 5.2 Criar `src/app/(home)/carrinho/_components/cart-item-card.tsx` como Client Component com: thumbnail, título do produto, título da variação, preço, controle de quantidade (+ / − com `useOptimistic`), botão de remover, checkbox de seleção
- [x] 5.3 Criar `src/app/(home)/carrinho/_components/seller-group.tsx` como Server Component que agrupa e renderiza `CartItemCard`s sob o cabeçalho do vendedor
- [x] 5.4 Criar `src/app/(home)/carrinho/_components/cart-summary.tsx` como Client Component com painel de resumo: subtotal, frete (Grátis se elegível), total e botão "Continuar" (desabilitado se nenhum item selecionado)
- [x] 5.5 Criar `src/app/(home)/carrinho/_components/cart-selection-context.tsx` com Context/Provider de seleção de itens (estado de quais `cartItemId`s estão selecionados) para comunicação entre `CartItemCard` e `CartSummary`
- [x] 5.6 Criar `src/app/(home)/carrinho/_components/select-all-checkbox.tsx` como Client Component para o checkbox global "Todos os produtos"
- [x] 5.7 Montar o layout final em `page.tsx`: coluna principal com `SelectAllCheckbox` + lista de `SellerGroup`s; coluna lateral com `CartSummary`; estado vazio quando `cart.items` estiver vazio
