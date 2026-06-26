## Why

A home page (`/`) do portal consome dados exclusivamente de mocks locais, desconectada do backend real. Para que o catálogo exiba produtos e departamentos reais — e evolua com o inventário da plataforma — é necessário criar endpoints públicos no backend e conectá-los ao frontend via camada de serviço.

## What Changes

- **Backend**: novo módulo `CatalogModule` no NestJS com dois endpoints públicos (`GET /catalog/products` e `GET /catalog/departments`) que agregam dados de `Product`, `ProductVariation`, `CategoryProduct` e `ReviewProduct` em uma view desnormalizada pronta para consumo pelo frontend
- **Frontend**: substituição dos mocks por chamadas reais à API via novo `catalog.service.ts`; correção da variável de ambiente `NEXT_PUBLIC_API_URL` para apontar ao backend (`http://localhost:3001`)
- **Tipos de domínio**: alinhamento dos tipos `Product` e `Department` do frontend com a response shape do backend

## Capabilities

### New Capabilities

- `catalog-products-api`: Endpoint público `GET /catalog/products` que retorna lista paginada de produtos com preço, rating, installments e badge, suportando filtros `category=bestsellers|recommended`, `limit` e `skip`
- `catalog-departments-api`: Endpoint público `GET /catalog/departments` que retorna lista de departamentos com ícone Tabler mapeado a partir do nome da categoria
- `home-page-catalog-integration`: Integração da home page com os endpoints reais; substituição dos mocks; criação de `catalog.service.ts` no frontend

### Modified Capabilities

<!-- Nenhuma especificação existente tem seus requisitos alterados. -->

## Impact

- **Backend** (`Mercado-SemiLivre.api`): novos arquivos em `src/modules/catalog/` e `src/infra/http/modules/catalog/`; `AppModule` recebe `CatalogModule`
- **Frontend** (`Portal.Mercado-SemiLivre`): novo `src/services/catalog.service.ts`; `src/app/page.tsx` usa serviço em vez de imports de mock; `.env.local` corrigido
- **Dependências**: nenhuma nova dependência — Prisma e fetch nativo já estão disponíveis
- **APIs públicas**: `GET /catalog/products` e `GET /catalog/departments` não requerem autenticação (JWT opcional não imposto)
