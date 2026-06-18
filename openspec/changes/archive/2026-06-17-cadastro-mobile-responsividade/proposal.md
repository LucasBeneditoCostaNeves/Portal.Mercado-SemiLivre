## Why

A página `/cadastro` exibe apenas o painel escuro do formulário em telas menores que 1024px, sem logo, sem contexto de marca, sem hierarquia visual — experiência degradada para a maioria dos usuários mobile. O design de referência já está definido e aprovado; a implementação está bloqueando o lançamento do fluxo de cadastro.

## What Changes

- Novo componente `MobileMarketingBanner` — banner amarelo (`#FFE600`) com logo, título e subtítulo, visível apenas no mobile
- Novo componente `MobileFeatureRow` — linha de três features (frete grátis, compra segura, 12x sem juros) exibida abaixo do botão de submit no mobile
- `page.tsx` do cadastro ajustada para layout `flex-col` no mobile e `flex-row` no desktop, com `rounded-t-3xl` no `<main>` criando efeito de card sobre o banner
- Headings do formulário alterados para "Vamos começar" / "Passo 1 de 3 — dados básicos" no mobile (mantendo os atuais no desktop)

## Capabilities

### New Capabilities

- `cadastro-mobile-layout`: Layout responsivo da página de cadastro com banner de marketing mobile, card do formulário sobreposto e row de features abaixo do submit

### Modified Capabilities

<!-- Nenhuma spec existente tem seus requisitos alterados — esta é a primeira spec de layout do cadastro -->

## Impact

- **Arquivos modificados**: `src/app/cadastro/page.tsx`, `src/app/cadastro/_components/register-form.tsx`
- **Novos componentes**: `mobile-marketing-banner.tsx`, `mobile-feature-row.tsx`
- **Sem novas dependências**: apenas Tailwind CSS e `next/image` (já no projeto)
- **Sem breaking changes**: desktop permanece idêntico
