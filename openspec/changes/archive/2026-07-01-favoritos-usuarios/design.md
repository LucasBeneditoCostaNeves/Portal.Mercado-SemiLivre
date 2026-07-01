## Context

O projeto é um portal de e-commerce (Portal.Mercado-SemiLivre) com frontend Next.js (App Router) e backend API. Usuários estão autenticados no sistema. Precisamos adicionar persistência de produtos favoritados sem impactar performance ou estrutura existente. Será necessário:
- Extensão do schema de banco de dados
- Novos endpoints API
- Componentes React/Next.js para UI
- Service para gerenciar estado de favoritos

## Goals / Non-Goals

**Goals:**
- Permitir usuários autenticados adicionar/remover produtos favoritos
- Fornecer página dedicada para visualização de favoritos
- Integrar UI de favoritos em páginas de produtos
- Persistir favoritos durável e sincronizado

**Non-Goals:**
- Compartilhamento de favoritos entre usuários
- Listas de favoritos nomeadas (apenas uma lista única por usuário)
- Sincronização em tempo real entre abas/dispositivos
- Sistema de recomendação baseado em favoritos (futura feature)

## Decisions

### 1. Tabela de Banco de Dados

**Decision**: Criar tabela `user_favorites` com relacionamento many-to-many simples

**Rationale**:
- Mantém separação de preocupações (users e products independentes)
- Permite queries eficientes com índices
- Suporta futuros features (analytics, recomendações)

**Schema**:
```sql
CREATE TABLE user_favorites (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id)
);
```

**Alternatives considered**:
- Array/JSON column no usuário: Seria mais simples mas causaria N+1 queries e difícil de indexar
- Redis cache: Adequado para leitura, mas adiciona complexidade de sincronização

### 2. Endpoints API

**Decision**: Criar endpoints RESTful simples sem versioning

**Design**:
- `POST /api/favorites` → Adicionar favorito
- `DELETE /api/favorites/:id` → Remover favorito
- `GET /api/favorites` → Listar favoritos com paginação

**Rationale**:
- Segue padrão REST
- Sem versioning reduz complexidade (project é v1)
- Paginação previne overhead em usuários com muitos favoritos

**Autenticação**: Todos endpoints requerem token JWT/session válida

**Alternatives considered**:
- GraphQL: Overkill para essas operações simples
- Server Actions: Viável, mas endpoint separado é mais testável

### 3. Sincronização Frontend

**Decision**: Estado otimista com rollback em caso de erro

**Rationale**:
- UX responsiva (feedback imediato ao usuário)
- Rede falha gracefully (rollback visual)
- Reduz requisições necessárias

**Flow**:
1. Usuário clica favoritar → update imediato no estado local
2. Chamada async para API em background
3. Se sucesso → nada (já estava atualizado)
4. Se erro → rollback visual + toast de erro

**Service Structure**:
```typescript
// src/services/favorites.service.ts
- addFavorite(productId)
- removeFavorite(favoriteId)
- getFavorites(page?, limit?)
- isFavorite(productId)
- syncFavoritesFromServer() // no mount
```

**Alternatives considered**:
- Loading states em cada ação: Mais pesado
- Sync 100% servidor: Lag perceptível ao usuário

### 4. Página de Favoritos

**Decision**: Server Component com Client Component para interações

**Rationale**:
- Server Component fetch favoritos (revalidate em background)
- Client Component gerencia remover/ordenar
- Reduz JavaScript enviado

**Rota**: `/app/(home)/favoritos/page.tsx`

**Layout**:
- Grid responsivo de cards (4/2/1 colunas)
- Sem favoritos → CTA para explorar catálogo
- Ordenação por: data adicionada, preço
- Botão remover em cada card

**Alternatives considered**:
- Full SPA (React Query): Mais interativo mas mais JS no cliente
- SSG com revalidate: Não vale pena para dados por usuário

### 5. Integração de UI

**Decision**: Componente reutilizável `<FavoriteButton>` para ícone de favorito

**Rationale**:
- DRY: Usar em cards, page details, navbar
- Centraliza lógica de favoritar
- Consistência visual

**Componente**:
```typescript
<FavoriteButton productId={id} size="sm|md|lg" />
```

**Alternatives considered**:
- Inline logic: Duplicação de código
- Prop drilling: Pior que componente encapsulado

### 6. Banco de Dados - Backend API

**Framework**: Presumo Express/Node.js baseado em `Mercado-SemiLivre.api`

**Middleware de autenticação**: Verificar JWT/session em todos endpoints de favoritos

**Tratamento de erros**:
- 400: Validação (productId inválido)
- 401: Sem autenticação
- 403: Acesso negado (favorito de outro usuário)
- 404: Recurso não encontrado
- 409: Produto já é favorito

## Risks / Trade-offs

**[Risk] → Mitigation**

- **Performance**: Query de favoritos cresce com número de produtos favoritados
  - → Usar índices (user_id), paginação obrigatória, cache em Redis se escalar

- **Cascata de deletes**: Se product for deletado, favoritos órfãos
  - → Usar `ON DELETE CASCADE`, monitorar dados órfãos

- **Sincronização otimista falha**: Usuário vê favorito adicionado mas API falha
  - → Toast de erro + rollback, retry automático (opcional)

- **Sobrecarga de API**: Muitas requisições favoritar simultâneas
  - → Rate limiting em endpoints de favoritos, debounce no frontend

## Migration Plan

**Phase 1**: Backend (database + API)
1. Criar migration com tabela `user_favorites`
2. Criar endpoints `/api/favorites` (POST, DELETE, GET)
3. Testes de integração

**Phase 2**: Frontend
1. Criar `favorites.service.ts`
2. Criar `<FavoriteButton>` component
3. Integrar em `produto/[id]/_components/price-box.tsx` (e outros)

**Phase 3**: Página de Favoritos
1. Criar rota `/favoritos`
2. Layout com grid de produtos
3. Ordenação e filtros

**Rollback Strategy**:
- Desabilitar endpoints (return 503)
- Ocultar UI de favoritos (feature flag)
- Manter dados em BD (recnão há risco)

## Open Questions

1. **Confirmação visual**: Toast notification ou inline update é suficiente?
2. **Analytics**: Coletar dados de favoritos mais salvos para recomendações futuras?
3. **Limite de favoritos**: Máximo por usuário ou sem limite?
4. **Sincronização cross-device**: Será necessário no futuro?
