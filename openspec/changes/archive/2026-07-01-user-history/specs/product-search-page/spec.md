## MODIFIED Requirements

### Requirement: Rota /buscar com resultados de pesquisa por query param
A página SHALL existir em `/buscar` e aceitar o query param `q` obrigatório (string). Sem `q` ou com `q` com menos de 2 caracteres, o sistema SHALL redirecionar para `/`. A página SHALL ser um Server Component que renderiza os primeiros 20 resultados via SSR, com `<title>Resultados para "{q}" | Mercado SemiLivre</title>` e `<meta name="robots" content="noindex">`. Ao carregar, a página SHALL disparar o registro do termo `q` no histórico do usuário autenticado via Server Action (fire-and-forget).

#### Scenario: Acesso sem query param q
- **WHEN** usuário acessa `/buscar` sem o param `q`
- **THEN** o sistema redireciona para `/`

#### Scenario: Acesso com q menor que 2 caracteres
- **WHEN** usuário acessa `/buscar?q=a`
- **THEN** o sistema redireciona para `/`

#### Scenario: Acesso com q válido
- **WHEN** usuário acessa `/buscar?q=notebook`
- **THEN** a página renderiza com título "Resultados para "notebook" | Mercado SemiLivre" e lista de produtos filtrados

#### Scenario: Meta robots noindex
- **WHEN** a página é renderizada
- **THEN** o HTML contém `<meta name="robots" content="noindex">`

#### Scenario: Primeira carga SSR com 20 produtos
- **WHEN** a página é carregada pela primeira vez
- **THEN** os primeiros 20 produtos já estão no HTML (sem loading spinner inicial)

#### Scenario: Busca registrada no histórico ao carregar a página
- **WHEN** um usuário autenticado acessa `/buscar?q=notebook`
- **THEN** o termo "notebook" é enviado ao backend via POST /history/search sem bloquear o carregamento da página

#### Scenario: Busca não registrada para usuário não autenticado
- **WHEN** um usuário sem sessão acessa `/buscar?q=notebook`
- **THEN** nenhuma chamada ao endpoint de histórico é feita
