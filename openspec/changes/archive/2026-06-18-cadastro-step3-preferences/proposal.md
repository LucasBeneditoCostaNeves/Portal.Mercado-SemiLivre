## Why

O wizard de cadastro possui 3 passos, mas o passo 3 ainda exibe apenas um placeholder vazio. Completar essa etapa é necessário para fechar o fluxo de onboarding e permitir que o usuário finalize seu cadastro com preferências personalizadas.

## What Changes

- Substituir o placeholder do passo 3 por um componente `PreferencesForm` com seleção múltipla de categorias de interesse
- Adicionar Server Action `savePreferences` em `actions.ts` para receber e validar as categorias selecionadas
- Adicionar tipo `PreferencesFormState` em `@/domain/auth/types`
- Atualizar textos do passo 3 em `MarketingPanel` e `MobileMarketingBanner`
- Após conclusão (ou skip), redirecionar para `/` via `useRouter().push('/')`

## Capabilities

### New Capabilities

- `cadastro-preferences`: Seleção de preferências/interesses no último passo do wizard de cadastro — exibe grid 2×2 de categorias clicáveis, permite seleção múltipla, e finaliza o cadastro com ou sem seleção.

### Modified Capabilities

- `cadastro-wizard`: O passo 3 deixa de ser placeholder e passa a renderizar o `PreferencesForm`; o `onSuccess` do passo 3 redireciona para home em vez de apenas mudar state.

## Impact

- `src/app/cadastro/_components/cadastro-wizard.tsx` — adiciona renderização do passo 3 e redirect final
- `src/app/cadastro/_components/marketing-panel.tsx` — atualiza textos/checklist do passo 3
- `src/app/cadastro/_components/mobile-marketing-banner.tsx` — atualiza textos do passo 3
- `src/app/cadastro/actions.ts` — nova action `savePreferences`
- `src/domain/auth/types.ts` — novo tipo `PreferencesFormState`
- Novo arquivo: `src/app/cadastro/_components/preferences-form.tsx`
