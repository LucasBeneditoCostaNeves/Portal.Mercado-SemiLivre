## Purpose

Define o comportamento do formulário de preferências de categorias exibido no passo 3 do wizard de cadastro. Cobre seleção múltipla de categorias por toggle visual, submissão via Server Action e redirecionamento após conclusão.

## Requirements

### Requirement: Exibição do formulário de preferências
O sistema SHALL exibir o `PreferencesForm` no passo 3 do wizard de cadastro quando o usuário avançar com sucesso do passo 2.

#### Scenario: Renderização do passo 3
- **WHEN** o usuário submete o passo 2 com sucesso
- **THEN** o passo 3 exibe um grid 2×2 com os cards: Eletrônicos, Moda, Casa e decoração, Esportes

---

### Requirement: Seleção múltipla de categorias
O sistema SHALL permitir que o usuário selecione zero ou mais categorias de interesse por toggle visual.

#### Scenario: Selecionar uma categoria
- **WHEN** o usuário clica em um card de categoria não selecionado
- **THEN** o card recebe estado "selecionado" (borda e fundo destacados) e a categoria é adicionada à seleção

#### Scenario: Deselecionar uma categoria
- **WHEN** o usuário clica em um card de categoria já selecionado
- **THEN** o card volta ao estado padrão e a categoria é removida da seleção

#### Scenario: Múltiplas categorias selecionadas
- **WHEN** o usuário clica em dois ou mais cards distintos
- **THEN** todos os cards clicados exibem estado selecionado simultaneamente

---

### Requirement: Submissão com categorias selecionadas
O sistema SHALL enviar as categorias selecionadas à Server Action `savePreferences` ao clicar em "Concluir cadastro".

#### Scenario: Concluir com pelo menos uma categoria
- **WHEN** o usuário seleciona ao menos uma categoria e clica em "Concluir cadastro"
- **THEN** `savePreferences` é invocada com o array de categorias selecionadas e retorna `{ success: true }`

#### Scenario: Concluir sem nenhuma categoria
- **WHEN** o usuário não seleciona nenhuma categoria e clica em "Concluir cadastro"
- **THEN** `savePreferences` é invocada com array vazio e retorna `{ success: true }` (sem erro de validação)

---

### Requirement: Skip de preferências
O sistema SHALL permitir que o usuário pule a seleção de preferências via link "Pular por enquanto".

#### Scenario: Pular seleção
- **WHEN** o usuário clica em "Pular por enquanto"
- **THEN** o wizard avança sem enviar categorias e o usuário é redirecionado para `/`

---

### Requirement: Redirecionamento após conclusão
O sistema SHALL redirecionar o usuário para `/` após a conclusão bem-sucedida do passo 3.

#### Scenario: Redirect ao concluir
- **WHEN** `savePreferences` retorna `{ success: true }`
- **THEN** o wizard chama `router.push('/')` e o usuário é enviado para a home
