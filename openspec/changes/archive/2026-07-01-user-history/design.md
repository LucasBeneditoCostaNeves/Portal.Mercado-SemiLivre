## Context

O portal não possui nenhum mecanismo de rastreamento de comportamento do usuário. A sessão é gerenciada via cookie HTTP-only `session` com JWT, disponível server-side via `getSession()` (`src/lib/session.ts`). O backend (`Mercado-SemiLivre.api`) é a fonte de verdade para dados persistidos. Usuários não autenticados não têm histórico.

## Goals / Non-Goals

**Goals:**
- Registrar buscas realizadas por usuários autenticados (termo + timestamp)
- Registrar cliques em produtos por usuários autenticados (product_id + página de origem + timestamp)
- Exibir até 5 buscas recentes no dropdown do `SearchBar` ao focar no input
- Prover rotas REST no backend para POST (registro) e GET (consulta) de histórico

**Non-Goals:**
- Histórico para usuários não autenticados (sem sessão)
- Analytics ou agregação de dados (relatórios, dashboards)
- Recomendações baseadas em histórico (escopo futuro)
- Exclusão de itens individuais do histórico pelo usuário (v1 não precisa)

## Decisions

### D1: Banco de dados — tabelas separadas por tipo de evento

Criar duas tabelas independentes: `user_search_history` e `user_product_clicks`.

**Alternativa considerada:** tabela genérica `user_events` com campo `event_type` e payload JSON.

**Rationale:** Tabelas separadas permitem queries tipadas e índices eficientes por caso de uso. A tabela genérica ganha quando há muitos tipos de evento — neste caso são apenas dois, e os campos diferem significativamente entre eles.

```sql
-- user_search_history
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
term        VARCHAR(255) NOT NULL
searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

-- Índice para busca por usuário ordenado por data
INDEX idx_user_search_history_user_date (user_id, searched_at DESC)

-- user_product_clicks
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
product_id  VARCHAR(255) NOT NULL
source_page VARCHAR(100) NOT NULL  -- 'home', 'search', 'category', 'product'
clicked_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()

INDEX idx_user_product_clicks_user_date (user_id, clicked_at DESC)
```

### D2: Rotas REST no backend

Três endpoints:

| Método | Rota                      | Descrição                                 |
|--------|---------------------------|-------------------------------------------|
| POST   | `/history/search`         | Registra um termo de busca                |
| POST   | `/history/product-click`  | Registra clique em produto                |
| GET    | `/history/searches`       | Retorna últimas N buscas do usuário       |

Todas exigem Bearer token (JWT do cookie `session`) no header `Authorization`.

**Rationale:** API REST simples, consistente com o padrão já usado no backend. Server Actions do Next.js chamam esses endpoints via `fetch` com o token extraído de `getSession()`.

### D3: Fire-and-forget no frontend

Os eventos de busca e clique são enviados via `fetch` sem `await` no caminho crítico — o usuário não espera pela resposta.

```ts
// Exemplo: não bloqueia a navegação
void fetch('/api/history/search', { method: 'POST', body: ... })
```

**Rationale:** Registrar histórico é secundário à ação do usuário. Falhas silenciosas são aceitáveis; latência de rede não deve degradar a UX.

### D4: Deduplicação de buscas — janela de 1 minuto

Se o mesmo usuário buscar o mesmo termo dentro de 1 minuto, o backend ignora o registro duplicado (upsert via `ON CONFLICT DO NOTHING` ou verificação temporal).

**Rationale:** Infinite scroll e re-renders podem disparar o evento múltiplas vezes para o mesmo termo em rápida sucessão.

### D5: Limite de histórico retornado

`GET /history/searches` retorna no máximo 10 itens; o `SearchBar` exibe no máximo 5. O backend não faz paginação.

### D6: Envio do token via Server Action intermediária

O front não envia o JWT diretamente do client — usa uma Server Action que lê `getSession()` e chama o backend com o token.

**Rationale:** O cookie `session` é HTTP-only, inacessível ao JavaScript do browser. A Server Action acessa o token server-side antes de chamar a API externa.

## Risks / Trade-offs

- **Drift de histórico por duplicatas**: termos repetidos em bursts enchem o histórico sem janela de deduplicação adequada → Mitigação: janela de 1 minuto no backend (D4)
- **Vazamento de token**: se alguma rota de histórico for exposta sem autenticação, expõe dados de comportamento do usuário → Mitigação: guard de autenticação obrigatório em todas as rotas `/history/*`
- **Volume de writes**: em alto tráfego, cada busca/clique gera um INSERT → Mitigação: índices adequados; se escalar, considerar batch writes ou queue assíncrona no futuro

## Open Questions

- O backend deve retornar distinct terms no GET (remover duplicatas do mesmo termo em datas diferentes) ou retornar todos os registros cronológicos? → Recomendação: DISTINCT ON term com a data mais recente
- Há um campo `user_id` acessível via JWT decode no backend? → Confirmar com o backend existente antes de implementar
