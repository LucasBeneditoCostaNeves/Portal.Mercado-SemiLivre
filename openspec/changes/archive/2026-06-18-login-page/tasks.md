## 1. Tipos e Server Action

- [x] 1.1 Adicionar `LoginFormState` em `src/domain/auth/types.ts` com campos `errors.email`, `errors.password`, `message` e `success`
- [x] 1.2 Criar `src/app/login/actions.ts` com a Server Action `loginWithEmail(prevState, formData)`: validar e-mail (obrigatório + formato) e senha (obrigatório + mínimo 6 chars); se válido, retornar `{ success: false, message: "Credenciais inválidas" }`

## 2. Componentes de Login

- [x] 2.1 Criar `src/components/login/LoginMarketingPanel.tsx` (Server Component): logo Mercado Livre, título "Bem-vindo de volta!", parágrafo, 3 stat items (ti-package, ti-heart, ti-tag) e nota de segurança — fundo `#FFE600`, padding `48px 40px`
- [x] 2.2 Criar `src/components/login/PasswordField.tsx` (Client Component `"use client"`): input `type="password"` com toggle show/hide via ícone `ti-eye` / `ti-eye-off`, aceitando `name`, `label`, `error` e `placeholder` como props
- [x] 2.3 Criar `src/components/login/LoginForm.tsx` (Client Component `"use client"`): usa `useActionState(loginWithEmail, INITIAL_STATE)`; contém botão Google OAuth desabilitado (`opacity-50 cursor-not-allowed`), `Divider`, `FormField` para e-mail, `PasswordField`, link "Esqueci minha senha", `SubmitButton`, link para `/cadastro` e nota SSL

## 3. Página de Login

- [x] 3.1 Criar `src/app/login/page.tsx` (Server Component): layout `grid grid-cols-1 lg:grid-cols-2` com `LoginMarketingPanel` oculto em mobile (`hidden lg:block`) e `LoginForm` ocupando a coluna direita; replicar bordas e border-radius do layout do cadastro

## 4. Verificação Visual e Responsividade

- [x] 4.1 Confirmar que em desktop o painel amarelo e o formulário estão lado a lado, com altura mínima de `560px` e `border-radius` consistente com o mockup
- [x] 4.2 Confirmar que em mobile apenas o formulário é exibido, sem o painel de marketing
- [x] 4.3 Confirmar que os erros de validação (e-mail inválido, senha curta, campos vazios) aparecem abaixo dos campos corretos após a submissão
- [x] 4.4 Confirmar que o toggle de show/hide senha funciona corretamente e que o botão do Google está visivelmente desabilitado
