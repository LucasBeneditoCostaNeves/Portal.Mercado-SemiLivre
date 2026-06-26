## Purpose

Define o comportamento da página `/login` — layout, formulário de autenticação com e-mail e senha, validação, placeholder de OAuth com Google e links de navegação.

## Requirements

### Requirement: Layout split-screen desktop
A página `/login` SHALL renderizar um layout de duas colunas em viewports `lg` ou maiores: coluna esquerda com painel de marketing (fundo `#FFE600`) e coluna direita com o formulário de autenticação. Em viewports menores que `lg`, a coluna esquerda SHALL ser ocultada e apenas o formulário SHALL ocupar a tela.

#### Scenario: Desktop exibe painel de marketing
- **WHEN** o usuário acessa `/login` em viewport `>= lg`
- **THEN** a página exibe duas colunas: painel amarelo à esquerda e formulário à direita

#### Scenario: Mobile oculta painel de marketing
- **WHEN** o usuário acessa `/login` em viewport `< lg`
- **THEN** apenas o formulário de login é exibido, sem o painel amarelo

---

### Requirement: Conteúdo do painel de marketing
O painel esquerdo SHALL exibir:
- Logo do Mercado Livre (ícone `ti-arrows-exchange` em círculo `#2D3277` + texto "mercado livre")
- Título "Bem-vindo de volta!" e parágrafo descritivo
- Três itens de stat com ícone e texto: pedidos (`ti-package`), favoritos (`ti-heart`), ofertas exclusivas (`ti-tag`)
- Rodapé com texto "Acesso seguro e criptografado"

#### Scenario: Painel exibe todos os elementos de marketing
- **WHEN** a página é renderizada em desktop
- **THEN** o painel esquerdo contém logo, título, 3 itens de stat e nota de segurança

---

### Requirement: Formulário de login com e-mail e senha
O formulário SHALL conter:
- Campo de e-mail com ícone `ti-mail` e `type="email"`
- Campo de senha com ícone `ti-eye` / `ti-eye-off` para toggle show/hide e `type="password"` por padrão
- Botão de submissão "Entrar" com ícone `ti-arrow-right` (fundo `#2D3277`, texto `#FFE600`)

#### Scenario: Campos do formulário estão presentes
- **WHEN** o usuário abre a página de login
- **THEN** os campos de e-mail e senha são exibidos com seus respectivos ícones

#### Scenario: Toggle show/hide senha
- **WHEN** o usuário clica no ícone de olho no campo de senha
- **THEN** o campo alterna entre `type="password"` e `type="text"`, mostrando/ocultando os caracteres

---

### Requirement: Botão Google OAuth placeholder
A página SHALL exibir um botão "Continuar com o Google" com o SVG do logo do Google. O botão SHALL estar desabilitado (`disabled`) e não realizar nenhuma ação na versão atual.

#### Scenario: Botão Google renderizado mas inativo
- **WHEN** o usuário visualiza a página de login
- **THEN** o botão do Google é exibido com aparência desabilitada e não dispara ação ao ser clicado

---

### Requirement: Validação do formulário de login
A Server Action `loginWithEmail` SHALL rejeitar a submissão e retornar erros de campo quando:
- E-mail estiver vazio ou em formato inválido
- Senha estiver vazia ou tiver menos de 6 caracteres

#### Scenario: E-mail inválido
- **WHEN** o usuário submete o formulário com um e-mail em formato inválido (ex: "nao-e-email")
- **THEN** a ação retorna `errors.email` com mensagem "E-mail inválido" e o formulário exibe o erro abaixo do campo

#### Scenario: Senha muito curta
- **WHEN** o usuário submete o formulário com senha de menos de 6 caracteres
- **THEN** a ação retorna `errors.password` com mensagem "Senha deve ter ao menos 6 caracteres"

#### Scenario: Campos vazios
- **WHEN** o usuário submete o formulário com e-mail e/ou senha em branco
- **THEN** a ação retorna os erros correspondentes de campo obrigatório

---

