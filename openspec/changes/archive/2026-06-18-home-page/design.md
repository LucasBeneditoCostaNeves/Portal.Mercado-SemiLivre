## Context

O portal possui páginas de `/login` e `/cadastro` com design system estabelecido (dark theme: #18181b/zinc-800/900, amarelo #FFE600, azul #2D3277, Tailwind CSS v4). A `src/app/page.tsx` está em branco. O mockup de referência usa variáveis CSS (`var(--color-background-primary)`) e tema claro — incompatível com o design system atual.

**Estado atual:** `page.tsx` retorna `null`.
**Restrições:** Server Components por padrão, Tabler Icons via classes CSS, sem dependências externas novas.

## Goals / Non-Goals

**Goals:**
- Implementar a home com layout fiel ao mockup, adaptado ao design system dark existente
- Componentes reutilizáveis preparados para dados reais (tipados, sem hardcode de strings no JSX)
- Responsividade completa: mobile (1 col → 2 col), tablet, desktop
- Navegação funcional: logo → `/`, "Entrar" → `/login`, "Criar conta" → `/cadastro`

**Non-Goals:**
- Integração com API ou banco de dados (dados mockados por enquanto)
- Funcionalidade de busca (campo renderizado, sem lógica de pesquisa)
- Autenticação no navbar (estado de usuário logado)
- Carrinho funcional (badge estático)
- Paginação ou carregamento infinito de produtos

## Decisions

### 1. Tema: dark (zinc-900/800) em vez de light

**Decisão:** Manter dark theme (#18181b / zinc-900 como fundo da página, zinc-800 para cards).

**Alternativa descartada:** Usar light theme (bg-white / bg-zinc-100) como no mockup original.

**Rationale:** Login e cadastro são dark. Mudar o tema na home criaria dissonância visual ao navegar entre as telas. As cores de destaque (#FFE600 e #2D3277) funcionam igualmente bem em dark.

---

### 2. Substituição das CSS vars do mockup por tokens Tailwind

| CSS var do mockup | Token Tailwind |
|---|---|
| `var(--color-background-secondary)` | `bg-zinc-900` |
| `var(--color-background-primary)` | `bg-zinc-800` |
| `var(--color-border-tertiary)` | `border-zinc-700` |
| `var(--color-text-primary)` | `text-white` |
| `var(--color-text-secondary)` | `text-zinc-300` |
| `var(--color-text-tertiary)` | `text-zinc-500` |

---

### 3. Estrutura de diretórios: Route Group `(home)`

**Decisão:** Componentes em `src/app/(home)/_components/` e dados em `src/app/(home)/_data/`.

**Rationale:** O Route Group `(home)` não afeta a URL (`/`), mantém os componentes colocalizados com a page e segue o padrão `_components/` já usado em `/login` e `/cadastro`.

---

### 4. Tipos de domínio em `src/domain/catalog/`

**Decisão:** `Product`, `Department`, `PromoCard` em `src/domain/catalog/types.ts`.

**Rationale:** Mesma convenção de `src/domain/auth/types.ts`. Separa o contrato de dados da implementação de UI. Quando dados reais chegarem, apenas o data layer muda.

---

### 5. `ProductCard` como Server Component

**Decisão:** `ProductCard` é um Server Component puro (sem estado, sem eventos).

**Rationale:** Produto é dado estático para leitura. Interatividade futura (adicionar ao carrinho) será tratada com um wrapper Client Component separado — não polui o componente de apresentação.

---

### 6. Layout da Navbar em mobile

**Decisão:** Mobile — logo + ações empilhados em coluna; search bar ocupa linha completa. Desktop — logo + search + ações em linha.

**Rationale:** O mockup foi desenhado só para desktop. A busca é a ação principal em mobile; deve ter máxima largura disponível.

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Mock data desatualizada em relação à API real | Tipos definidos em `domain/catalog/types.ts`; dados mockados em arquivo separado — troca pontual quando API chegar |
| Dark theme na home pode conflitar com futura landing pública (SEO/marketing) | Documentar decisão; theme switcher pode ser adicionado depois sem reescrever componentes |
| Grids responsivos com 6 e 4 colunas podem quebrar em telas intermediárias | Breakpoints explícitos: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` e `grid-cols-2 lg:grid-cols-4` |
