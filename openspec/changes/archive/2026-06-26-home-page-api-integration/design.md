## Context

A home page do portal exibe três seções de dados dinâmicos: **Departments** (grade de categorias), **Mais vendidos** (produtos mais bem avaliados), e **Recomendados para você** (recomendações personalizadas, no MVP idênticas aos mais vendidos). Hoje essas seções consomem mocks locais em `src/app/(home)/_data/`. O backend NestJS expõe produtos e categorias via `GET /product` e `GET /categoryProduct`, mas ambas as rotas exigem autenticação JWT e retornam modelos de entidade crus — incompatíveis com o shape que o frontend espera (`title`, `price`, `installments`, `freeShipping`, `rating`, `reviewCount`, `icon`, `badge`).

Dois projetos estão envolvidos:
- **Mercado-SemiLivre.api** (NestJS 11, Prisma, PostgreSQL, porta 3001)
- **Portal.Mercado-SemiLivre** (Next.js 15, App Router, Server Components, porta 3000)

## Goals / Non-Goals

**Goals:**
- Criar endpoints públicos no backend que exponham dados do catálogo no shape esperado pelo frontend
- Substituir todos os mocks da home page por chamadas reais à API
- Manter os componentes UI existentes sem alteração (apenas a fonte dos dados muda)
- Zero dependências novas em ambos os projetos

**Non-Goals:**
- Recomendações personalizadas por usuário (MVP usa mesma lógica que bestsellers)
- Busca ou filtragem por texto livre (pertence a uma mudança futura)
- Paginação infinita ou cursor-based (limit/skip simples é suficiente para o MVP)
- Cache distribuído (Redis, etc.) — Next.js `fetch` cache é suficiente inicialmente
- Autenticação opcional no endpoint de catálogo (JWT não é imposto, nem lido)

## Decisions

### D1 — Novo módulo `CatalogModule` no backend, sem alterar rotas existentes

**Decisão:** Criar módulo isolado `catalog` com seus próprios controller, use cases e repository. Não modificar `GET /product` nem `GET /categoryProduct` existentes.

**Alternativa considerada:** Tornar as rotas existentes públicas com `@Public()`. Rejeitada porque (a) as rotas existentes retornam entidades cruas sem os campos calculados que o frontend precisa, e (b) mudar o contrato de rotas internas quebraria outros consumidores existentes ou futuros.

**Rationale:** Isolamento total entre catálogo público e gestão privada de produtos. O `CatalogModule` é read-only e público por design.

---

### D2 — View desnormalizada: `CatalogProduct` montada no use case, não no Prisma

**Decisão:** O use case `ListCatalogProductsUseCase` faz uma query Prisma com `include` de `variations` e `reviews`, e monta o `CatalogProduct` em memória.

**Alternativa considerada:** View materializada no PostgreSQL. Rejeitada pela complexidade operacional desnecessária no MVP.

**Rationale:** Simples de implementar, testar e evoluir. Com `limit=4` por seção, o custo de computação em memória é desprezível.

**Shape de `CatalogProduct`:**
```typescript
{
  id: string           // product.id
  title: string        // product.name
  price: number        // variation mais barata ativa
  installments: string // calculado: "12x R$ X,XX sem juros" se price >= 120
  freeShipping: boolean // true se price >= 100 (regra de negócio MVP)
  rating: number       // média de ReviewProduct.rating da variation, 0 se sem reviews
  reviewCount: number  // total de ReviewProduct da variation
  icon: string         // mapeado de CategoryProduct.name → ícone Tabler
  badge?: "OFERTA" | "NOVO" // "OFERTA" se desconto >= 10%, "NOVO" se criado nos últimos 7 dias
}
```

---

### D3 — Mapeamento `CategoryProduct.name → ícone Tabler` fixo no backend

**Decisão:** Um mapa estático `CATEGORY_ICON_MAP` no backend converte nomes de categoria em classes Tabler (`ti-device-mobile`, etc.). Se o nome não constar no mapa, usa `ti-package` como fallback.

**Alternativa considerada:** Adicionar coluna `icon` ao modelo `CategoryProduct` no Prisma. Rejeitada por requerer migration e semear dados manualmente — complexidade desnecessária no MVP.

**Rationale:** Mantém o schema existente intacto. Pode ser migrado para coluna de banco em iteração futura sem quebrar o contrato da API.

---

### D4 — `catalog.service.ts` no frontend chama a API com `fetch` nativo + cache Next.js

**Decisão:** Funções puras `getBestsellers(limit)`, `getRecommended(limit)`, `getDepartments()` usando `fetch` com `{ next: { revalidate: 60 } }` (revalidação de 1 minuto via ISR).

**Alternativa considerada:** `unstable_cache` do Next.js. Desnecessário aqui — `fetch` com `revalidate` já oferece cache ISR de forma nativa e mais simples.

**Rationale:** Alinhado com guidelines do projeto (fetch nativo, Server Components, sem libs extras). Cache de 60s é razoável para dados de catálogo que mudam pouco.

---

### D5 — Correção de `NEXT_PUBLIC_API_URL` em `.env.local`

**Decisão:** Alterar `NEXT_PUBLIC_API_URL=http://localhost:3000` para `NEXT_PUBLIC_API_URL=http://localhost:3001`.

**Rationale:** O valor atual aponta o frontend para si mesmo. O backend NestJS roda na porta 3001. Sem essa correção, nenhuma chamada à API funcionaria.

---

### D6 — `bestsellers` e `recommended` como filtros do mesmo endpoint

**Decisão:** `GET /catalog/products?category=bestsellers` e `?category=recommended` retornam ambos produtos ordenados por `reviewCount DESC`. No futuro, `recommended` pode receber lógica de personalização sem mudar o contrato.

**Rationale:** Simplifica a implementação do MVP sem comprometer a extensibilidade futura da URL.

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Banco vazio: sem produtos ou reviews, os endpoints retornam listas vazias e a UI fica em branco | Seed de catálogo via `POST /seed/catalog` antes de testar; componentes existentes já lidam com arrays vazios |
| `NEXT_PUBLIC_API_URL` exposta ao browser (prefixo `NEXT_PUBLIC_`) | Aceitável — a URL do backend é pública por design para endpoints de catálogo |
| Sem dados de variação (`ProductVariation`), `CatalogProduct.price` é `0` | O seed de catálogo deve incluir ao menos uma variation ativa por produto |
| Cache de 60s pode mostrar dados desatualizados após edição de produto no admin | Aceitável para MVP; revalidação por tag pode ser adicionada quando houver painel admin |

## Open Questions

- **Seed de catálogo**: o banco de desenvolvimento está populado? Se não, um task de seed deve ser executado antes de validar a integração. (Responsabilidade: Lucas ao iniciar implementação)
- **`freeShipping` threshold**: R$ 100 é uma regra de negócio razoável para o MVP, mas pode ser configurável. Deixar como constante nomeada no use case para facilitar mudança futura.
