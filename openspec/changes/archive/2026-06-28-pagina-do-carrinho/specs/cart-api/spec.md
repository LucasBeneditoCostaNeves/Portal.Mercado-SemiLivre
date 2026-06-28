## ADDED Requirements

### Requirement: Modelo de dados CartItem
O banco de dados SHALL ter um modelo `CartItem` com campos: `id` (UUID), `userId` (FK → User), `productVariationId` (FK → ProductVariation), `quantity` (Int, mínimo 1). Uma constraint única composta `(userId, productVariationId)` garante que cada combinação aparece no máximo uma vez por usuário.

#### Scenario: Constraint única impede duplicatas
- **WHEN** um item com `(userId, productVariationId)` já existe no banco
- **THEN** a inserção de um segundo registro com os mesmos valores viola a constraint e não cria uma nova linha

#### Scenario: Deleção em cascata ao remover usuário
- **WHEN** um usuário é deletado do banco
- **THEN** todos os `CartItem` associados ao seu `userId` são removidos automaticamente via `onDelete: Cascade`

---

### Requirement: Listar itens do carrinho autenticado
O sistema SHALL expor o endpoint `GET /cart` que retorna os itens do carrinho do usuário autenticado, incluindo dados do produto e da variação necessários para renderização.

#### Scenario: Retorna lista de itens do carrinho
- **WHEN** uma requisição `GET /cart` é feita com token JWT válido
- **THEN** o sistema retorna HTTP 200 com array de objetos contendo: `id` (cartItemId), `quantity`, `productId`, `productTitle`, `productThumbnail`, `variationId`, `variationTitle`, `price`, `discountPercentage`, `sellerName`

#### Scenario: Carrinho vazio retorna array vazio
- **WHEN** uma requisição `GET /cart` é feita por um usuário sem itens no carrinho
- **THEN** o sistema retorna HTTP 200 com `{ items: [] }`

#### Scenario: Sem autenticação retorna 401
- **WHEN** uma requisição `GET /cart` é feita sem header `Authorization`
- **THEN** o sistema retorna HTTP 401

#### Scenario: Token inválido retorna 401
- **WHEN** uma requisição `GET /cart` é feita com token JWT malformado ou expirado
- **THEN** o sistema retorna HTTP 401

---

### Requirement: Adicionar item ao carrinho com upsert
O sistema SHALL expor o endpoint `POST /cart/items` que adiciona um item ao carrinho. Se o mesmo `productVariationId` já existir no carrinho do usuário, a quantidade é incrementada pela quantidade enviada; caso contrário, um novo `CartItem` é criado.

#### Scenario: Novo item é inserido no carrinho
- **WHEN** uma requisição `POST /cart/items` com `{ productVariationId, quantity: 2 }` é feita e a variação não existe no carrinho
- **THEN** o sistema cria um novo `CartItem` com `quantity: 2` e retorna HTTP 201 com o item criado

#### Scenario: Item existente tem quantidade somada (upsert)
- **WHEN** uma requisição `POST /cart/items` com `{ productVariationId, quantity: 3 }` é feita e a variação já está no carrinho com `quantity: 1`
- **THEN** o sistema atualiza o `CartItem` para `quantity: 4` e retorna HTTP 200 com o item atualizado

#### Scenario: `productVariationId` inválido retorna 404
- **WHEN** uma requisição `POST /cart/items` com um `productVariationId` que não existe no banco é feita
- **THEN** o sistema retorna HTTP 404

#### Scenario: `quantity` menor que 1 retorna 400
- **WHEN** uma requisição `POST /cart/items` com `quantity: 0` ou negativo é feita
- **THEN** o sistema retorna HTTP 400

#### Scenario: Sem autenticação retorna 401
- **WHEN** uma requisição `POST /cart/items` é feita sem header `Authorization`
- **THEN** o sistema retorna HTTP 401

---

### Requirement: Atualizar quantidade de item do carrinho
O sistema SHALL expor o endpoint `PATCH /cart/items/:id` que substitui a quantidade de um `CartItem` pelo valor enviado. O `id` refere-se ao `CartItem.id`.

#### Scenario: Quantidade atualizada com sucesso
- **WHEN** uma requisição `PATCH /cart/items/:id` com `{ quantity: 5 }` é feita para um item que pertence ao usuário autenticado
- **THEN** o sistema atualiza `quantity` para `5` e retorna HTTP 200 com o item atualizado

#### Scenario: Item de outro usuário retorna 404
- **WHEN** uma requisição `PATCH /cart/items/:id` é feita para um `CartItem` que pertence a outro usuário
- **THEN** o sistema retorna HTTP 404 (não expõe que o item existe)

#### Scenario: Item inexistente retorna 404
- **WHEN** uma requisição `PATCH /cart/items/:id` com um `id` que não existe no banco é feita
- **THEN** o sistema retorna HTTP 404

#### Scenario: `quantity` menor que 1 retorna 400
- **WHEN** uma requisição `PATCH /cart/items/:id` com `quantity: 0` é feita
- **THEN** o sistema retorna HTTP 400

#### Scenario: Sem autenticação retorna 401
- **WHEN** uma requisição `PATCH /cart/items/:id` é feita sem header `Authorization`
- **THEN** o sistema retorna HTTP 401

---

### Requirement: Remover item do carrinho
O sistema SHALL expor o endpoint `DELETE /cart/items/:id` que remove um `CartItem` pelo seu `id`.

#### Scenario: Item removido com sucesso
- **WHEN** uma requisição `DELETE /cart/items/:id` é feita para um item que pertence ao usuário autenticado
- **THEN** o sistema remove o `CartItem` e retorna HTTP 204

#### Scenario: Item de outro usuário retorna 404
- **WHEN** uma requisição `DELETE /cart/items/:id` é feita para um `CartItem` de outro usuário
- **THEN** o sistema retorna HTTP 404

#### Scenario: Item inexistente retorna 404
- **WHEN** uma requisição `DELETE /cart/items/:id` com `id` inexistente é feita
- **THEN** o sistema retorna HTTP 404

#### Scenario: Sem autenticação retorna 401
- **WHEN** uma requisição `DELETE /cart/items/:id` é feita sem header `Authorization`
- **THEN** o sistema retorna HTTP 401
