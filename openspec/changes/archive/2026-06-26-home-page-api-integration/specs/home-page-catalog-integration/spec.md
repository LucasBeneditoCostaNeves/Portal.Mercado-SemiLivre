## ADDED Requirements

### Requirement: Home page consome dados reais da API via catalog.service.ts
A home page (`/`) SHALL buscar produtos e departamentos via `catalog.service.ts`, substituindo completamente os mocks locais. Os componentes UI existentes não devem ser alterados.

#### Scenario: Seção "Mais vendidos" com dados reais
- **WHEN** usuário acessa `http://localhost:3000/`
- **THEN** a seção "Mais vendidos" SHALL exibir os 4 produtos retornados por `getBestsellers(4)`

#### Scenario: Seção "Recomendados para você" com dados reais
- **WHEN** usuário acessa `http://localhost:3000/`
- **THEN** a seção "Recomendados para você" SHALL exibir os 4 produtos retornados por `getRecommended(4)`

#### Scenario: Grade de departamentos com dados reais
- **WHEN** usuário acessa `http://localhost:3000/`
- **THEN** o componente `DepartmentsGrid` SHALL exibir os departamentos retornados por `getDepartments()`

#### Scenario: API indisponível
- **WHEN** o backend não está acessível e `fetch` lança erro
- **THEN** o erro SHALL propagar e o Next.js SHALL exibir a error boundary (comportamento padrão do App Router)

---

### Requirement: NEXT_PUBLIC_API_URL aponta para o backend
O arquivo `.env.local` SHALL conter `NEXT_PUBLIC_API_URL=http://localhost:3001` para que o `http-client.ts` resolva corretamente as chamadas à API.

#### Scenario: Variável de ambiente correta
- **WHEN** o Next.js é iniciado com o `.env.local` atualizado
- **THEN** `process.env.NEXT_PUBLIC_API_URL` SHALL ser `"http://localhost:3001"`

---

### Requirement: catalog.service.ts encapsula chamadas ao catálogo
O módulo `src/services/catalog.service.ts` SHALL exportar funções tipadas para cada seção da home, usando `fetch` nativo com cache ISR de 60 segundos.

#### Scenario: getBestsellers retorna produtos tipados
- **WHEN** `getBestsellers(4)` é chamado em um Server Component
- **THEN** SHALL retornar `Product[]` com no máximo 4 itens

#### Scenario: getRecommended retorna produtos tipados
- **WHEN** `getRecommended(4)` é chamado em um Server Component
- **THEN** SHALL retornar `Product[]` com no máximo 4 itens

#### Scenario: getDepartments retorna departamentos tipados
- **WHEN** `getDepartments()` é chamado em um Server Component
- **THEN** SHALL retornar `Department[]`

#### Scenario: Cache de 60 segundos
- **WHEN** as funções do catalog.service fazem chamadas fetch
- **THEN** SHALL usar `{ next: { revalidate: 60 } }` para revalidação via ISR

#### Scenario: Tipo Product do frontend compatível com CatalogProduct do backend
- **WHEN** a response de `GET /catalog/products` é deserializada
- **THEN** todos os campos de `Product` do frontend (`id`, `title`, `price`, `installments`, `freeShipping`, `rating`, `reviewCount`, `icon`, `badge?`) SHALL estar presentes na response do backend
