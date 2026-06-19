## 1. Tipos de Domínio e Dados Mockados

- [ ] 1.1 Criar `src/domain/catalog/types.ts` com os tipos `Product`, `Department` e `PromoCard`
- [ ] 1.2 Criar `src/app/(home)/_data/mock-products.ts` com 4 produtos mockados para "Mais Vendidos"
- [ ] 1.3 Criar `src/app/(home)/_data/mock-recommended.ts` com 4 produtos mockados para "Recomendados"
- [ ] 1.4 Criar `src/app/(home)/_data/mock-departments.ts` com 6 departamentos mockados (nome + ícone Tabler)

## 2. Componente ProductCard

- [ ] 2.1 Criar `src/app/(home)/_components/product-card.tsx` como Server Component recebendo `Product`
- [ ] 2.2 Implementar imagem placeholder com ícone Tabler (`ti ti-*`) centralizado
- [ ] 2.3 Implementar badge opcional (OFERTA: fundo #FFE600 / NOVO: fundo verde claro `bg-emerald-950 text-emerald-300`)
- [ ] 2.4 Implementar título com `line-clamp-2`
- [ ] 2.5 Implementar preço formatado com centavos em `<sup className="text-xs">`
- [ ] 2.6 Implementar linha de parcelamento, frete grátis e rating

## 3. Componentes de Layout da Home

- [ ] 3.1 Criar `src/app/(home)/_components/navbar.tsx` com logo (link `/`), search bar e nav actions (Entrar → `/login`)
- [ ] 3.2 Implementar Navbar responsiva: linha única desktop, empilhada mobile (search bar full-width na segunda linha)
- [ ] 3.3 Criar `src/app/(home)/_components/subnav.tsx` com links de categoria e `overflow-x-auto` para scroll horizontal
- [ ] 3.4 Criar `src/app/(home)/_components/hero-banner.tsx` com badge de campanha, título, CTA e 3 stat cards
- [ ] 3.5 Implementar HeroBanner responsivo: lado a lado no desktop, empilhado no mobile

## 4. Seções de Conteúdo

- [ ] 4.1 Criar `src/app/(home)/_components/section-header.tsx` com título e link "Ver todos/mais"
- [ ] 4.2 Criar `src/app/(home)/_components/departments-grid.tsx` com grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`
- [ ] 4.3 Criar `src/app/(home)/_components/products-section.tsx` recebendo título, link e array de `Product[]`
- [ ] 4.4 Implementar grid de produtos: `grid-cols-2 lg:grid-cols-4`
- [ ] 4.5 Criar `src/app/(home)/_components/promo-row.tsx` com card amarelo (Mercado Pago) e card azul (Entrega Full)
- [ ] 4.6 Implementar PromoRow responsiva: lado a lado no desktop, empilhada no mobile (`grid-cols-1 sm:grid-cols-2`)

## 5. Footer e Page

- [ ] 5.1 Criar `src/app/(home)/_components/home-footer.tsx` com copyright e links institucionais
- [ ] 5.2 Substituir `src/app/page.tsx` pela home completa, compondo todos os componentes em sequência: Navbar → Subnav → body (HeroBanner, Departamentos, MaisVendidos, PromoRow, Recomendados) → Footer
- [ ] 5.3 Garantir que `page.tsx` não usa `"use client"` e todos os sub-componentes são Server Components
