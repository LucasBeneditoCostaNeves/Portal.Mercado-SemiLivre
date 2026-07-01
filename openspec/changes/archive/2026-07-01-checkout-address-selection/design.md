## Context

O portal possui um fluxo de carrinho funcional em `/carrinho` (spec: `cart-page`). O botão "Continuar" no `CartSummary` é um `<button type="button">` sem ação de navegação — ele ainda não encaminha o usuário para o próximo step. O projeto usa Next.js App Router com Route Groups; o grupo `(home)` agrupa as páginas autenticadas sob o mesmo layout de Navbar.

Não existe nenhum contexto global de checkout nem serviço de endereços implementado até o momento.

## Goals / Non-Goals

**Goals:**
- Criar a rota `/checkout/endereco` como Step 2 do fluxo de checkout
- Exibir os endereços cadastrados do usuário com opção de selecionar um para entrega
- Permitir adição de novo endereço via modal, sem sair do fluxo
- Conectar o botão "Continuar" do carrinho a essa nova rota
- Criar o serviço de endereços (`address.service.ts`) para buscar e criar endereços via API

**Non-Goals:**
- Implementação dos steps seguintes (pagamento, confirmação de pedido)
- Edição ou remoção de endereços existentes (escopo futuro)
- Cálculo de frete por endereço nessa tela (pertence ao step de pagamento ou ao carrinho)
- Autenticação ou proteção de rota (já tratado pelo padrão existente com `getSession`)

## Decisions

### 1. Rota: `/checkout/endereco` como Route Group separado

**Decisão:** Criar `src/app/checkout/endereco/` em um novo route group `(checkout)` separado do `(home)`.

**Rationale:** O layout do checkout é distinto da Navbar padrão — em checkouts multi-step, o header costuma ser simplificado (apenas logo + indicador de steps), sem menu de navegação completo. Separar o grupo evita herdar o layout de `(home)` e permite evoluir o layout de checkout independentemente.

**Alternativa descartada:** Colocar dentro de `(home)` para reutilizar o layout. Descartado porque contamina o layout de checkout com Navbar completa, e dificulta a adição de step indicator no futuro.

### 2. Indicador de steps: componente simples, sem biblioteca

**Decisão:** Criar um `CheckoutStepper` como Server Component estático que recebe o step atual como prop.

**Rationale:** O fluxo tem poucos steps previstos (carrinho → endereço → pagamento → confirmação). Uma biblioteca de stepper seria overhead desnecessário. O componente será evoluído conforme os steps forem implementados.

### 3. Estado do checkout: sem context global por ora

**Decisão:** Os itens selecionados no carrinho serão passados via `searchParams` (IDs dos itens) para a página de endereço. O endereço selecionado será armazenado em `searchParams` até a confirmação do pedido, ou em um cookie de sessão de checkout.

**Rationale:** Evita introduzir um context global de checkout antes de entender todo o fluxo. searchParams são stateless, compatíveis com Server Components, e permitem compartilhar/reabrir links de checkout. Cookie de curta duração pode ser adicionado para persistência entre reloads sem criar dependência de estado global.

**Alternativa descartada:** Zustand ou React Context global de checkout. Descartado por prematuridade — o fluxo completo ainda não está definido, e estado global introduz complexidade desnecessária agora.

### 4. Adição de novo endereço: modal client-side

**Decisão:** Formulário de novo endereço abre em um `<dialog>` gerenciado por um Client Component wrapper. O submit usa Server Action para chamar a API e revalidar a lista.

**Rationale:** Consistente com o padrão de Server Actions já usado em `actions.ts` do carrinho. O modal evita navegação fora do checkout. Revalidação via `revalidatePath` ou `revalidateTag` garante que a lista atualize sem reload manual.

### 5. Serviço de endereços: `address.service.ts`

**Decisão:** Criar `src/services/address.service.ts` seguindo o padrão dos serviços existentes (`cart.service.ts`, `favorites.service.ts`).

**Rationale:** Consistência arquitetural. A camada de serviço isola a lógica de fetch da API dos componentes e route handlers.

## Risks / Trade-offs

- **API de endereços não documentada** → A URL, shape do payload e autenticação do endpoint de endereços precisam ser confirmados com a API antes da implementação. O serviço será scaffolado com tipos TypeScript baseados no domínio esperado; ajustes de contrato são isolados em `address.service.ts`.
- **searchParams para estado de checkout** → Se o usuário navegar de volta ao carrinho e mudar a seleção sem atualizar os searchParams, haverá inconsistência. Mitigação: o botão "Continuar" do carrinho deve sempre gerar o link com os IDs atualizados da seleção.
- **Modal vs. sub-rota para novo endereço** → Modal é mais rápido de implementar, mas sub-rota (`/checkout/endereco/novo`) seria mais acessível e testável. A decisão atual favorece velocidade; migrar para sub-rota é possível sem quebrar a spec.
