## Purpose

Especifica o comportamento do painel de filtros da página de categoria, incluindo layout responsivo (sidebar/drawer), sincronização com URL via query params e os filtros disponíveis (ordenação, frete grátis, faixa de preço, avaliação mínima, marca).

---

## Requirements

### Requirement: Painel de filtros com layout responsivo
A página de categoria SHALL renderizar um `CategoryFiltersPanel` que aparece como sidebar fixa à esquerda do grid em desktop (≥1024px) e como drawer deslizante de baixo para cima acionado por botão em mobile (<1024px). O estado dos filtros SHALL ser sincronizado com a URL via query params. O painel não exibirá filtro de categoria, pois a categoria já está definida pela rota.

#### Scenario: Sidebar visível em desktop
- **WHEN** a viewport tem 1024px ou mais
- **THEN** o `CategoryFiltersPanel` é exibido como sidebar fixa à esquerda do grid, sem necessidade de clicar em botão

#### Scenario: Drawer em mobile
- **WHEN** a viewport tem menos de 1024px
- **THEN** um botão "Filtros" é exibido acima do grid; ao clicar, um drawer desliza de baixo para cima com os filtros

#### Scenario: Fechar drawer no mobile
- **WHEN** o usuário toca fora do drawer ou clica no botão de fechar
- **THEN** o drawer fecha sem aplicar filtros pendentes

---

### Requirement: Badge de contagem de filtros ativos no mobile
O botão "Filtros" no mobile SHALL exibir um badge numérico com a quantidade de filtros ativos (excluindo `sort`/`order` da contagem).

#### Scenario: Sem filtros ativos
- **WHEN** nenhum filtro está ativo
- **THEN** nenhum badge é exibido no botão "Filtros"

#### Scenario: Com filtros ativos
- **WHEN** o usuário tem frete grátis e avaliação mínima 4 ativos
- **THEN** o badge exibe "2"

---

### Requirement: Seleção de ordenação
O painel SHALL incluir um `SortSelect` com as seguintes opções mutuamente exclusivas: "Relevância" (padrão, sem sort), "Menor preço" (`sort=price&order=asc`), "Maior preço" (`sort=price&order=desc`), "Melhor avaliação" (`sort=rating&order=desc`), "Mais vendidos" (`sort=sales&order=desc`).

#### Scenario: Ordenação padrão (relevância)
- **WHEN** nenhum sort está selecionado
- **THEN** a opção "Relevância" aparece selecionada e a URL não contém `sort` nem `order`

#### Scenario: Selecionar "Menor preço"
- **WHEN** o usuário seleciona "Menor preço"
- **THEN** a URL atualiza com `sort=price&order=asc` e os resultados são reordenados

#### Scenario: Ordenação refletida na URL
- **WHEN** usuário acessa `/c/smartphones?sort=rating&order=desc`
- **THEN** a opção "Melhor avaliação" aparece pré-selecionada no painel

---

### Requirement: Filtro de frete grátis
O painel SHALL incluir um toggle "Frete grátis" que, quando ativo, adiciona `freeShipping=true` à URL e filtra os resultados para exibir apenas produtos com `freeShipping: true`.

#### Scenario: Ativar frete grátis
- **WHEN** o usuário ativa o toggle "Frete grátis"
- **THEN** a URL inclui `freeShipping=true` e apenas produtos com frete grátis são exibidos

#### Scenario: Desativar frete grátis
- **WHEN** o usuário desativa o toggle
- **THEN** `freeShipping` é removido da URL e todos os produtos da categoria são exibidos

---

### Requirement: Filtro de faixa de preço
O painel SHALL incluir dois inputs numéricos "Preço mínimo" e "Preço máximo". Os valores SHALL ser adicionados à URL como `minPrice={n}` e `maxPrice={n}` ao aplicar o filtro.

#### Scenario: Definir faixa de preço
- **WHEN** o usuário define mínimo R$100 e máximo R$500 e aplica
- **THEN** a URL inclui `minPrice=100&maxPrice=500` e os resultados são filtrados

#### Scenario: Apenas mínimo definido
- **WHEN** o usuário define apenas o preço mínimo
- **THEN** a URL inclui apenas `minPrice={n}` sem `maxPrice`

---

### Requirement: Filtro de avaliação mínima
O painel SHALL incluir um seletor de estrelas (1 a 5) para avaliação mínima. A seleção adiciona `minRating={n}` à URL.

#### Scenario: Selecionar avaliação mínima 4
- **WHEN** o usuário clica na 4ª estrela
- **THEN** a URL inclui `minRating=4` e apenas produtos com rating ≥ 4 são exibidos

#### Scenario: Desmarcar avaliação
- **WHEN** o usuário clica na estrela já selecionada
- **THEN** `minRating` é removido da URL

---

### Requirement: Filtro de marca por checkbox
O painel SHALL exibir uma lista de marcas com checkboxes, derivadas dos resultados atuais da categoria. A seleção de uma ou mais marcas adiciona `brand={marca}` (múltiplos valores separados por vírgula) à URL.

#### Scenario: Selecionar uma marca
- **WHEN** o usuário seleciona a marca "Samsung"
- **THEN** a URL inclui `brand=Samsung` e apenas produtos dessa marca na categoria são exibidos

#### Scenario: Selecionar múltiplas marcas
- **WHEN** o usuário seleciona "Samsung" e "Apple"
- **THEN** a URL inclui `brand=Samsung,Apple` e produtos de ambas as marcas são exibidos

---

### Requirement: Botões Aplicar e Limpar filtros
O painel SHALL ter um botão "Aplicar filtros" que persiste as seleções atuais na URL e um botão "Limpar filtros" que remove todos os query params, retornando a URL para `/c/{categoryId}` limpa.

#### Scenario: Aplicar filtros
- **WHEN** o usuário configura filtros e clica em "Aplicar filtros"
- **THEN** a URL é atualizada com os novos params e os resultados são recarregados

#### Scenario: Limpar filtros
- **WHEN** o usuário clica em "Limpar filtros"
- **THEN** todos os query params são removidos e a URL volta para `/c/{categoryId}` sem params

#### Scenario: Filtros persistem na URL
- **WHEN** o usuário compartilha a URL `/c/smartphones?freeShipping=true&sort=price&order=asc`
- **THEN** ao acessar a URL, os filtros aparecem pré-selecionados no painel
