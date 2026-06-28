## ADDED Requirements

### Requirement: Rota /buscar com resultados de pesquisa por query param
A página SHALL existir em `/buscar` e aceitar o query param `q` obrigatório (string). Sem `q` ou com `q` com menos de 2 caracteres, o sistema SHALL redirecionar para `/`. A página SHALL ser um Server Component que renderiza os primeiros 20 resultados via SSR, com `<title>Resultados para "{q}" | Mercado SemiLivre</title>` e `<meta name="robots" content="noindex">`.

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

---

### Requirement: Cabeçalho de resultados com contagem
A página SHALL renderizar um `SearchHeader` exibindo "{N} resultados para '{q}'" onde N é o total retornado pelo backend.

#### Scenario: Contagem exibida
- **WHEN** a busca por "notebook" retorna 47 produtos no total
- **THEN** o cabeçalho exibe "47 resultados para 'notebook'"

#### Scenario: Resultado único
- **WHEN** a busca retorna 1 produto
- **THEN** o cabeçalho exibe "1 resultado para '{q}'"

---

### Requirement: Grid de produtos reutiliza ProductCard
A página SHALL renderizar os produtos em grid responsivo `grid-cols-2 lg:grid-cols-5`, usando o componente `ProductCard` existente sem modificações.

#### Scenario: Grid em desktop
- **WHEN** a viewport tem 1024px ou mais
- **THEN** os produtos são exibidos em 5 colunas

#### Scenario: Grid em mobile
- **WHEN** a viewport tem menos de 1024px
- **THEN** os produtos são exibidos em 2 colunas

#### Scenario: Cada card linka para /produto/[id]
- **WHEN** usuário clica em um ProductCard nos resultados
- **THEN** o sistema navega para `/produto/{id}` do produto

---

### Requirement: Infinite scroll com Intersection Observer
A partir da primeira carga de 20 produtos, a página SHALL carregar mais 20 produtos automaticamente quando o usuário rolar até o sentinel element no final da lista. O carregamento SHALL ser client-side via `fetch` direto ao backend com `offset` incrementado.

#### Scenario: Carregamento de próxima página ao atingir sentinel
- **WHEN** o usuário rola até o final da lista e `hasMore` é `true`
- **THEN** o sistema busca os próximos 20 produtos e os adiciona ao grid sem reload

#### Scenario: Skeleton durante carregamento
- **WHEN** o carregamento da próxima página está em progresso
- **THEN** o grid exibe skeleton cards no final da lista

#### Scenario: Fim dos resultados
- **WHEN** `hasMore` é `false`
- **THEN** o sentinel é removido e a mensagem "Você viu todos os resultados" é exibida no final do grid

#### Scenario: Reset ao mudar filtros
- **WHEN** o usuário aplica ou altera qualquer filtro
- **THEN** a lista é resetada para os primeiros 20 resultados (offset 0) e o scroll retorna ao topo da lista

---

### Requirement: Estado vazio quando sem resultados
Quando a busca retornar 0 produtos, a página SHALL exibir o componente `EmptySearchState` com ícone de lupa, mensagem "Nenhum produto encontrado para '{q}'", dica "Verifique a ortografia ou tente outro termo" e um botão CTA "Voltar para a home" que navega para `/`.

#### Scenario: Zero resultados
- **WHEN** a busca não retorna nenhum produto
- **THEN** o grid não é exibido e `EmptySearchState` é renderizado no lugar

#### Scenario: CTA de retorno à home
- **WHEN** usuário clica em "Voltar para a home" no estado vazio
- **THEN** o sistema navega para `/`

---

### Requirement: Loading state com skeleton do grid
A rota SHALL ter um `loading.tsx` que exibe um skeleton do grid de produtos durante o carregamento da página.

#### Scenario: Loading exibido durante navegação
- **WHEN** o usuário navega para `/buscar?q={termo}`
- **THEN** o skeleton do grid é exibido enquanto o Server Component carrega os dados
