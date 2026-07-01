## 1. Backend - Database Setup

- [x] 1.1 Criar migration de banco de dados para tabela `user_favorites`
- [x] 1.2 Adicionar índices em user_id e product_id para performance
- [x] 1.3 Configurar foreign keys com ON DELETE CASCADE
- [ ] 1.4 Testar migration em ambiente local (criação e rollback)

## 2. Backend - API Endpoints

- [x] 2.1 Criar rota POST `/api/favorites` para adicionar favorito
- [x] 2.2 Implementar validação de autenticação (middleware JWT/session)
- [x] 2.3 Implementar validação de productId (deve existir)
- [x] 2.4 Implementar constraint UNIQUE (user_id, product_id) - retornar 409 se duplicado
- [x] 2.5 Criar rota DELETE `/api/favorites/:id` para remover favorito
- [x] 2.6 Implementar verificação de propriedade (usuário só remove seus favoritos)
- [x] 2.7 Criar rota GET `/api/favorites` com paginação (query params: page, limit)
- [x] 2.8 Retornar dados completos do produto (id, name, imageUrl, price, rating, etc)
- [x] 2.9 Implementar tratamento de erros (400, 401, 403, 404, 409)
- [ ] 2.10 Criar testes para todos endpoints (sucesso, validação, autenticação)

## 3. Frontend - Service Layer

- [x] 3.1 Criar arquivo `src/services/favorites.service.ts`
- [x] 3.2 Implementar método `addFavorite(productId: number)`
- [x] 3.3 Implementar método `removeFavorite(favoriteId: number)`
- [x] 3.4 Implementar método `getFavorites(page?: number, limit?: number)`
- [x] 3.5 Implementar método `isFavorite(productId: number): boolean`
- [x] 3.6 Implementar método `syncFavoritesFromServer()` para carregamento inicial
- [x] 3.7 Adicionar tratamento de erros com try-catch e logging
- [x] 3.8 Adicionar otimismo em addFavorite/removeFavorite (update local primeiro)
- [ ] 3.9 Criar testes unitários para service

## 4. Frontend - Favorite Button Component

- [x] 4.1 Criar componente `src/app/(home)/_components/favorite-button.tsx` (Client Component)
- [x] 4.2 Aceitar props: productId, size (sm|md|lg), className opcional
- [x] 4.3 Exibir ícone de coração (usar biblioteca de ícones do projeto)
- [x] 4.4 Visual diferente para favorito vs não-favorito (filled vs outline)
- [x] 4.5 Implementar click handler para adicionar/remover favorito
- [x] 4.6 Mostrar loading state enquanto requisição está pendente
- [ ] 4.7 Mostrar toast de sucesso/erro após ação
- [x] 4.8 Redirecionar para login se usuário não autenticado
- [x] 4.9 Sincronizar estado com favoritos.service
- [ ] 4.10 Testar component em diferentes estados

## 5. Frontend - Integração em Página de Detalhes

- [x] 5.1 Importar `<FavoriteButton>` em `src/app/(home)/produto/[id]/_components/price-box.tsx`
- [x] 5.2 Adicionar botão de favorito no price-box (ao lado do preço ou em destaque)
- [x] 5.3 Sincronizar estado do botão com service ao carregar página
- [ ] 5.4 Testar visual e interação na página de produto real

## 6. Frontend - Integração em Cards de Produtos

- [x] 6.1 Identificar componente de card de produto usado em buscas/categorias
- [x] 6.2 Adicionar ícone de coração no canto superior direito do card
- [x] 6.3 Implementar click no ícone para favoritar sem navegar
- [x] 6.4 Sincronizar estado do ícone com service
- [ ] 6.5 Testar em página de categoria e busca
- [ ] 6.6 Garantir que state se sincroniza ao navegar entre páginas

## 7. Frontend - Página de Favoritos

- [x] 7.1 Criar arquivo `src/app/(home)/favoritos/page.tsx` (Server Component)
- [x] 7.2 Implementar proteção: redirecionar se não autenticado
- [x] 7.3 Buscar favoritos do usuário via service
- [x] 7.4 Exibir grid responsivo de produtos (4/2/1 colunas)
- [x] 7.5 Cada card exibe: imagem, nome, preço, rating, botão remover
- [x] 7.6 Implementar estado vazio: "Nenhum favorito" + CTA para explorar
- [ ] 7.7 Adicionar seletor de ordenação (data, preço menor, preço maior)
- [ ] 7.8 Implementar paginação (mostrar 20 produtos por página)
- [x] 7.9 Ao remover, card desaparece com animação suave
- [x] 7.10 Clicar em card navega para `/produto/[id]`
- [x] 7.11 Adicionar meta tags (SEO) apropriadas
- [ ] 7.12 Testar responsividade em mobile/tablet/desktop

## 8. Frontend - Integração de Navegação

- [x] 8.1 Adicionar link "Meus Favoritos" na navbar/menu
- [ ] 8.2 Adicionar badge com contagem de favoritos (opcional)
- [ ] 8.3 Atualizar badge em tempo real ao adicionar/remover favorito
- [ ] 8.4 Testar navegação para página de favoritos

## 9. Quality Assurance

- [ ] 9.1 Testar adição de favorito na página de detalhes
- [ ] 9.2 Testar remoção de favorito da página de favoritos
- [ ] 9.3 Testar remoção de favorito da página de detalhes
- [ ] 9.4 Verificar sincronização de state entre múltiplas páginas abertas
- [ ] 9.5 Testar favoritar de cards em busca/categoria
- [ ] 9.6 Testar página de favoritos vazia
- [ ] 9.7 Testar paginação com muitos favoritos
- [ ] 9.8 Testar ordenação (data, preço)
- [ ] 9.9 Testar redireciono para login se não autenticado
- [ ] 9.10 Testar tratamento de erros (API offline, product não existe, etc)
- [ ] 9.11 Verificar performance com 100+ favoritos
- [ ] 9.12 Cross-browser testing (Chrome, Firefox, Safari, Edge)

## 10. Polish & Docs

- [ ] 10.1 Revisar código para seguir padrões do projeto (Clean Code, Prettier)
- [ ] 10.2 Adicionar comentários onde necessário (lógica não óbvia)
- [ ] 10.3 Atualizar documentação interna (README ou CLAUDE.md se aplicável)
- [ ] 10.4 Criar exemplos de uso da favorites.service
- [ ] 10.5 Commit final e preparar para merge
