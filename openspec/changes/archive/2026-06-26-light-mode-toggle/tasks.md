## 1. Tokens de Cor e CSS Foundation

- [x] 1.1 Adicionar tokens de cor ao `src/app/globals.css` sob seletores `.dark` e `.light`: bg-primary, bg-secondary, bg-elevated, text-primary, text-secondary, brand (#FFE600 fixo), brand-dark (#2D3277 fixo), border, surface-card
- [x] 1.2 Criar `src/lib/theme-tokens.ts` com aliases de classe Tailwind v4 para os tokens (`bg-[var(--color-bg-primary)]` etc.) a fim de evitar repetição inline

## 2. ThemeProvider e Script Anti-Flash

- [x] 2.1 Criar `src/components/theme-provider.tsx` — Client Component com Context exportando `{ theme, toggleTheme }`, inicializando pelo `localStorage` com fallback `'dark'`, e persistindo alterações
- [x] 2.2 Adicionar script inline no `<head>` do `src/app/layout.tsx` que lê `localStorage.getItem('theme')` antes do hydration e aplica a classe ao `document.documentElement` (com try/catch para segurança SSR)
- [x] 2.3 Envolver o `{children}` no `src/app/layout.tsx` com o `ThemeProvider`
- [x] 2.4 Verificar que o `<html>` recebe a classe correta ao carregar e ao alternar o tema (inspecionar no DevTools)

## 3. ThemeToggle Component

- [x] 3.1 Criar `src/components/theme-toggle.tsx` — Client Component que consome `useTheme()` e renderiza `<button>` com ícone `ti-sun` (em dark) / `ti-moon` (em light) e `aria-label` adequado
- [x] 3.2 Verificar que o botão alterna o tema, atualiza o ícone e persiste a preferência no localStorage

## 4. Refatoração: Home Page

- [x] 4.1 Substituir cores hardcoded da `Navbar` (`bg-zinc-900`, `text-white`, `text-zinc-400`) pelos tokens de tema; manter fundo `#FFE600` via `--color-brand`
- [x] 4.2 Inserir `ThemeToggle` no grupo de ações da `Navbar` (ao lado de Pedidos e Carrinho)
- [x] 4.3 Substituir cores hardcoded da `Subnav` (`bg-[#2D3277]`) por `var(--color-brand-dark)`
- [x] 4.4 Substituir cores hardcoded do `HeroBanner` e stat cards pelos tokens de tema e brand
- [x] 4.5 Substituir cores hardcoded dos `ProductCard`s (`bg-zinc-800`, `bg-zinc-900`, `text-zinc-400`) pelos tokens de tema
- [x] 4.6 Substituir cores hardcoded da `PromoRow` (`#FFE600`, `#2D3277`) por `var(--color-brand)` e `var(--color-brand-dark)`
- [x] 4.7 Substituir cores hardcoded do `Footer` (`bg-[#2D3277]`) por `var(--color-brand-dark)`
- [x] 4.8 Testar home page em dark e light mode, verificar contraste dos textos

## 5. Refatoração: Login Page

- [x] 5.1 Substituir cores hardcoded do painel de formulário da `/login` (fundo dark, inputs, bordas) pelos tokens de tema
- [x] 5.2 Manter fundo `#FFE600` do painel de marketing via `var(--color-brand)` — sem alteração visual
- [x] 5.3 Inserir `ThemeToggle` no canto superior direito do painel de formulário
- [x] 5.4 Substituir cores hardcoded do botão "Entrar" (`bg-[#2D3277]`, `text-[#FFE600]`) por `var(--color-brand-dark)` e `var(--color-brand)`
- [x] 5.5 Testar `/login` em dark e light mode, verificar contraste dos campos e textos

## 6. Refatoração: Cadastro Wizard

- [x] 6.1 Substituir cores hardcoded do painel de formulário do `CadastroWizard` pelos tokens de tema (fundo, inputs, bordas, checklist)
- [x] 6.2 Manter fundo `#FFE600` do `MarketingPanel` via `var(--color-brand)` — sem alteração visual
- [x] 6.3 Inserir `ThemeToggle` no canto superior direito do painel de formulário do wizard
- [x] 6.4 Substituir cores hardcoded do `MobileMarketingBanner` pelos tokens adequados
- [x] 6.5 Testar `/cadastro` em todos os passos (1, 2, 3) em dark e light mode, verificar contraste

## 7. Verificação Final de Contraste e QA

- [x] 7.1 Verificar contraste WCAG AA (≥ 4.5:1) em todos os pares texto/fundo do light mode usando DevTools ou ferramenta de contraste
- [x] 7.2 Confirmar que `#FFE600` nunca é usado como cor de texto sobre fundo branco (apenas como background com texto escuro sobre ele)
- [x] 7.3 Testar comportamento do toggle em mobile em todas as páginas
- [x] 7.4 Testar persistência da preferência: alterar tema → fechar aba → reabrir → confirmar que o tema correto é carregado sem flash
