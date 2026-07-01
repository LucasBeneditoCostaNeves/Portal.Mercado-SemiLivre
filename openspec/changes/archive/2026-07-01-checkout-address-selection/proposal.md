## Why

O fluxo de checkout do marketplace está incompleto: após o usuário confirmar os itens no carrinho e clicar em "Continuar", não existe nenhuma tela de seleção de endereço de entrega. Sem esse step, o pedido não pode ser finalizado, bloqueando a conversão.

## What Changes

- Introdução do **Step 2 do Checkout** — tela de seleção de endereço de entrega
- O usuário vê a lista de endereços cadastrados em sua conta, podendo selecionar um como destino de entrega
- O usuário pode adicionar um novo endereço diretamente nessa tela (via modal ou sub-página), sem sair do fluxo de checkout
- O endereço selecionado fica persistido no contexto do checkout para ser consumido pelos steps seguintes (pagamento, confirmação)
- Indicador visual de progresso do checkout (steps) é introduzido ou reaproveitado caso já exista

## Capabilities

### New Capabilities

- `checkout-address-selection`: Tela de seleção de endereço de entrega dentro do fluxo de checkout. Exibe endereços cadastrados do usuário, permite selecionar um, e oferece opção de adicionar novo endereço.

### Modified Capabilities

- `cart-page`: O botão "Continuar" passa a navegar explicitamente para o step de seleção de endereço (`/checkout/endereco` ou equivalente).

## Impact

- Nova rota de checkout: `app/checkout/endereco/` (ou similar, conforme convenção do projeto)
- Integração com API de endereços do usuário (endpoint a confirmar)
- Estado global de checkout (contexto ou store) precisa armazenar o endereço selecionado
- Componente de listagem de endereços e componente de formulário de novo endereço (pode reutilizar campos com máscaras do `input-masks`)
- Dependência implícita de autenticação: usuário deve estar logado para acessar o checkout
