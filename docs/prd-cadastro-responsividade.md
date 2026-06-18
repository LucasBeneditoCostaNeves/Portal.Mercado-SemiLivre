# PRD — Responsividade da tela de cadastro

## Objetivo

Fazer a página `/cadastro` funcionar corretamente em mobile, seguindo o design da referência visual. Atualmente o layout desktop (painel dividido) não tem equivalente para telas pequenas.

---

## Layout atual vs. layout desejado

| Breakpoint | Atual | Desejado |
|---|---|---|
| `< lg` (mobile/tablet) | Apenas o painel escuro do formulário, sem logo, sem contexto | Banner amarelo no topo + formulário abaixo em coluna única |
| `≥ lg` (desktop) | Painel amarelo à esquerda (50%) + formulário à direita (50%) | Mantém exatamente como está |

---

## Design mobile (referência da imagem)

### Seção 1 — Banner amarelo (topo, `bg-[#FFE600]`)
- Logo: usar **`/public/logo-mercadoSemilivre.png`** (não o ícone da imagem de referência)
- Título: `"Crie sua conta e compre com frete grátis"` — `text-2xl font-bold text-[#1a1f6e]`
- Subtítulo: `"Rápido, gratuito e sem complicação."` — `text-sm text-[#1a1f6e]`
- Padding: `px-6 py-8`
- Layout interno: logo em cima, título + subtítulo logo abaixo

### Seção 2 — Formulário (fundo `bg-[#18181b]`, borda superior arredondada)
- `rounded-t-3xl` sobrepondo o banner (efeito card que sobe sobre o amarelo)
- Padding: `px-6 pt-6 pb-10`
- Heading: `"Vamos começar"` — `text-2xl font-bold text-white`
- Subtítulo: `"Passo 1 de 3 — dados básicos"` — `text-sm text-zinc-400`
- `StepIndicator` fica entre o heading e o subtítulo (como na referência)
- Restante do formulário: igual ao atual (`RegisterForm`)

### Seção 3 — Rodapé de features (dentro do formulário, abaixo do botão submit)
- Três colunas iguais com ícone + label curto (já existem nos dados do `MarketingPanel`)
- Labels: `"Frete grátis"`, `"Compra segura"`, `"12x sem juros"`
- Ícone: usar o mesmo `FeatureIcon` que já existe em `marketing-panel.tsx`
- `text-xs text-zinc-400 text-center`

---

## Arquivos a modificar

### 1. `src/app/cadastro/page.tsx`

**O que muda:**
- Remover `min-h-screen` do `<main>` (o scroll deve ser da página toda no mobile)
- O wrapper `<div className="min-h-screen flex">` vira `flex-col` no mobile e `flex-row` no `lg`
- O `<aside>` continua `hidden lg:flex`
- Adicionar novo bloco **visível apenas no mobile** (`lg:hidden`) logo antes do `<main>`: um `<header>` amarelo com logo + título + subtítulo
- O `<main>` ganha `rounded-t-3xl lg:rounded-none` para o efeito de card sobre o banner no mobile

```tsx
// estrutura alvo (pseudocódigo)
<div className="min-h-screen flex flex-col lg:flex-row">

  {/* Banner mobile — oculto no desktop */}
  <MobileMarketingBanner className="lg:hidden" />

  {/* Painel desktop — oculto no mobile */}
  <aside className="hidden lg:flex w-1/2 bg-[#FFE600]">
    <MarketingPanel />
  </aside>

  {/* Formulário */}
  <main className="flex-1 bg-[#18181b] rounded-t-3xl lg:rounded-none flex justify-center">
    <div className="w-full max-w-[480px] px-6 lg:px-8 py-8 lg:py-12">
      <StepIndicator currentStep={1} totalSteps={3} />
      <div className="mb-6">
        <h1 ...>Vamos começar</h1>          {/* mobile */}
        <p ...>Passo 1 de 3 — dados básicos</p>
      </div>
      <RegisterForm />
    </div>
  </main>

</div>
```

> **Nota sobre heading:** No mobile o heading deve ser `"Vamos começar"` / `"Passo 1 de 3 — dados básicos"` (como na imagem). No desktop pode permanecer `"Criar sua conta"` / `"É rápido, gratuito e sem complicação"`. Isso pode ser resolvido com classes `hidden`/`block` por breakpoint ou extraindo a string para props no `StepIndicator`.

---

### 2. `src/app/cadastro/_components/marketing-panel.tsx`

**Nenhuma mudança necessária** — o componente já serve somente o desktop. O banner mobile será um componente novo e simples.

---

### 3. Novo componente: `src/app/cadastro/_components/mobile-marketing-banner.tsx`

Componente Server Component puro, sem estado.

```tsx
import Image from 'next/image'

export function MobileMarketingBanner() {
  return (
    <div className="bg-[#FFE600] px-6 pt-10 pb-14">
      <Image
        src="/logo-mercadoSemilivre.png"
        alt="Mercado Semilivre"
        width={110}
        height={74}
        priority
        style={{ height: 'auto' }}
        className="rounded-xl mb-6"
      />
      <h2 className="text-2xl font-bold text-[#1a1f6e] leading-snug mb-2">
        Crie sua conta e compre com frete grátis
      </h2>
      <p className="text-sm text-[#1a1f6e]">
        Rápido, gratuito e sem complicação.
      </p>
    </div>
  )
}
```

---

### 4. `src/app/cadastro/_components/register-form.tsx`

Adicionar bloco de features **abaixo** do `SubmitButton` e acima do link "Já tem conta?":

```tsx
<MobileFeatureRow />  {/* lg:hidden */}
```

---

### 5. Novo componente: `src/app/cadastro/_components/mobile-feature-row.tsx`

```tsx
const FEATURES = [
  { icon: '🚚', label: 'Frete grátis' },
  { icon: '🔒', label: 'Compra segura' },
  { icon: '💳', label: '12x sem juros' },
] as const
// ícone provisório — substituir por SVG se design evoluir
```

Três colunas iguais, separadas por divisores verticais sutis (`border-r border-zinc-700`).

---

## Tokens de design relevantes

| Token | Valor |
|---|---|
| Amarelo Mercado Livre | `#FFE600` |
| Azul escuro (texto no banner) | `#1a1f6e` |
| Fundo escuro | `#18181b` |
| Breakpoint desktop | `lg` (1024px) |
| Border radius do card mobile | `rounded-t-3xl` (24px) |

---

## Restrições

- **Ícone/logo:** usar exclusivamente `/public/logo-mercadoSemilivre.png`. Não usar o ícone circular presente na imagem de referência.
- **Server Components por padrão:** `MobileMarketingBanner` e `MobileFeatureRow` são Server Components — sem `"use client"`.
- **Sem nova dependência:** tudo com Tailwind CSS e componentes existentes.
- **`RegisterForm` não pode virar Server Component** — já usa `useActionState`, mantém `"use client"`.

---

## Critérios de aceite

- [ ] Em mobile (`< 1024px`): banner amarelo aparece no topo com logo, título e subtítulo
- [ ] O card do formulário sobrepõe o banner com `rounded-t-3xl`
- [ ] O heading exibe "Vamos começar" + "Passo 1 de 3 — dados básicos" no mobile
- [ ] A row de features aparece abaixo do botão submit apenas no mobile
- [ ] Em desktop (`≥ 1024px`): layout permanece idêntico ao atual (painel 50/50)
- [ ] Nenhum layout shift ou overflow horizontal em nenhum breakpoint
- [ ] Logo carrega com `priority` no mobile (above the fold)
