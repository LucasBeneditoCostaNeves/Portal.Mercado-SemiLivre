## ADDED Requirements

### Requirement: Persistir pedido com snapshot dos itens
O sistema SHALL criar um `Order` com `OrderItems` que armazenam snapshot dos dados do produto no momento da compra.

#### Scenario: Order criado com todos os campos obrigatórios
- **WHEN** o webhook confirma o pagamento
- **THEN** o `Order` é criado com `id`, `userId`, `stripeSessionId`, `status: PAID`, `totalAmount` (em centavos) e `createdAt`

#### Scenario: OrderItems armazenam snapshot dos dados do produto
- **WHEN** os `OrderItems` são criados
- **THEN** cada item contém `productId`, `variantId` (se aplicável), `title`, `imageUrl`, `quantity` e `unitPrice` (em centavos) — sem dependência de FK para o produto

#### Scenario: stripeSessionId é único por Order
- **WHEN** um `Order` é criado
- **THEN** o campo `stripeSessionId` possui constraint de unicidade no banco, impedindo duplicatas em caso de webhook retry

### Requirement: Order vinculado ao usuário autenticado
O sistema SHALL associar todo `Order` ao `userId` do usuário que iniciou o checkout.

#### Scenario: Order associado ao userId correto
- **WHEN** o webhook cria o `Order`
- **THEN** o campo `userId` corresponde ao usuário identificado nos metadados da Checkout Session

#### Scenario: Orders do usuário consultáveis por userId
- **WHEN** uma query busca os pedidos de um usuário
- **THEN** o sistema filtra `Order` por `userId` e retorna os pedidos em ordem decrescente de `createdAt`
