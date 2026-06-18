## 1. Criar módulo de validators de domínio

- [x] 1.1 Criar `src/domain/auth/validators.ts` exportando `isValidEmail`, `isValidCpf` e `isAdult` (mover das actions, sem alterar a lógica)
- [x] 1.2 Atualizar `src/app/login/actions.ts` para remover `isValidEmail` local e importar de `src/domain/auth/validators.ts`
- [x] 1.3 Atualizar `src/app/cadastro/actions.ts` para remover `isValidEmail`, `isValidCpf` e `isAdult` locais e importar de `src/domain/auth/validators.ts`

## 2. Criar módulo de constantes brasileiras

- [x] 2.1 Criar `src/constants/brazil.ts` exportando `BR_STATES` (array de siglas dos 27 estados) e `GENDERS` (array de valores de gênero)
- [x] 2.2 Atualizar `src/app/cadastro/actions.ts` para remover `VALID_STATES` e `VALID_GENDERS` locais e importar `BR_STATES` e `GENDERS` de `src/constants/brazil.ts`
- [x] 2.3 Atualizar `src/app/cadastro/_components/personal-data-form.tsx` para remover `BR_STATES` local e importar de `src/constants/brazil.ts`

## 3. Criar módulo de funções de máscara

- [x] 3.1 Criar `src/lib/masks.ts` exportando `maskCpf`, `maskDate`, `maskPhone` e `maskCep` (mover de `personal-data-form.tsx`, sem alterar a lógica)
- [x] 3.2 Atualizar `personal-data-form.tsx` para remover as funções de máscara locais e importar de `src/lib/masks.ts`

## 4. Eliminar duplicações de componentes de UI

- [x] 4.1 Criar `src/components/ui/google-icon.tsx` extraindo o SVG do Google que estava duplicado
- [x] 4.2 Atualizar `src/app/cadastro/_components/google-signin-button.tsx` para importar `GoogleIcon` de `src/components/ui/google-icon.tsx`
- [x] 4.3 Remover `src/app/cadastro/_components/google-account-button.tsx` (componente sem importadores — código morto)
- [x] 4.4 Extrair `FeatureIcon` de `marketing-panel.tsx` para `src/app/cadastro/_components/feature-icon.tsx` e atualizar `mobile-feature-row.tsx` para importá-lo de lá

## 5. Promover FormField e SelectField para componentes de UI compartilhados

- [x] 5.1 Mover `src/app/cadastro/_components/form-field.tsx` para `src/components/ui/form-field.tsx`
- [x] 5.2 Mover `src/app/cadastro/_components/select-field.tsx` para `src/components/ui/select-field.tsx`
- [x] 5.3 Atualizar todos os imports de `form-field` e `select-field` dentro de `_components/` do cadastro para apontar para `src/components/ui/`

## 6. Migrar componentes de login para convenção correta

- [x] 6.1 Criar diretório `src/app/login/_components/`
- [x] 6.2 Mover e renomear `LoginForm.tsx` → `src/app/login/_components/login-form.tsx`
- [x] 6.3 Mover e renomear `LoginMarketingPanel.tsx` → `src/app/login/_components/login-marketing-panel.tsx`
- [x] 6.4 Mover e renomear `src/components/login/PasswordField.tsx` → `src/app/login/_components/password-field.tsx`
- [x] 6.5 Atualizar `src/app/login/page.tsx` para importar dos novos caminhos em `_components/`
- [x] 6.6 Remover o diretório `src/components/login/` (ficou vazio)

## 7. Substituir EmailField inline por FormField genérico no login

- [x] 7.1 Remover o componente `EmailField` definido inline em `login-form.tsx`
- [x] 7.2 Substituir o uso de `<EmailField>` por `<FormField>` importado de `src/components/ui/form-field.tsx`, passando `type="email"`

## 8. Corrigir bugs de dependência de useEffect

- [x] 8.1 Adicionar `onSuccess` ao array de dependências do `useEffect` em `src/app/cadastro/_components/register-form.tsx` e remover o comentário que justificava a omissão
- [x] 8.2 Adicionar `onSuccess` ao array de dependências do `useEffect` em `src/app/cadastro/_components/personal-data-form.tsx` e remover o comentário que justificava a omissão

## 9. Corrigir uso de img nativa

- [x] 9.1 Substituir `<img>` por `<Image>` do `next/image` em `google-account-button.tsx` — não aplicável, arquivo removido na tarefa 4.3

## 10. Verificação final

- [x] 10.1 Rodar `next build` e confirmar que não há erros de TypeScript ou de import
- [x] 10.2 Confirmar que `src/components/login/` foi removido e `src/components/` só contém `ui/`
- [x] 10.3 Confirmar que `src/domain/auth/validators.ts`, `src/constants/brazil.ts` e `src/lib/masks.ts` existem e são a única fonte de verdade para seu conteúdo
