## ADDED Requirements

### Requirement: Exibir resumo dos itens selecionados para revisão
A página `/checkout` SHALL exibir os itens selecionados do carrinho com título, quantidade, preço unitário e total, para que o usuário revise antes de pagar.

#### Scenario: Itens selecionados do carrinho são exibidos
- **WHEN** o usuário acessa `/checkout` com itens selecionados no carrinho
- **THEN** a página exibe cada item com thumbnail, título, quantidade e preço unitário

#### Scenario: Total calculado corretamente
- **WHEN** a página carrega
- **THEN** o total exibido é a soma de `(preço unitário × quantidade)` de todos os itens selecionados

#### Scenario: Nenhum item selecionado redireciona para o carrinho
- **WHEN** o usuário acessa `/checkout` sem itens selecionados no carrinho
- **THEN** o sistema redireciona para `/carrinho`

### Requirement: Botão de pagamento inicia checkout no Stripe
A página `/checkout` SHALL exibir um botão "Pagar" que dispara a criação da Checkout Session e redireciona o usuário para o Stripe.

#### Scenario: Botão "Pagar" está habilitado com itens válidos
- **WHEN** há ao menos um item válido para checkout
- **THEN** o botão "Pagar com Stripe" está habilitado e exibe o total

#### Scenario: Botão exibe estado de carregamento durante redirecionamento
- **WHEN** o usuário clica em "Pagar"
- **THEN** o botão exibe um spinner e fica desabilitado enquanto a Server Action processa

### Requirement: Informações de modo teste visíveis
A página `/checkout` SHALL exibir um aviso de que o ambiente é de teste, com um cartão de teste sugerido.

#### Scenario: Banner de modo teste exibido
- **WHEN** o usuário acessa `/checkout`
- **THEN** um banner ou callout exibe "Ambiente de teste — use o cartão 4242 4242 4242 4242"
