## Context

A página `/cadastro` usa um layout de duas colunas fixas (`flex-row`): painel amarelo de marketing à esquerda (`w-1/2`) e formulário escuro à direita (`w-1/2`). Em breakpoints menores que `lg` (1024px), o `<aside>` já é ocultado via `hidden lg:flex`, mas o `<main>` não possui equivalente visual — usuários mobile veem apenas o fundo escuro sem qualquer contexto de marca.

O design de referência define um padrão "banner + card sobreposto" comum em apps mobile-first: banner colorido fixo no topo, card escuro com `border-radius` no topo criando a sensação de sobreposição.

## Goals / Non-Goals

**Goals:**
- Banner mobile reutilizando os tokens de cor e o logo já presentes no projeto
- Efeito de card sobreposto (`rounded-t-3xl`) no `<main>` sobre o banner amarelo
- Row de features abaixo do submit, visível apenas no mobile
- Headings contextualizados para o mobile ("Vamos começar" / "Passo 1 de 3 — dados básicos")
- Layout desktop inalterado

**Non-Goals:**
- Animações ou transições entre breakpoints
- Alterações no `MarketingPanel` desktop
- Suporte a temas (dark/light)
- Internacionalização dos textos

## Decisions

### 1. Novos componentes em vez de condicionals inline no `page.tsx`
`MobileMarketingBanner` e `MobileFeatureRow` são componentes independentes, controlados por `lg:hidden` no ponto de uso. Alternativa (condicional via JS com `useMediaQuery`) foi descartada — cria hydration mismatch e exige `"use client"` desnecessário. Server Components puros resolvem sem custo.

### 2. Headings responsivos via classes Tailwind, sem props extras
O heading "Criar sua conta" (desktop) vs "Vamos começar" (mobile) será resolvido com dois elementos e classes `hidden`/`block lg:hidden`/`lg:block`. Alternativa (passar o heading como prop para `StepIndicator`) adicionaria acoplamento sem benefício real — o componente não precisa saber qual texto exibir.

### 3. `MobileFeatureRow` dentro de `register-form.tsx`, não em `page.tsx`
A row fica após o `SubmitButton` e antes do link "Já tem conta?". Colocá-la em `page.tsx` exigiria reestruturar o DOM do formulário. `register-form.tsx` já é `"use client"` — importar um Server Component dentro de um Client Component é válido no Next.js App Router.

### 4. `pb-14` no banner para compensar o overlap do card
O `rounded-t-3xl` do `<main>` cobre visualmente ~24px do banner. Um `pb-14` (56px) no banner garante que o conteúdo não fique coberto, sem cálculos em JS.

## Risks / Trade-offs

- **[Risco] Altura do banner varia com conteúdo** → O overlap é puramente visual (CSS), o DOM é `flex-col` sequencial — sem risco de sobreposição real de conteúdo.
- **[Trade-off] Dois blocos de heading no DOM** → Duplicação mínima (duas linhas de texto), troca aceitável por zero complexidade de estado.
- **[Risco] Logo com dimensões variáveis** → `style={{ height: 'auto' }}` com `width={110}` fixo garante proporção correta independente do arquivo PNG.
