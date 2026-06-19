## Why

O portal ainda não possui uma tela de entrada para usuários não autenticados — a `page.tsx` está em branco. Sem uma home, não há ponto de descoberta de produtos, navegação por categorias nem exposição das promoções do marketplace, tornando o fluxo completo (descoberta → login → compra) impossível de validar.

## What Changes

- Substituição de `src/app/page.tsx` por uma home completa do marketplace
- Nova `Navbar` com logo, busca e ações de usuário (entrar, pedidos, carrinho)
- Nova `Subnav` com categorias de navegação rápida em scroll horizontal
- Novo `HeroBanner` com campanha ativa e estatísticas do marketplace
- Nova seção `DepartamentosGrid` com 6 categorias em grid responsivo
- Novo `ProductCard` reutilizável (preparado para dados reais futuros)
- Seção `MaisVendidos` com 4 product cards mockados
- Seção `PromoRow` com dois cards promocionais (Mercado Pago + Entrega Full)
- Seção `Recomendados` com 4 product cards mockados
- Novo `HomeFooter` com copyright e links institucionais
- Dados mockados tipados em `src/app/(home)/_data/mock-products.ts`
- Tipos de domínio em `src/domain/catalog/types.ts` (Product, Department, PromoCard)

## Capabilities

### New Capabilities

- `home-page`: Página principal do marketplace — navbar, subnav, hero banner, grid de departamentos, seções de produtos com cards reutilizáveis, faixa promocional e footer.
- `product-card`: Componente de card de produto reutilizável com suporte a badge (OFERTA/NOVO), preço, parcelamento, frete grátis e rating.

### Modified Capabilities

_(nenhuma — nenhuma spec existente tem seus requisitos alterados)_

## Impact

- **`src/app/page.tsx`**: substituída integralmente
- **`src/app/(home)/_components/`**: diretório novo com todos os componentes da home
- **`src/app/(home)/_data/`**: dados mockados tipados
- **`src/domain/catalog/types.ts`**: novos tipos de domínio (Product, Department, PromoCard)
- **`src/components/ui/`**: possível adição de `product-card.tsx` se for componente compartilhado
- **Sem breaking changes em rotas existentes** (`/login`, `/cadastro` não são afetados)
- **Sem novas dependências externas** — Tabler Icons já está no projeto via classes CSS
