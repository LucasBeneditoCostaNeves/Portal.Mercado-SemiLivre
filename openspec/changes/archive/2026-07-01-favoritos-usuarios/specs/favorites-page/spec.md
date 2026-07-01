## ADDED Requirements

### Requirement: Página de favoritos acessível
O sistema DEVE fornecer uma página dedicada em `/favoritos` onde usuários visualizam seus produtos favoritados.

#### Scenario: Acessar página de favoritos
- **WHEN** usuário autenticado navega para `/favoritos`
- **THEN** página carrega com lista de produtos favoritados em formato de grid/cards

#### Scenario: Redirecionar usuário não autenticado
- **WHEN** usuário não autenticado tenta acessar `/favoritos`
- **THEN** sistema redireciona para página de login

#### Scenario: Estado vazio de favoritos
- **WHEN** usuário autenticado sem favoritos acessa `/favoritos`
- **THEN** página exibe mensagem indicando que nenhum produto foi favoritado com botão para explorar catálogo

### Requirement: Exibição de produtos favoritados
O sistema DEVE apresentar produtos favoritados com informações essenciais e ações disponíveis.

#### Scenario: Renderizar card de produto favoritado
- **WHEN** página de favoritos é carregada
- **THEN** cada produto exibe: imagem (thumbnail), nome, preço, rating/reviews, botão de remover dos favoritos, link para detalhes

#### Scenario: Imagem responsiva
- **WHEN** página é visualizada em diferentes tamanhos de tela
- **THEN** grid de produtos adapta-se (ex: 4 colunas desktop, 2 tablet, 1 mobile)

### Requirement: Remover favorito da página
O sistema DEVE permitir remover produtos dos favoritos diretamente da página de favoritos.

#### Scenario: Remover favorito com sucesso
- **WHEN** usuário clica botão de remover em um card de favorito
- **THEN** produto é removido da lista, feedback visual confirma a ação (toast/notification)

#### Scenario: Atualizar lista após remover
- **WHEN** produto é removido dos favoritos
- **THEN** página atualiza lista sem recarregar página (otimista ou via fetch)

### Requirement: Ordenação e filtros básicos
O sistema PODE oferecer opções de ordenação dos favoritos.

#### Scenario: Ordenar por data adicionada
- **WHEN** usuário clica em opção "Mais recentes"
- **THEN** produtos são reordenados por data de adição (decrescente)

#### Scenario: Ordenar por preço
- **WHEN** usuário clica em opção "Menor preço" ou "Maior preço"
- **THEN** produtos são reordenados por valor

### Requirement: Navegação para detalhes do produto
O sistema DEVE permitir acessar página de detalhes do produto a partir da página de favoritos.

#### Scenario: Clicar em card do favorito
- **WHEN** usuário clica em card ou imagem de um produto
- **THEN** sistema navega para `/produto/[id]` desse produto
