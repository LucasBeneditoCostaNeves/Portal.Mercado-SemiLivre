## Context

O wizard de cadastro (`CadastroWizard`) já gerencia 3 passos via `useState`. Passos 1 e 2 usam Server Actions com `useActionState` e avançam via callback `onSuccess`. O passo 3 hoje exibe um placeholder estático. A estrutura existente (MarketingPanel, MobileMarketingBanner, StepIndicator) já suporta `step={3}` mas sem conteúdo textual adequado.

## Goals / Non-Goals

**Goals:**
- Implementar `PreferencesForm` como componente Client no padrão dos demais formulários do wizard
- Adicionar `savePreferences` como Server Action em `actions.ts`
- Permitir skip (sem seleção obrigatória) e seleção múltipla de categorias
- Redirecionar para `/` ao concluir ou pular
- Atualizar textos do passo 3 nos painéis laterais

**Non-Goals:**
- Persistir preferências em banco de dados (no-op por enquanto)
- Autenticação real ou sessão de usuário
- Animações de transição entre passos
- Mais de 4 categorias

## Decisions

### 1. Client Component com `useActionState` (igual passos 1 e 2)
`PreferencesForm` será `'use client'` e usará `useActionState(savePreferences, INITIAL_STATE)`. O estado de seleção de categorias (`selectedCategories: string[]`) é local ao componente. Ao submeter, os valores selecionados são serializados como múltiplos campos `categories` no `FormData`.

**Alternativa considerada:** estado totalmente controlado sem Server Action (só redirect). Rejeitado para manter consistência com o padrão do wizard e deixar extensão futura (persistência) trivial.

### 2. Redirect no wizard via `useRouter`, não na Server Action
`onSuccess` no `CadastroWizard` chama `useRouter().push('/')`. A Server Action retorna apenas `{ success: true }` — não usa `redirect()` do Next.js — para que o componente de UI controle a navegação, mantendo o mesmo padrão dos passos anteriores.

**Alternativa considerada:** `redirect('/')` dentro da Server Action. Rejeitado porque quebra o padrão do wizard e complica testes futuros do formulário isolado.

### 3. Validação permissiva (min 0 categorias)
`savePreferences` aceita array vazio (skip válido). Não há erro de validação para "nenhuma categoria selecionada" — o fluxo de skip e o botão "Concluir" usam a mesma action.

### 4. Categorias hardcoded no componente
As 4 categorias (Eletrônicos, Moda, Casa e decoração, Esportes) são definidas como constante no próprio `PreferencesForm`. Não há necessidade de busca assíncrona ou configuração externa no escopo atual.

## Risks / Trade-offs

- **Sem persistência real** → As preferências são validadas mas descartadas. Aceitável enquanto não houver backend; a Server Action já está no lugar para receber a lógica futura.
- **`useRouter` em Client Component** → Exige `'use client'` no CadastroWizard (já está). Sem impacto adicional.

## Migration Plan

Nenhuma migração de dados necessária. A mudança é additive: novo componente + nova action + textos atualizados nos painéis. Rollback é reverter os arquivos modificados.
