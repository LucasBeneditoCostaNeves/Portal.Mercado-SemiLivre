## 1. Backend — Estrutura do CatalogModule

- [x] 1.1 Criar tipo TypeScript `CatalogProduct` em `src/modules/catalog/types/CatalogProduct.ts` com os campos: `id`, `title`, `price`, `installments`, `freeShipping`, `rating`, `reviewCount`, `icon`, `badge?` — **não é modelo Prisma, não cria tabela**
- [x] 1.2 Criar `CATEGORY_ICON_MAP` em `src/modules/catalog/constants/category-icon-map.ts` mapeando nomes de `CategoryProducts.name` para classes Tabler (fallback: `"ti-package"`)
- [x] 1.3 Criar interface `ICatalogRepository` em `src/modules/catalog/repositories/ICatalogRepository.ts` com métodos `findProducts(params: { limit: number; skip: number })` e `findDepartments()`
- [x] 1.4 Criar `PrismaCatalogRepository` em `src/infra/database/prisma/repositories/PrismaCatalogRepository.ts` implementando `ICatalogRepository`

## 2. Backend — Use Cases

- [x] 2.1 Criar `ListCatalogProductsUseCase` em `src/modules/catalog/useCases/listCatalogProducts/ListCatalogProductsUseCase.ts`
- [x] 2.2 Criar `ListCatalogDepartmentsUseCase` em `src/modules/catalog/useCases/listCatalogDepartments/ListCatalogDepartmentsUseCase.ts`

## 3. Backend — Controller e Módulo NestJS

- [x] 3.1 Criar DTO `ListCatalogProductsQueryDto` em `src/infra/http/modules/catalog/dto/catalog.dto.ts` com Zod: `category?: "bestsellers" | "recommended"`, `limit?: number` (default 4), `skip?: number` (default 0)
- [x] 3.2 Criar `CatalogController` em `src/infra/http/modules/catalog/catalog.controller.ts`
- [x] 3.3 Criar `CatalogModule` em `src/infra/http/modules/catalog/catalog.module.ts` com `CatalogController`, os dois use cases e `PrismaCatalogRepository` como providers
- [x] 3.4 Importar `CatalogModule` no `AppModule` em `src/app.module.ts`

## 4. Backend — Validação Manual

- [ ] 4.1 Confirmar que o banco tem ao menos 1 produto com variação ativa e review (usar seed ou inserir manualmente); se não houver, rodar `POST /seed/catalog`
- [ ] 4.2 Testar `GET /catalog/products?category=bestsellers&limit=4` sem token → deve retornar 200 com `{ items, total }`
- [ ] 4.3 Testar `GET /catalog/departments` sem token → deve retornar 200 com `{ items }`

## 5. Frontend — Configuração de Ambiente

- [x] 5.1 Atualizar `.env.local` em `Portal.Mercado-SemiLivre`: `NEXT_PUBLIC_API_URL=http://localhost:3001`

## 6. Frontend — Serviço de Catálogo

- [x] 6.1 Criar `src/services/catalog.service.ts` com três funções usando `fetch` nativo + `{ next: { revalidate: 60 } }`

## 7. Frontend — Integração na Home Page

- [x] 7.1 Atualizar `src/app/page.tsx`: remover imports de `mockProducts`, `mockRecommended`, `mockDepartments`

## 8. Frontend — Validação

- [ ] 8.1 Acessar `http://localhost:3000/` com ambos os servidores rodando e confirmar dados reais nas três seções dinâmicas
- [ ] 8.2 Rodar `npx tsc --noEmit` no portal — zero erros de TypeScript
- [ ] 8.3 Confirmar sem regressão visual nas seções que permanecem estáticas (HeroBanner, PromoRow, Subnav, Footer)
