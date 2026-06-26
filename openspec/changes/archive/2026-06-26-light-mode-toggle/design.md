## Context

O projeto usa Tailwind CSS v4 com cores hardcoded (`#18181b`, `bg-zinc-900`, `#FFE600`, `#2D3277`, etc.) espalhadas por todos os componentes. Não existe nenhuma infraestrutura de temas — sem CSS custom properties, sem `ThemeProvider`, sem classe `.dark` no `<html>`. A cor amarela `#FFE600` é identidade de marca e deve permanecer idêntica em ambos os temas. O projeto usa Tailwind v4 com `@theme inline` no `globals.css` e sem `tailwind.config.ts`.

## Goals / Non-Goals

**Goals:**
- Definir tokens de cor via CSS custom properties no `globals.css`, ativados por classe `.dark` / `.light` no `<html>`
- Criar `ThemeProvider` (Client Component) que gerencia estado do tema, persiste no `localStorage` e aplica a classe no `<html>` sem flash no carregamento
- Criar `ThemeToggle` — componente reutilizável disponível em todas as páginas
- Garantir contraste WCAG AA (≥ 4.5:1) em todos os pares texto/fundo do light mode
- A cor `#FFE600` permanece idêntica em ambos os temas

**Non-Goals:**
- Suporte a tema `system` (match automático com OS preference) — escopo futuro
- Animação de transição entre temas
- Temas adicionais além de dark e light
- Substituir o Tailwind v4 ou adotar bibliotecas como `next-themes`

## Decisions

### 1. CSS Custom Properties ativados por classe no `<html>`

**Decisão**: tokens de cor definidos em `globals.css` sob seletores `.dark` e `.light`. O elemento `<html>` recebe a classe correspondente ao tema ativo.

**Alternativa descartada**: Tailwind `dark:` variant (requer `darkMode: 'class'` que não existe no Tailwind v4 com `@theme inline`). O Tailwind v4 não tem arquivo de configuração — usar CSS custom properties nativas é a abordagem idiomática.

**Tokens de cor definidos:**

| Token | Dark | Light |
|---|---|---|
| `--color-bg-primary` | `#18181b` | `#ffffff` |
| `--color-bg-secondary` | `#27272a` | `#f4f4f5` |
| `--color-bg-elevated` | `#3f3f46` | `#e4e4e7` |
| `--color-text-primary` | `#ffffff` | `#18181b` |
| `--color-text-secondary` | `#a1a1aa` | `#52525b` |
| `--color-brand` | `#FFE600` | `#FFE600` ← imutável |
| `--color-brand-dark` | `#2D3277` | `#2D3277` ← imutável |
| `--color-border` | `#3f3f46` | `#d4d4d8` |
| `--color-surface-card` | `#27272a` | `#ffffff` |

**Contraste light mode verificado:**
- `#18181b` (texto) sobre `#ffffff` (fundo) → ~19:1 ✓
- `#52525b` (texto secundário) sobre `#ffffff` → ~7:1 ✓
- `#18181b` (texto) sobre `#FFE600` (brand) → ~14:1 ✓ (amarelo sempre com texto escuro)
- `#FFE600` não é usado como cor de texto em nenhum tema

### 2. ThemeProvider com inline script anti-flash

**Decisão**: Um `<script>` inline no `<head>` (antes do hydration) lê o `localStorage` e aplica a classe ao `<html>` imediatamente — prevenindo o flash de conteúdo não estilizado (FOUC) em SSR.

```ts
// Executado antes do hydration — sem acesso ao React
const theme = localStorage.getItem('theme') ?? 'dark'
document.documentElement.className = theme
```

O `ThemeProvider` (Client Component) sincroniza o estado React com o que o script já aplicou.

**Alternativa descartada**: `next-themes` — dependência externa desnecessária dado que a solução nativa é simples e controlável.

### 3. ThemeToggle em cada página

**Decisão**: `ThemeToggle` é um Client Component que lê o contexto do `ThemeProvider` e renderiza um `<button>` com ícone de sol/lua. Ele é inserido:
- **Home**: no canto direito da `Navbar`, ao lado das ações de usuário
- **Login / Cadastro**: no canto superior direito do formulário (área sem painel de marketing em mobile)

Não há um Header compartilhado entre home e auth pages — o toggle precisa ser inserido individualmente em cada layout de página.

### 4. Refatoração de classes Tailwind

**Decisão**: Substituir classes hardcoded (`bg-zinc-900`, `text-white`, `bg-zinc-800`) por classes utilitárias que referenciam os tokens CSS. Com Tailwind v4, propriedades CSS customizadas podem ser usadas diretamente: `bg-[var(--color-bg-primary)]`.

Criar um arquivo `src/lib/theme-tokens.ts` com aliases de classe para evitar repetição: `bgPrimary = 'bg-[var(--color-bg-primary)]'` etc.

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Flash de tema errado no carregamento (FOUC) | Inline script no `<head>` antes do hydration aplica a classe imediatamente |
| `localStorage` não disponível em SSR | Script inline executa apenas no browser; ThemeProvider usa `useEffect` para sincronizar |
| Tailwind v4 sem `dark:` variant nativa | Usar `bg-[var(--token)]` diretamente — verbose mas funcional sem config extra |
| Amarelo `#FFE600` com baixo contraste sobre fundo branco | Yellow nunca é usado como cor de texto; apenas como background/accent com texto escuro sobre ele |
| Muitos componentes para refatorar | Criar o token alias file centralizado; refatorar por componente com risk de regressão visual mínimo |

## Migration Plan

1. Adicionar tokens de cor ao `globals.css` (aditivo, não quebra nada)
2. Criar `ThemeProvider` + inline script no `layout.tsx`
3. Criar `ThemeToggle` component
4. Refatorar componentes página por página, começando pela home
5. Verificar contraste visual de cada página após refatoração

Rollback: remover a classe do `<html>` e reverter os componentes — os tokens CSS ficam no globals mas sem efeito se a classe não for aplicada.

## Open Questions

- O light mode do painel de marketing do `/login` (atualmente com fundo `#FFE600`) deve manter o amarelo ou usar um fundo neutro? → **Decisão**: manter `#FFE600` (brand imutável), painel permanece amarelo em ambos os temas.
- A `Subnav` (fundo `#2D3277`) e o `Footer` devem adaptar ao light mode? → **Decisão**: sim, usar `--color-brand-dark` como token — em light mode pode ser usado com opacity reduzida ou tom mais suave, mantendo a identidade mas sem background azul-escuro em tela branca.
