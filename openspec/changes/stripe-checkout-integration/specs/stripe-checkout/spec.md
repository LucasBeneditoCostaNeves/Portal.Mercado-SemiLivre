## ADDED Requirements

### Requirement: Criar Stripe Checkout Session com itens selecionados
O sistema SHALL criar uma Stripe Checkout Session via Server Action com os itens selecionados do carrinho, redirecionando o usuário para a página de pagamento hospedada pelo Stripe.

#### Scenario: Session criada com sucesso e usuário redirecionado
- **WHEN** o usuário clica em "Pagar" na página de checkout com ao menos um item selecionado
- **THEN** o sistema cria uma Checkout Session no Stripe com os `line_items` correspondentes e redireciona o navegador para `session.url`

#### Scenario: Erro ao criar session exibe mensagem
- **WHEN** a chamada à API do Stripe falha
- **THEN** o sistema exibe uma mensagem de erro na página de checkout sem redirecionar o usuário

#### Scenario: Checkout Session inclui metadados do pedido
- **WHEN** a Checkout Session é criada
- **THEN** os metadados incluem `userId` e `cartItemIds` para que o webhook possa identificar o pedido

#### Scenario: URLs de retorno configuradas
- **WHEN** a Checkout Session é criada
- **THEN** `success_url` aponta para `/pedido/sucesso?session_id={CHECKOUT_SESSION_ID}` e `cancel_url` aponta para `/checkout`

#### Scenario: Usuário não autenticado é redirecionado para login
- **WHEN** um usuário não autenticado tenta iniciar o checkout
- **THEN** o sistema redireciona para `/login` com `redirect_to=/checkout`
