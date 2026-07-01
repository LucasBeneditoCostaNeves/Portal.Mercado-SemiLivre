## Purpose

Especificação do comportamento de registro de cliques em produtos pelo usuário autenticado, capturando o produto acessado e a página de origem para fins de histórico e recomendação.

## Requirements

### Requirement: Registrar clique em produto
O sistema SHALL registrar quando um usuário autenticado clica em um `ProductCard` para navegar ao detalhe do produto. O registro SHALL incluir o `product_id` e a página de origem (`source_page`). O registro SHALL ser fire-and-forget e não bloquear a navegação.

#### Scenario: Clique registrado na página de busca
- **WHEN** um usuário autenticado clica em um ProductCard na página `/buscar`
- **THEN** um evento é enviado ao backend com `product_id` do produto e `source_page: "search"` (sem bloquear a navegação)

#### Scenario: Clique registrado na home
- **WHEN** um usuário autenticado clica em um ProductCard na página `/`
- **THEN** um evento é enviado com `source_page: "home"`

#### Scenario: Clique registrado na página de categoria
- **WHEN** um usuário autenticado clica em um ProductCard na página de categoria
- **THEN** um evento é enviado com `source_page: "category"`

#### Scenario: Usuário não autenticado não gera registro
- **WHEN** um usuário sem sessão clica em qualquer produto
- **THEN** nenhum registro é criado no histórico

#### Scenario: Falha na API não afeta navegação
- **WHEN** o endpoint de registro retorna erro (4xx/5xx)
- **THEN** o usuário ainda navega normalmente para a página do produto
