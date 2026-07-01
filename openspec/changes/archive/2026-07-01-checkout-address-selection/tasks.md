## 1. Tipos e Serviço de Endereços

- [x] 1.1 Criar `src/types/address.ts` com interfaces `Address` e `CreateAddressPayload`
- [x] 1.2 Criar `src/services/address.service.ts` com funções `getAddresses(token)` e `createAddress(token, payload)`

## 2. Rota e Layout de Checkout

- [x] 2.1 Criar route group `src/app/(checkout)/` com `layout.tsx` (header simplificado, sem Navbar completa)
- [x] 2.2 Criar componente `src/app/(checkout)/_components/checkout-stepper.tsx` que recebe `currentStep` e exibe os steps visualmente

## 3. Página de Seleção de Endereço

- [x] 3.1 Criar `src/app/(checkout)/checkout/endereco/page.tsx` como Server Component com `getSession` e redirect para `/login` se não autenticado
- [x] 3.2 Buscar lista de endereços via `address.service.getAddresses` e passar para componentes filhos
- [x] 3.3 Criar `src/app/(checkout)/checkout/endereco/_components/address-list.tsx` como Client Component que exibe cards de endereço selecionáveis
- [x] 3.4 Criar `src/app/(checkout)/checkout/endereco/_components/address-card.tsx` com layout de card de endereço e estado visual de seleção
- [x] 3.5 Criar estado vazio para quando o usuário não possui endereços cadastrados

## 4. Modal de Novo Endereço

- [x] 4.1 Criar `src/app/(checkout)/checkout/endereco/_components/add-address-modal.tsx` como Client Component com `<dialog>` nativo
- [x] 4.2 Criar formulário de endereço com campos: CEP (com máscara), logradouro, número, complemento, bairro, cidade, estado
- [x] 4.3 Criar `src/app/(checkout)/checkout/endereco/actions.ts` com Server Action `createAddressAction` que chama `address.service.createAddress` e faz `revalidatePath`
- [x] 4.4 Implementar validação client-side dos campos obrigatórios antes de submeter
- [x] 4.5 Após submissão bem-sucedida: fechar modal e pré-selecionar o novo endereço

## 5. Navegação e Integração com Carrinho

- [x] 5.1 Atualizar `CartSummary` para que o botão "Continuar" navegue para `/checkout/endereco?itens=<ids>` usando `useRouter` do Next.js
- [x] 5.2 Implementar botão "Voltar" na página de endereço que retorna para `/carrinho`
- [x] 5.3 Implementar botão "Continuar" na página de endereço que navega para o próximo step passando o `addressId` selecionado (desabilitado se nenhum endereço selecionado)
