## Why

O projeto tem lógica de domínio (validadores, constantes) vivendo em Server Actions, dados duplicados entre arquivos diferentes, e duas convenções de nomenclatura de componentes coexistindo. Os diretórios `src/domain/`, `src/constants/`, `src/lib/` foram criados mas estão vazios — o conteúdo que pertence a eles foi parar em camadas erradas.

## What Changes

- Extrair `isValidEmail`, `isValidCpf` e `isAdult` das actions para `src/domain/auth/validators.ts`
- Mover constantes de domínio (`VALID_GENDERS`, `VALID_STATES`/`BR_STATES`) para `src/constants/brazil.ts` — elimina array duplicado com dois nomes diferentes
- Extrair funções de máscara (`maskCpf`, `maskDate`, `maskPhone`, `maskCep`) de `personal-data-form.tsx` para `src/lib/masks.ts`
- Extrair `GoogleIcon` SVG (duplicado em `google-signin-button.tsx` e `google-account-button.tsx`) para componente compartilhado `src/components/ui/google-icon.tsx`
- Extrair `FeatureIcon` (duplicado em `marketing-panel.tsx` e `mobile-feature-row.tsx`) para componente local reutilizável
- Mover componentes de login de `src/components/login/` para `src/app/login/_components/` e renomear de PascalCase para kebab-case (padrão do projeto)
- Corrigir `useEffect` com dependência `onSuccess` faltando em `register-form.tsx` e `personal-data-form.tsx`
- Substituir `<img>` por `<Image>` do `next/image` em `google-account-button.tsx`
- Remover `google-account-button.tsx` (componente sem importadores — código morto)
- Substituir `EmailField` inline no `LoginForm` pelo `FormField` genérico já existente no projeto

## Capabilities

### New Capabilities

- `auth-validators`: Funções de validação de domínio para autenticação (email, CPF, maioridade)
- `brazil-constants`: Constantes de dados brasileiros (estados, gêneros)
- `input-masks`: Funções utilitárias de formatação/máscara para inputs de formulário

### Modified Capabilities

_(nenhuma mudança de requisito — apenas realocação de código para as camadas corretas)_

## Impact

- `src/app/login/actions.ts` — passa a importar de `src/domain/auth/validators.ts`
- `src/app/cadastro/actions.ts` — passa a importar de `src/domain/auth/validators.ts` e `src/constants/brazil.ts`
- `src/app/cadastro/_components/personal-data-form.tsx` — passa a importar de `src/lib/masks.ts` e `src/constants/brazil.ts`
- `src/app/login/page.tsx` — atualiza import dos componentes de login para `_components/`
- `src/app/login/_components/` — novo diretório com componentes migrados do `src/components/login/`
- Sem mudanças de comportamento visível ao usuário
- Sem quebra de API ou contratos externos
