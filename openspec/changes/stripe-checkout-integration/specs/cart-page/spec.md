## MODIFIED Requirements

### Requirement: Painel de resumo da compra
A página SHALL exibir um painel fixo lateral (em desktop) ou no rodapé (em mobile) com o resumo financeiro da compra e o CTA de continuar.

#### Scenario: Resumo exibe subtotal e total dos itens selecionados
- **WHEN** há itens selecionados no carrinho
- **THEN** o painel exibe: "Produto" com o preço total dos itens selecionados, "Frete" com valor ou "Grátis", e "Total" como a soma dos anteriores

#### Scenario: CTA "Finalizar Compra" está habilitado com itens selecionados
- **WHEN** ao menos um item está selecionado
- **THEN** o botão "Finalizar Compra" está habilitado e redireciona o usuário para `/checkout`

#### Scenario: CTA "Finalizar Compra" está desabilitado sem seleção
- **WHEN** nenhum item está selecionado
- **THEN** o botão "Finalizar Compra" está desabilitado ou inacessível

#### Scenario: Frete exibido como "Grátis" para elegíveis
- **WHEN** o item selecionado tem `freeShipping: true` (preço ≥ R$ 100)
- **THEN** o campo "Frete" exibe "Grátis" com o valor original riscado
