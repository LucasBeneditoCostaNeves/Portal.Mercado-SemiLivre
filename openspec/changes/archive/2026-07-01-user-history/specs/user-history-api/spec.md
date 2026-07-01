## ADDED Requirements

### Requirement: POST /history/search — registrar busca
O endpoint SHALL aceitar `POST /history/search` com body `{ term: string }` e header `Authorization: Bearer <token>`. SHALL validar que `term` tem entre 2 e 255 caracteres. SHALL ignorar (retornar 200 sem inserir) se o mesmo usuário buscar o mesmo termo nos últimos 60 segundos. SHALL retornar `201 Created` em caso de inserção ou `200 OK` em caso de deduplicação.

#### Scenario: Busca registrada com sucesso
- **WHEN** POST /history/search com token válido e `term: "notebook"`
- **THEN** retorna 201 e insere registro em `user_search_history`

#### Scenario: Deduplicação dentro de 60 segundos
- **WHEN** POST /history/search com o mesmo termo do mesmo usuário dentro de 60s
- **THEN** retorna 200 sem inserir novo registro

#### Scenario: Token ausente ou inválido
- **WHEN** POST /history/search sem header Authorization ou com token expirado
- **THEN** retorna 401 Unauthorized

#### Scenario: Term com menos de 2 caracteres
- **WHEN** POST /history/search com `term: "a"`
- **THEN** retorna 422 Unprocessable Entity com mensagem de validação

### Requirement: POST /history/product-click — registrar clique em produto
O endpoint SHALL aceitar `POST /history/product-click` com body `{ productId: string, sourcePage: string }`. SHALL validar que `productId` é string não vazia e `sourcePage` é um dos valores: `"home"`, `"search"`, `"category"`, `"product"`. SHALL retornar `201 Created`.

#### Scenario: Clique registrado com sucesso
- **WHEN** POST /history/product-click com token válido, productId e sourcePage válidos
- **THEN** retorna 201 e insere registro em `user_product_clicks`

#### Scenario: sourcePage inválido
- **WHEN** POST /history/product-click com `sourcePage: "unknown"`
- **THEN** retorna 422 Unprocessable Entity

#### Scenario: Token ausente
- **WHEN** POST /history/product-click sem header Authorization
- **THEN** retorna 401 Unauthorized

### Requirement: GET /history/searches — consultar histórico de buscas
O endpoint SHALL aceitar `GET /history/searches` com header `Authorization: Bearer <token>`. SHALL retornar os últimos 10 termos distintos buscados pelo usuário, ordenados pelo `searched_at` mais recente. SHALL retornar array vazio `[]` se não houver histórico.

#### Scenario: Histórico retornado com sucesso
- **WHEN** GET /history/searches com token válido e histórico existente
- **THEN** retorna 200 com array de até 10 objetos `{ term: string, searchedAt: string (ISO 8601) }`

#### Scenario: Termos distintos — retorna apenas o mais recente de cada termo
- **WHEN** o usuário buscou "notebook" três vezes em datas diferentes
- **THEN** o response inclui "notebook" apenas uma vez (a ocorrência mais recente)

#### Scenario: Sem histórico
- **WHEN** GET /history/searches para usuário sem buscas anteriores
- **THEN** retorna 200 com `[]`

#### Scenario: Token ausente
- **WHEN** GET /history/searches sem header Authorization
- **THEN** retorna 401 Unauthorized
