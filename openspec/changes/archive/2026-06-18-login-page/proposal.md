## Why

O projeto possui o fluxo de cadastro implementado, mas a rota `/login` está vazia — usuários não conseguem autenticar. A página de login é o ponto de entrada principal do app e precisa existir antes de qualquer funcionalidade autenticada poder ser testada ou lançada.

## What Changes

- Nova página `/login` com layout desktop split-screen (painel de marketing amarelo + formulário à direita)
- Formulário de login com e-mail e senha, validação client-side e server-side
- Server Action `loginWithEmail` com retorno de erro simulado (auth real será plugada depois)
- Toggle show/hide senha (Client Component isolado)
- Botão Google OAuth renderizado mas sem implementação real por ora
- Layout mobile responsivo: painel esquerdo oculto, somente formulário
- Tipos `LoginFormState` adicionados em `src/domain/auth/types.ts`

## Capabilities

### New Capabilities

- `login-page`: Página de autenticação por e-mail/senha com layout split-screen, validação, Server Action stub e responsividade mobile

### Modified Capabilities

- `cadastro-wizard`: Adiciona link de retorno ao login no fluxo de cadastro (o link "Já tenho conta" na step-1 passa a apontar para `/login` em vez de `#`)

## Impact

- Nova rota: `src/app/login/page.tsx` (Server Component) + `src/app/login/actions.ts`
- Novos componentes: `src/components/login/` (PasswordField com toggle, LoginForm)
- Tipos: `src/domain/auth/types.ts` recebe `LoginFormState`
- Cadastro step-1: atualização do link "Já tenho conta" para `/login`
- Sem novos pacotes ou dependências externas
