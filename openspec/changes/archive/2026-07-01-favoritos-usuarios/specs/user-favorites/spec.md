## ADDED Requirements

### Requirement: Adicionar produto aos favoritos
O sistema DEVE permitir que usuários autenticados adicionem produtos aos seus favoritos através de um endpoint API.

#### Scenario: Adicionar produto com sucesso
- **WHEN** usuário autenticado faz POST para `/api/favorites` com productId válido
- **THEN** produto é adicionado aos favoritos do usuário e endpoint retorna status 201 com dados do favorito

#### Scenario: Usuário não autenticado
- **WHEN** requisição POST para `/api/favorites` é feita sem autenticação
- **THEN** sistema retorna erro 401 Unauthorized

#### Scenario: Produto já é favorito
- **WHEN** usuário tenta adicionar produto que já está em seus favoritos
- **THEN** sistema retorna erro 409 Conflict indicando que o produto já é favorito

### Requirement: Remover produto dos favoritos
O sistema DEVE permitir que usuários removam produtos de seus favoritos.

#### Scenario: Remover favorito com sucesso
- **WHEN** usuário autenticado faz DELETE para `/api/favorites/:favoriteId`
- **THEN** produto é removido dos favoritos e endpoint retorna status 204 No Content

#### Scenario: Tentar remover favorito inexistente
- **WHEN** usuário faz DELETE para `/api/favorites/:favoriteId` com ID inválido
- **THEN** sistema retorna erro 404 Not Found

#### Scenario: Remover favorito de outro usuário
- **WHEN** usuário tenta remover favorito que pertence a outro usuário
- **THEN** sistema retorna erro 403 Forbidden

### Requirement: Listar favoritos do usuário
O sistema DEVE retornar lista de produtos favoritados pelo usuário autenticado.

#### Scenario: Listar favoritos com sucesso
- **WHEN** usuário autenticado faz GET para `/api/favorites`
- **THEN** sistema retorna lista de produtos favoritados com informações completas (id, name, imageUrl, price, etc)

#### Scenario: Listar favoritos com paginação
- **WHEN** usuário faz GET para `/api/favorites?page=1&limit=20`
- **THEN** sistema retorna favoritos paginados e inclui metadados (total, page, limit)

#### Scenario: Usuário sem favoritos
- **WHEN** usuário autenticado sem favoritos faz GET para `/api/favorites`
- **THEN** sistema retorna array vazio com status 200

### Requirement: Persistência em banco de dados
O sistema DEVE armazenar favoritos de forma durável com relacionamentos corretos.

#### Scenario: Criar registro de favorito
- **WHEN** favorito é adicionado
- **THEN** tabela `user_favorites` armazena registro com userId, productId, createdAt e índices apropriados

#### Scenario: Integridade referencial
- **WHEN** tabela `user_favorites` é criada
- **THEN** possui foreign keys para `users(id)` e `products(id)` e constraint unique (userId, productId)
