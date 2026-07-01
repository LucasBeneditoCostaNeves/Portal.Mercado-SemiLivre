## MODIFIED Requirements

### Requirement: Navegação para o próximo step ao confirmar compra
O painel de resumo do carrinho (`CartSummary`) SHALL navegar o usuário para `/checkout/endereco` ao clicar em "Continuar", passando os IDs dos itens selecionados como `searchParams`.

#### Scenario: Botão Continuar com itens selecionados
- **WHEN** o usuário possui ao menos um item selecionado no carrinho e clica em "Continuar"
- **THEN** o sistema navega para `/checkout/endereco?itens=<id1>,<id2>,...` com os IDs dos itens selecionados

#### Scenario: Botão Continuar sem itens selecionados
- **WHEN** nenhum item está selecionado no carrinho
- **THEN** o botão "Continuar" permanece desabilitado e nenhuma navegação ocorre
