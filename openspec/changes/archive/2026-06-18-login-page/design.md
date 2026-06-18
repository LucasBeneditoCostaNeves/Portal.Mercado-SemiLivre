## Context

O projeto usa Next.js App Router, Tailwind CSS v4 e Server Actions para mutações. O fluxo de cadastro (`/cadastro`) já estabeleceu os padrões arquiteturais: layout split-screen com `MarketingPanel` + formulário, Server Actions em `actions.ts`, tipos em `src/domain/auth/types.ts`, e componentes reutilizáveis em `src/app/cadastro/_components/`. A rota `/login` existe mas está vazia.

O designer entregou o mockup `ml_login_desktop.html` com a especificação visual exata da página.

## Goals / Non-Goals

**Goals:**
- Implementar `/login` visualmente fiel ao mockup, reutilizando o máximo dos padrões já estabelecidos
- Criar `LoginFormState` tipado e `loginWithEmail` Server Action como stub validado
- `PasswordField` com toggle show/hide como Client Component isolado (mínimo de `"use client"`)
- Responsividade mobile (painel esquerdo oculto, só formulário)

**Non-Goals:**
- Autenticação real (sessão, JWT, cookies de auth)
- Google OAuth funcional
- Página de recuperação de senha
- Redirecionamento pós-login (sem verificação de sessão por ora)

## Decisions

### 1. Estrutura de arquivos: espelhar o cadastro

A página de login fica em `src/app/login/` e seus componentes em `src/components/login/` (compartilhados, não privados à rota), seguindo a separação já usada implicitamente no projeto.

**Alternativa considerada**: colocar componentes em `src/app/login/_components/` (colocação por rota, como o cadastro). Rejeitada porque o `LoginForm` pode ser reutilizado em modais ou em outros contextos de auth no futuro, e não possui dependência de estado do wizard como o cadastro.

### 2. LoginForm como Client Component

`LoginForm` precisará de `useActionState` para reagir ao retorno da Server Action e exibir erros de campo — isso exige `"use client"`. A página `page.tsx` permanece Server Component e apenas importa `LoginForm`.

### 3. PasswordField como Client Component isolado

O toggle show/hide senha (`useState` no campo) fica em um componente `PasswordField` separado dentro de `LoginForm`. Isso evita que toda a página se torne client por causa de uma interação pontual.

**Alternativa considerada**: delegar o toggle inteiramente ao `LoginForm`. Aceito como alternativa de menor custo se o `LoginForm` já for client — ambas as abordagens são válidas; `PasswordField` separado é preferido por coesão.

### 4. Painel de marketing como Server Component

O `LoginMarketingPanel` (coluna esquerda) é puramente estático — sem estado, sem efeitos. Fica como Server Component dentro de `src/components/login/`.

**Reutilização de `MarketingPanel` do cadastro**: rejeitada. O painel do cadastro é específico para o wizard (recebe `step` e exibe checklist de progresso). O painel do login tem conteúdo fixo diferente (stats de boas-vindas). Duplicar o markup é correto aqui.

### 5. loginWithEmail como Server Action stub validado

A action valida os campos (e-mail formato + senha >= 6 chars) e, se válidos, retorna `{ success: false, message: "Credenciais inválidas" }`. Isso permite testar o fluxo completo de formulário → action → feedback de erro sem infraestrutura de auth.

Quando a auth real for implementada, basta substituir o `return { success: false, message: "..." }` pelo chamado real, sem mudar a interface.

### 6. Tipos em src/domain/auth/types.ts

`LoginFormState` segue o mesmo contrato de `RegisterFormState`:

```ts
export type LoginFormState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
  success?: boolean
}
```

## Risks / Trade-offs

- **Stub de auth não bloqueia acesso** → Sem middleware de proteção de rotas, qualquer rota "autenticada" fica acessível. Mitigação: documentar que a proteção de rotas é responsabilidade de uma mudança futura (middleware ou layout auth).
- **Google OAuth desabilitado** → O botão fica visível mas inativo. Risco de confusão do usuário. Mitigação: estilizar o botão com `opacity-50 cursor-not-allowed` para comunicar que está indisponível.
- **Duplicação do MarketingPanel** → Pequeno: o painel do login e do cadastro têm propósitos distintos. Se uma abstração de "shell de auth" for necessária no futuro, ela pode ser extraída então.

## Open Questions

- Quando a auth real for implementada, qual provider será usado (NextAuth, Lucia, custom)? Isso pode impactar onde `loginWithEmail` deve ser plugado.
- O link "Esqueci minha senha" precisará de uma rota `/recuperar-senha` — fora do escopo agora, mas deve ser planejado antes do lançamento.
