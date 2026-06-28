## Purpose

Especifica a página `/carrinho` do portal, incluindo controle de acesso, exibição de itens agrupados por vendedor, seleção de itens, controle de quantidade, remoção e painel de resumo da compra.

---

## Requirements

### Requirement: Acesso autenticado à página do carrinho
A página `/carrinho` SHALL redirecionar usuários não autenticados para `/login` antes de renderizar qualquer conteúdo.

#### Scenario: Usuário sem sessão é redirecionado
- **WHEN** um usuário não autenticado acessa `/carrinho`
- **THEN** o sistema redireciona para `/login` com `redirect_to=/carrinho` (ou equivalente)

#### Scenario: Usuário autenticado acessa normalmente
- **WHEN** um usuário com cookie de sessão válido acessa `/carrinho`
- **THEN** a página é renderizada com os itens do carrinho desse usuário

---

### Requirement: Exibição de lista de itens do carrinho
A página `/carrinho` SHALL exibir os itens do carrinho do usuário agrupados por seller (vendedor), com as informações de cada item visíveis.

#### Scenario: Itens exibidos com informações completas
- **WHEN** o carrinho contém itens
- **THEN** cada item exibe: thumbnail do produto, título do produto, título da variação selecionada, preço unitário (com desconto aplicado se houver), e botão de remover

#### Scenario: Carrinho vazio exibe estado vazio
- **WHEN** o carrinho não contém nenhum item
- **THEN** a página exibe uma mensagem indicando que o carrinho está vazio e um CTA para continuar comprando

#### Scenario: Itens agrupados por seller
- **WHEN** o carrinho contém itens de vendedores diferentes
- **THEN** os itens são visualmente agrupados por `sellerName`, com o nome do vendedor exibido como cabeçalho do grupo

---

### Requirement: Seleção de itens para compra
A página SHALL permitir que o usuário selecione quais itens deseja incluir na compra via checkboxes, com opção de selecionar todos.

#### Scenario: Checkbox individual por item
- **WHEN** o usuário marca ou desmarca o checkbox de um item individual
- **THEN** o estado de seleção daquele item é atualizado e o painel de resumo recalcula os totais

#### Scenario: Checkbox global seleciona todos
- **WHEN** o usuário marca o checkbox global ("Todos os produtos")
- **THEN** todos os itens do carrinho são marcados como selecionados

#### Scenario: Desmarcar checkbox global desmarca todos
- **WHEN** o usuário desmarca o checkbox global
- **THEN** todos os itens do carrinho são desmarcados

#### Scenario: Painel de resumo reflete apenas itens selecionados
- **WHEN** o usuário seleciona um subconjunto dos itens do carrinho
- **THEN** o "Subtotal" e o "Total" no painel de resumo consideram apenas os itens selecionados

---

### Requirement: Controle de quantidade por item
A página SHALL permitir que o usuário aumente ou diminua a quantidade de cada item com botões `+` e `−`, com atualização otimista.

#### Scenario: Aumentar quantidade com botão `+`
- **WHEN** o usuário clica no botão `+` de um item
- **THEN** a quantidade exibida incrementa em 1 imediatamente (otimista) e uma Server Action persiste a nova quantidade via `PATCH /cart/items/:id`

#### Scenario: Diminuir quantidade com botão `−` acima de 1
- **WHEN** o usuário clica no botão `−` de um item com quantidade maior que 1
- **THEN** a quantidade exibida decrementa em 1 imediatamente (otimista) e uma Server Action persiste a nova quantidade

#### Scenario: Botão `−` desabilitado com quantidade 1
- **WHEN** um item tem `quantity: 1`
- **THEN** o botão `−` está desabilitado (não é possível ir abaixo de 1 via controle de quantidade; usar "remover" para excluir)

---

### Requirement: Remoção de item do carrinho
A página SHALL permitir remover um item individualmente do carrinho.

#### Scenario: Item removido ao clicar em excluir
- **WHEN** o usuário clica no botão de remover de um item
- **THEN** uma Server Action chama `DELETE /cart/items/:id`, a página é revalidada e o item desaparece da lista

#### Scenario: Lista atualizada após remoção
- **WHEN** o item removido era o único item de um grupo de vendedor
- **THEN** o grupo inteiro (cabeçalho do vendedor + item) desaparece da lista

---

### Requirement: Painel de resumo da compra
A página SHALL exibir um painel fixo lateral (em desktop) ou no rodapé (em mobile) com o resumo financeiro da compra e o CTA de continuar.

#### Scenario: Resumo exibe subtotal e total dos itens selecionados
- **WHEN** há itens selecionados no carrinho
- **THEN** o painel exibe: "Produto" com o preço total dos itens selecionados, "Frete" com valor ou "Grátis", e "Total" como a soma dos anteriores

#### Scenario: CTA "Continuar" está habilitado com itens selecionados
- **WHEN** ao menos um item está selecionado
- **THEN** o botão "Continuar" está habilitado

#### Scenario: CTA "Continuar" está desabilitado sem seleção
- **WHEN** nenhum item está selecionado
- **THEN** o botão "Continuar" está desabilitado ou inacessível

#### Scenario: Frete exibido como "Grátis" para elegíveis
- **WHEN** o item selecionado tem `freeShipping: true` (preço ≥ R$ 100)
- **THEN** o campo "Frete" exibe "Grátis" com o valor original riscado
