## MODIFIED Requirements

### Requirement: Seção de Departamentos com grid responsivo
A página SHALL renderizar uma seção "Departamentos" com header (título + link "Ver todos") e um grid de 6 cards de categoria em desktop, cada um com ícone Tabler circular (#FFE600) e label. Cada card de departamento SHALL ser um `<Link>` navegando para `/c/{department.id}`, tornando os departamentos clicáveis e indexáveis.

#### Scenario: Grid em desktop
- **WHEN** a viewport tem 1024px ou mais
- **THEN** as 6 categorias são exibidas em grid de 6 colunas

#### Scenario: Grid em mobile
- **WHEN** a viewport tem menos de 640px
- **THEN** as 6 categorias são exibidas em grid de 2 colunas (3 linhas)

#### Scenario: Card de departamento navega para página de categoria
- **WHEN** o usuário clica em um card de departamento (ex: "Laptops")
- **THEN** o sistema navega para `/c/{department.id}` daquele departamento

#### Scenario: Card é um link semântico
- **WHEN** o HTML da página é inspecionado
- **THEN** cada card de departamento é um elemento `<a>` (via Next.js `<Link>`), não um `<button>`
