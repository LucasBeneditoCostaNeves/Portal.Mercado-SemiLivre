## 1. Tipos e Server Action

- [x] 1.1 Adicionar tipo `PreferencesFormState` em `src/domain/auth/types.ts` (campos: `success?: boolean`, `errors?: { categories?: string[] }`)
- [x] 1.2 Adicionar Server Action `savePreferences` em `src/app/cadastro/actions.ts` — recebe `categories[]` do FormData, valida com zod (array de strings, min 0), retorna `{ success: true }`

## 2. Componente PreferencesForm

- [x] 2.1 Criar `src/app/cadastro/_components/preferences-form.tsx` como Client Component com `useActionState(savePreferences, INITIAL_STATE)`
- [x] 2.2 Definir constante `CATEGORIES` com os 4 itens (id, label, subtitle, icon Tabler) dentro do arquivo
- [x] 2.3 Implementar estado local `selectedCategories: string[]` com toggle ao clicar no card
- [x] 2.4 Renderizar grid 2×2 de cards clicáveis com visual selecionado: `border-[#FFE600] bg-zinc-700`
- [x] 2.5 Serializar categorias selecionadas como campos `categories` no `<form>` (um `<input type="hidden">` por item selecionado)
- [x] 2.6 Adicionar botão "Concluir cadastro →" (submit, estilo amarelo full-width) e link "Pular por enquanto" (chama `onSuccess` diretamente sem submeter)
- [x] 2.7 Chamar `onSuccess()` via `useEffect` quando `state.success === true`

## 3. Integração no CadastroWizard

- [x] 3.1 Importar `PreferencesForm` e `useRouter` em `cadastro-wizard.tsx`
- [x] 3.2 Criar `handleStep3Success` com `useCallback` que chama `router.push('/')`
- [x] 3.3 Substituir o placeholder do `step === 3` por `<PreferencesForm onSuccess={handleStep3Success} />`
- [x] 3.4 Adicionar heading e parágrafo descritivo do passo 3 acima do `PreferencesForm` (padrão dos passos anteriores)

## 4. Atualizar painéis de marketing

- [x] 4.1 Atualizar `MarketingPanel` para exibir no passo 3: headline "Você está quase lá! Personalize sua experiência", subtexto sobre categorias, e checklist com passos 1 e 2 concluídos e passo 3 em andamento
- [x] 4.2 Atualizar `MobileMarketingBanner` para exibir no passo 3: título "Quase lá!" e subtítulo "Passo 3 de 3 — preferências"
