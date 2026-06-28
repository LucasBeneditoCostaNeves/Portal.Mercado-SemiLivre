## Why

O projeto está fixado em dark mode com cores hardcoded por toda a base de código. Usuários têm preferências diferentes de contraste e conforto visual — oferecer light mode aumenta acessibilidade e satisfação, além de alinhar com a expectativa padrão de produtos modernos.

## What Changes

- Introdução de um sistema de tokens de cor via CSS custom properties no `globals.css`, substituindo as cores hardcoded espalhadas pelos componentes
- A cor amarela `#FFE600` permanece **imutável** em ambos os temas — é a identidade da marca
- Novo `ThemeProvider` (Client Component) envolve o app no root layout, gerenciando o estado do tema e persistindo a preferência no `localStorage`
- Novo `ThemeToggle` (Client Component) disponível em todas as páginas via header/navbar, permitindo ao usuário alternar entre dark e light com um único clique
- Aplicação de classe `.dark` ou `.light` no elemento `<html>` para ativação dos tokens de cor corretos via Tailwind v4
- Refatoração de todos os componentes existentes para consumir as variáveis de cor ao invés de valores hex hardcoded

## Capabilities

### New Capabilities

- `theme-system`: Sistema de tokens de cor via CSS custom properties com variantes dark/light, incluindo `ThemeProvider` e persistência de preferência
- `theme-toggle`: Componente reutilizável de alternância de tema disponível globalmente em todas as páginas

### Modified Capabilities

- `home-page`: Consome tokens de cor do novo sistema de temas ao invés de classes Tailwind hardcoded
- `login-page`: Consome tokens de cor do novo sistema de temas ao invés de hex colors hardcoded
- `cadastro-wizard`: Consome tokens de cor do novo sistema de temas ao invés de hex colors hardcoded

## Impact

- **globals.css**: Adição de CSS custom properties para ambos os temas sob seletores `:root.dark` e `:root.light`
- **src/app/layout.tsx**: Envolvimento do app no `ThemeProvider`, adição do script anti-flash para SSR
- **Todos os componentes**: Substituição de `bg-zinc-900`, `bg-zinc-800`, `#18181b`, `text-white`, `text-zinc-400` etc. por classes utilitárias que consomem os tokens
- **Nenhuma dependência externa nova**: A solução usa apenas CSS nativo + Tailwind v4 (sem `next-themes` ou similares)
- **Contraste**: Light mode deve respeitar WCAG AA (4.5:1 mínimo para texto) — amarelo `#FFE600` sobre branco requer texto escuro sobreposto
