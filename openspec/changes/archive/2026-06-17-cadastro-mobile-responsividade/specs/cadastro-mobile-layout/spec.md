## ADDED Requirements

### Requirement: Banner mobile exibido acima do formulário
Em telas menores que 1024px, a página de cadastro SHALL exibir um banner com fundo `#FFE600` no topo, contendo o logo do Mercado Semilivre, um título e um subtítulo. O banner SHALL ser ocultado em breakpoints `lg` e acima.

#### Scenario: Acesso mobile à página de cadastro
- **WHEN** o usuário acessa `/cadastro` em um viewport menor que 1024px
- **THEN** um banner amarelo aparece no topo da página com o logo, título "Crie sua conta e compre com frete grátis" e subtítulo "Rápido, gratuito e sem complicação."

#### Scenario: Acesso desktop à página de cadastro
- **WHEN** o usuário acessa `/cadastro` em um viewport maior ou igual a 1024px
- **THEN** o banner amarelo mobile NÃO é exibido e o painel de marketing desktop permanece visível

---

### Requirement: Card do formulário sobreposto ao banner no mobile
Em telas menores que 1024px, o `<main>` do formulário SHALL ter `border-radius` no topo (`rounded-t-3xl`), criando efeito visual de card sobreposto ao banner. Em desktop, o `border-radius` SHALL ser removido (`lg:rounded-none`).

#### Scenario: Efeito de sobreposição no mobile
- **WHEN** a página de cadastro é renderizada em viewport menor que 1024px
- **THEN** o card escuro do formulário exibe cantos arredondados no topo e se sobrepõe visualmente ao banner amarelo

---

### Requirement: Headings contextualizados por breakpoint
Em mobile, o heading principal SHALL exibir "Vamos começar" e o subtítulo SHALL exibir "Passo 1 de 3 — dados básicos". Em desktop, o heading SHALL exibir "Criar sua conta" e o subtítulo SHALL exibir "É rápido, gratuito e sem complicação".

#### Scenario: Heading no mobile
- **WHEN** o usuário visualiza o formulário de cadastro em viewport menor que 1024px
- **THEN** o heading exibe "Vamos começar" e o subtítulo exibe "Passo 1 de 3 — dados básicos"

#### Scenario: Heading no desktop
- **WHEN** o usuário visualiza o formulário de cadastro em viewport maior ou igual a 1024px
- **THEN** o heading exibe "Criar sua conta" e o subtítulo exibe "É rápido, gratuito e sem complicação"

---

### Requirement: Row de features abaixo do botão de submit no mobile
Abaixo do `SubmitButton` e antes do link "Já tem conta?", SHALL ser exibida uma row com três colunas iguais — "Frete grátis", "Compra segura" e "12x sem juros" — visível apenas em viewports menores que 1024px.

#### Scenario: Features visíveis no mobile
- **WHEN** o usuário visualiza o formulário de cadastro em viewport menor que 1024px
- **THEN** três colunas com ícone e label são exibidas abaixo do botão de submit

#### Scenario: Features ocultas no desktop
- **WHEN** o usuário visualiza o formulário de cadastro em viewport maior ou igual a 1024px
- **THEN** a row de features NÃO é exibida

---

### Requirement: Logo carregada com prioridade no mobile
O componente `MobileMarketingBanner` SHALL usar `priority` no `<Image>` do logo, pois está acima da dobra no mobile.

#### Scenario: Logo above the fold
- **WHEN** a página de cadastro é renderizada no mobile
- **THEN** a imagem do logo inicia download imediatamente (sem lazy loading)
