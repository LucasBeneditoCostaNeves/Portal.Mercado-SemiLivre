## Purpose

Especificação do endpoint público de listagem de departamentos do catálogo, expondo categorias de produtos com ícones mapeados para o frontend.

## Requirements

### Requirement: Endpoint público de listagem de departamentos
O sistema SHALL expor `GET /catalog/departments` sem autenticação, retornando todos os departamentos (categorias ativas) no shape `{ items: Department[] }`.

#### Scenario: Listagem de departamentos com sucesso
- **WHEN** cliente envia `GET /catalog/departments`
- **THEN** o sistema retorna `{ items: Department[] }` com status 200, onde cada item tem `id`, `label` e `icon`

#### Scenario: Banco sem categorias
- **WHEN** não há `CategoryProduct` cadastrados
- **THEN** o sistema retorna `{ items: [] }` com status 200

#### Scenario: Rota não requer autenticação
- **WHEN** cliente chama `GET /catalog/departments` sem header `Authorization`
- **THEN** o sistema responde com status 200 (não 401)

---

### Requirement: Shape de Department com ícone mapeado
O sistema SHALL retornar cada departamento no formato `{ id: string, label: string, icon: string }`, onde `label` é o nome da categoria e `icon` é a classe Tabler correspondente.

#### Scenario: Mapeamento de ícone para categoria conhecida
- **WHEN** `CategoryProduct.name` constar no mapa de ícones (ex: "Celulares")
- **THEN** `icon` SHALL ser a classe Tabler correspondente (ex: `"ti-device-mobile"`)

#### Scenario: Fallback para categoria desconhecida
- **WHEN** `CategoryProduct.name` não constar no mapa de ícones
- **THEN** `icon` SHALL ser `"ti-package"`

#### Scenario: label corresponde ao nome da categoria
- **WHEN** o endpoint é chamado
- **THEN** `label` de cada department SHALL ser igual a `CategoryProduct.name`
