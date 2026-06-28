## Why

Usuários precisam salvar produtos de interesse para acesso futuro, aumentando engajamento e conversão. A funcionalidade de favoritos é um diferencial na experiência de compra que melhora retenção e permite personalização.

## What Changes

- Adicionar sistema de favoritos vinculado à conta do usuário autenticado
- Criar tabela `user_favorites` no backend para persistência de dados
- Implementar API endpoints para adicionar/remover/listar favoritos
- Criar página dedicada de favoritos com visualização e gerenciamento dos produtos salvos
- Adicionar ícone/botão de favoritar na página de detalhes do produto e em cards de produtos
- Sincronizar estado de favoritos entre componentes e página de favoritos

## Capabilities

### New Capabilities
- `user-favorites`: Sistema de gerenciamento de favoritos do usuário (adicionar, remover, listar, persistência no banco)
- `favorites-page`: Página de visualização e gerenciamento de produtos favoritados pelo usuário
- `favorites-ui-integration`: Componentes de UI (botão de favorito, indicador visual) integrados em páginas de produto

### Modified Capabilities
<!-- Nenhuma capacidade existente tem requisitos mudando - esta é uma nova feature -->

## Impact

**Backend**:
- Nova tabela `user_favorites` (userId, productId, createdAt)
- Novos endpoints API: `POST /api/favorites`, `DELETE /api/favorites/:id`, `GET /api/favorites`
- Autenticação e autorização necessárias para endpoints

**Frontend**:
- Nova rota `/favoritos` (página de favoritos)
- Adição de componentes favoritar em `produto/[id]` e cards de produtos
- Estado gerenciado via service (`favorites.service.ts`)
- Sincronização com backend

**Banco de Dados**:
- Nova tabela `user_favorites` com foreign keys para users e products
- Índices para performance em queries de favoritos por usuário
