## ADDED Requirements

### Requirement: Exibir confirmação do pedido após retorno do Stripe
A página `/pedido/sucesso` SHALL exibir o resumo do pedido confirmado, incluindo itens, total e número do pedido.

#### Scenario: Pedido confirmado exibido com sucesso
- **WHEN** o usuário retorna do Stripe com `session_id` válido e o `Order` já existe no banco
- **THEN** a página exibe: número do pedido (ID), lista de itens com título e quantidade, e total pago

#### Scenario: Pedido ainda não processado exibe estado de carregamento
- **WHEN** o usuário retorna do Stripe mas o webhook ainda não criou o `Order`
- **THEN** a página exibe "Processando seu pedido…" e recarrega automaticamente após 3 segundos (até 3 tentativas)

#### Scenario: Session ID inválido exibe erro
- **WHEN** o `session_id` na query string não corresponde a nenhum `Order` após 3 tentativas de polling
- **THEN** a página exibe uma mensagem de erro com link para contato/suporte

### Requirement: Link para continuar comprando
A página `/pedido/sucesso` SHALL exibir um link para a home ou catálogo após a confirmação.

#### Scenario: CTA "Continuar comprando" disponível
- **WHEN** o pedido é exibido com sucesso
- **THEN** um botão ou link "Continuar comprando" redireciona para `/`
