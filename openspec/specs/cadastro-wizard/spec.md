## Purpose

Define o comportamento do `CadastroWizard` — o componente orquestrador do fluxo de cadastro multi-passo. Cobre a renderização de cada passo, navegação entre passos, conteúdo do painel de marketing e do banner mobile por passo.

## Requirements

### Requirement: Renderização do passo 3
O passo 3 do `CadastroWizard` SHALL renderizar o componente `PreferencesForm` com a prop `onSuccess`, que ao ser chamada redireciona para `/` via `useRouter().push('/')`.

#### Scenario: Passo 3 renderiza PreferencesForm
- **WHEN** `step === 3`
- **THEN** o wizard renderiza `<PreferencesForm onSuccess={handleStep3Success} />` no lugar do placeholder

#### Scenario: onSuccess do passo 3 redireciona para home
- **WHEN** `PreferencesForm` chama `onSuccess()`
- **THEN** `router.push('/')` é executado e o usuário navega para a home

---

### Requirement: Textos do passo 3 no MarketingPanel
O `MarketingPanel` SHALL exibir textos específicos do passo 3 quando `step === 3`:
- Headline: "Você está quase lá! Personalize sua experiência"
- Subtexto: "Escolha suas categorias favoritas e receba ofertas e recomendações personalizadas."
- Checklist com passos 1 e 2 marcados como concluídos e passo 3 como em andamento.

#### Scenario: MarketingPanel no passo 3
- **WHEN** `step === 3`
- **THEN** o painel esquerdo exibe a headline de personalização e o checklist com os dois primeiros passos concluídos

---

### Requirement: Textos do passo 3 no MobileMarketingBanner
O `MobileMarketingBanner` SHALL exibir o título "Quase lá!" e subtítulo "Passo 3 de 3 — preferências" quando `step === 3`.

#### Scenario: MobileMarketingBanner no passo 3
- **WHEN** `step === 3` em viewport mobile
- **THEN** o banner exibe "Quase lá!" e "Passo 3 de 3 — preferências"

---

### Requirement: Link para login no RegisterForm
O `RegisterForm` (step-1 do cadastro) SHALL exibir um link "Já tem conta? Entrar" que navega para `/login`, permitindo que usuários existentes acessem a página de autenticação diretamente a partir do fluxo de cadastro.

#### Scenario: Link para login está presente no step-1
- **WHEN** o usuário visualiza o step-1 do cadastro (`RegisterForm`)
- **THEN** um link "Entrar" (ou equivalente) está visível e navega para `/login` ao ser clicado
