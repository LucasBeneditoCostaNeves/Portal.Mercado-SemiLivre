## 1. Novos componentes

- [x] 1.1 Criar `src/app/cadastro/_components/mobile-marketing-banner.tsx` — Server Component com banner `bg-[#FFE600]`, logo via `next/image` com `priority`, título e subtítulo
- [x] 1.2 Criar `src/app/cadastro/_components/mobile-feature-row.tsx` — Server Component com três colunas (Frete grátis, Compra segura, 12x sem juros) separadas por `border-r border-zinc-700`

## 2. Ajustes no `page.tsx`

- [x] 2.1 Alterar wrapper principal para `flex flex-col lg:flex-row min-h-screen`
- [x] 2.2 Adicionar `<MobileMarketingBanner className="lg:hidden" />` antes do `<aside>`
- [x] 2.3 Adicionar `rounded-t-3xl lg:rounded-none` ao `<main>`
- [x] 2.4 Adicionar headings responsivos no bloco do formulário: "Vamos começar" / "Passo 1 de 3 — dados básicos" com `lg:hidden`, e "Criar sua conta" / "É rápido, gratuito e sem complicação" com `hidden lg:block`

## 3. Ajustes no `register-form.tsx`

- [x] 3.1 Importar e adicionar `<MobileFeatureRow />` com `lg:hidden` abaixo do `SubmitButton` e acima do link "Já tem conta?"

## 4. Verificação

- [x] 4.1 Testar layout mobile (viewport < 1024px): banner aparece, card sobreposto, headings corretos, feature row visível
- [x] 4.2 Testar layout desktop (viewport ≥ 1024px): painel 50/50 inalterado, banner mobile oculto, feature row oculta
- [x] 4.3 Verificar sem overflow horizontal em ambos os breakpoints
