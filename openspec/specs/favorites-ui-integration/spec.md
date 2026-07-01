# Spec: Integração de Favoritos na UI

## Purpose

Define os requisitos de integração do sistema de favoritos nos componentes de UI existentes: página de detalhes do produto, cards de produto em listagens, navbar, e sincronização de estado entre componentes.

## Requirements

### Requirement: Botão de favoritar em página de detalhes
O sistema DEVE exibir botão de adicionar/remover dos favoritos na página de detalhes do produto.

#### Scenario: Exibir botão de favoritar
- **WHEN** usuário autenticado acessa `/produto/[id]`
- **THEN** botão de favoritar é renderizado na página (ex: ícone de coração em price-box)

#### Scenario: Botão indica estado de favorito
- **WHEN** produto está nos favoritos do usuário
- **THEN** botão exibe estado "favoritado" com indicação visual (ícone preenchido, cor diferente, etc)

#### Scenario: Botão indica estado não-favorito
- **WHEN** produto NÃO está nos favoritos do usuário
- **THEN** botão exibe estado "não favoritado" (ícone vazio, cor padrão)

#### Scenario: Usuário não autenticado vê opção de login
- **WHEN** usuário não autenticado clica no botão de favoritar
- **THEN** sistema redireciona para página de login ou exibe modal de login

### Requirement: Adicionar aos favoritos da página de detalhes
O sistema DEVE permitir favoritar produto diretamente da página de detalhes.

#### Scenario: Favoritar com sucesso
- **WHEN** usuário clica no botão de favoritar em `/produto/[id]`
- **THEN** produto é adicionado aos favoritos, botão muda de estado visual, feedback visual confirma

#### Scenario: Remover dos favoritos
- **WHEN** usuário clica no botão de favoritar (já favoritado) em `/produto/[id]`
- **THEN** produto é removido dos favoritos, botão volta ao estado inicial, feedback visual confirma

#### Scenario: Sincronização com banco
- **WHEN** usuário clica botão de favoritar
- **THEN** chamada assíncrona é feita para API, estado local atualiza otimistamente, se falhar reverte

### Requirement: Ícone de favorito em cards de produtos
O sistema DEVE exibir indicador de favorito em cards de produtos em listagens.

#### Scenario: Exibir ícone em cards de categoria/busca
- **WHEN** usuário visualiza cards de produtos em páginas como categorias ou resultados de busca
- **THEN** cada card exibe ícone de coração no canto (top-right) indicando se é favorito

#### Scenario: Favoritar direto do card
- **WHEN** usuário clica no ícone de coração em um card de produto
- **THEN** produto é adicionado/removido dos favoritos sem navegar para página de detalhes

#### Scenario: Sincronização entre cards e página de detalhes
- **WHEN** usuário favorita um produto em uma página de busca
- **THEN** se depois navegar para a página de detalhes desse produto, o estado de favorito está correto

### Requirement: Contador de favoritos (opcional)
O sistema PODE exibir número total de favoritos do usuário.

#### Scenario: Badge com contagem de favoritos
- **WHEN** página é carregada
- **THEN** menu/navbar exibe badge com número de favoritos (ex: "Meus Favoritos (5)")

#### Scenario: Atualizar contagem após ação
- **WHEN** usuário adiciona ou remove favorito
- **THEN** contador é atualizado em tempo real em todos os componentes que o exibem

### Requirement: Sincronização de estado entre componentes
O sistema DEVE manter estado de favoritos sincronizado entre diferentes partes da aplicação.

#### Scenario: Atualização reflete em múltiplos lugares
- **WHEN** usuário favorita/desfavorita um produto
- **THEN** estado é atualizado simultaneamente em: card de produto, página de detalhes, página de favoritos, contador

#### Scenario: Usar state management adequado
- **WHEN** aplicação carrega
- **THEN** estado de favoritos é gerenciado via service (`favorites.service.ts`) com métodos: addFavorite, removeFavorite, getFavorites, isFavorite