### Requirement: Server Action loginWithEmail integrada ao backend
A Server Action `loginWithEmail` SHALL, após validação bem-sucedida dos campos, chamar `authService.login(email, password)`. Em caso de sucesso, SHALL armazenar o token retornado via `setSession(acess_token)` e redirecionar o usuário para `/home` via `redirect()`. Em caso de falha com status 401, SHALL retornar `{ success: false, message: "E-mail ou senha incorretos." }`. Em caso de erro de rede ou inesperado, SHALL retornar `{ success: false, message: "Erro inesperado. Tente novamente." }`.

#### Scenario: Login bem-sucedido redireciona para /home
- **WHEN** o usuário submete e-mail e senha válidos que a API aceita
- **THEN** o cookie `session` é criado e o usuário é redirecionado para `/home`

#### Scenario: Credenciais inválidas exibem mensagem de erro
- **WHEN** o usuário submete e-mail e senha válidos no formato mas que a API rejeita (401)
- **THEN** a ação retorna `{ success: false, message: "E-mail ou senha incorretos." }` e o formulário exibe a mensagem sem recarregar a página

#### Scenario: Erro de rede exibe mensagem genérica
- **WHEN** a API está inacessível ao submeter o formulário
- **THEN** a ação retorna `{ success: false, message: "Erro inesperado. Tente novamente." }` e o formulário exibe a mensagem

---

### Requirement: Links de navegação no formulário
O formulário SHALL exibir:
- Link "Esqueci minha senha" alinhado à direita (aponta para `#` por ora)
- Link "Não tem conta? Criar conta grátis" que navega para `/cadastro`
- Nota de segurança com ícone `ti-lock` e texto "Conexão segura com criptografia SSL"

#### Scenario: Link para cadastro funciona
- **WHEN** o usuário clica em "Criar conta grátis"
- **THEN** é navegado para `/cadastro`

#### Scenario: Link "Esqueci minha senha" existe
- **WHEN** o usuário visualiza o formulário
- **THEN** o link "Esqueci minha senha" está visível e acessível (mesmo que ainda sem destino real)

---

### Requirement: ThemeToggle presente na página de login
A página `/login` SHALL renderizar o `ThemeToggle` no canto superior direito do painel do formulário, visível em todas as viewports (inclusive mobile, onde o painel de marketing é ocultado).

#### Scenario: Toggle visível em desktop
- **WHEN** o usuário acessa `/login` em viewport `>= lg`
- **THEN** o `ThemeToggle` é exibido no painel do formulário (coluna direita), acessível

#### Scenario: Toggle visível em mobile
- **WHEN** o usuário acessa `/login` em viewport `< lg`
- **THEN** o `ThemeToggle` é exibido no único painel visível (formulário), acessível

---

### Requirement: Página de login adapta cores ao tema ativo
Todos os elementos da página `/login` que não usam as cores de marca fixas SHALL usar os tokens de tema (`--color-bg-primary`, `--color-bg-secondary`, `--color-text-primary`, `--color-text-secondary`, `--color-border`), adaptando visualmente ao dark ou light mode.

#### Scenario: Painel de marketing mantém fundo amarelo em ambos os temas
- **WHEN** o tema ativo é `light` ou `dark`
- **THEN** o painel esquerdo (marketing) mantém fundo `--color-brand` (`#FFE600`)

#### Scenario: Formulário adapta fundo ao tema
- **WHEN** o tema ativo é `light`
- **THEN** o painel do formulário usa fundo `--color-bg-primary` (`#ffffff`) com texto `--color-text-primary` (`#18181b`)

#### Scenario: Formulário mantém contraste em dark mode
- **WHEN** o tema ativo é `dark`
- **THEN** o painel do formulário usa fundo `--color-bg-primary` (`#18181b`) com texto `--color-text-primary` (`#ffffff`)

#### Scenario: Campos de input adaptam ao tema
- **WHEN** o tema ativo muda
- **THEN** os campos de e-mail e senha atualizam bordas e fundo conforme `--color-border` e `--color-bg-secondary`
