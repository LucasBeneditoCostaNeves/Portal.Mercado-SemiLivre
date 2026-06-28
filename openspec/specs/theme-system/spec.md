## Purpose

TBD — Define o sistema de temas do Portal Mercado Semi-Livre: tokens de cor via CSS custom properties, ThemeProvider e script anti-flash para dark/light mode.

---

## Requirements

### Requirement: Tokens de cor definidos via CSS custom properties
O `globals.css` SHALL definir dois conjuntos de tokens de cor — um sob o seletor `.dark` e outro sob `.light` — cobrindo: background primário/secundário/elevado, texto primário/secundário, brand (`#FFE600`), brand-dark (`#2D3277`), border e surface-card. A cor `#FFE600` SHALL ter o mesmo valor em ambos os seletores.

#### Scenario: Token de fundo primário em dark mode
- **WHEN** o elemento `<html>` tem a classe `dark`
- **THEN** `--color-bg-primary` resolve para `#18181b`

#### Scenario: Token de fundo primário em light mode
- **WHEN** o elemento `<html>` tem a classe `light`
- **THEN** `--color-bg-primary` resolve para `#ffffff`

#### Scenario: Token brand é idêntico em ambos os temas
- **WHEN** o tema ativo é `dark` ou `light`
- **THEN** `--color-brand` resolve para `#FFE600` em ambos os casos

---

### Requirement: ThemeProvider gerencia e persiste o tema ativo
O `ThemeProvider` (Client Component) SHALL:
- Inicializar o tema lendo `localStorage.getItem('theme')`, com fallback para `'dark'`
- Manter o estado do tema ativo via React Context exportando `useTheme(): { theme, toggleTheme }`
- Ao alternar o tema, atualizar `document.documentElement.className` e persistir o novo valor em `localStorage.setItem('theme', newTheme)`
- Envolver toda a árvore do app no `src/app/layout.tsx`

#### Scenario: Preferência persistida carrega no próximo acesso
- **WHEN** o usuário escolhe light mode e recarrega a página
- **THEN** o sistema aplica light mode sem flash, lendo a preferência do localStorage

#### Scenario: Fallback para dark mode sem preferência salva
- **WHEN** não há valor em `localStorage` para a chave `'theme'`
- **THEN** o sistema aplica dark mode por padrão

#### Scenario: toggleTheme alterna entre dark e light
- **WHEN** `toggleTheme()` é chamado com tema atual `'dark'`
- **THEN** o tema muda para `'light'`, `document.documentElement.className` é atualizado e o localStorage é persistido

---

### Requirement: Script inline anti-flash no root layout
O `src/app/layout.tsx` SHALL incluir um `<script>` inline no `<head>`, executado antes do hydration, que lê `localStorage.getItem('theme')` e aplica imediatamente a classe correspondente ao `document.documentElement`, prevenindo FOUC (Flash of Unstyled Content).

#### Scenario: Tema correto aplicado antes do hydration
- **WHEN** a página carrega com preferência `'light'` salva no localStorage
- **THEN** o `<html>` já tem a classe `light` antes de qualquer componente React renderizar, sem flash visual

#### Scenario: Script não quebra em ausência de localStorage (SSR)
- **WHEN** o script é parseado no servidor (sem acesso ao localStorage)
- **THEN** o script não lança erro — usa try/catch ou verificação de `typeof localStorage !== 'undefined'`
