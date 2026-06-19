## Context

O projeto Portal Mercado SemiLivre é um Next.js 16 com React 19 e TypeScript. A estrutura de diretórios `src/domain/`, `src/constants/`, `src/lib/` foi criada antecipando uma arquitetura em camadas, mas está completamente vazia. Ao longo do desenvolvimento das features de login e cadastro, validadores, constantes e utilitários acabaram ficando nas Server Actions (camada de apresentação) ou embutidos nos componentes de UI.

O resultado é:
- Duplicação real (código idêntico em dois lugares)
- Violação de camadas (domínio dentro de apresentação)
- Duas convenções de nomenclatura e localização de componentes coexistindo

Esta refatoração não muda comportamento — é pura reorganização estrutural.

## Goals / Non-Goals

**Goals:**
- Preencher as camadas corretas (`domain/`, `constants/`, `lib/`) com o conteúdo que já pertence a elas
- Eliminar toda duplicação identificada (validators, estados BR, FeatureIcon, GoogleIcon)
- Estabelecer convenção única: componentes de rota ficam em `src/app/<rota>/_components/` com kebab-case
- Corrigir o bug de dependência de `useEffect` que o ESLint flagraria

**Non-Goals:**
- Adicionar validações novas ou mudar regras de negócio existentes
- Criar testes
- Migrar para bibliotecas de formulário (react-hook-form, zod, etc.)
- Alterar a lógica das Server Actions além da extração de validators

## Decisions

### D1 — Localização dos validators de domínio

**Decisão:** `src/domain/auth/validators.ts`

Validadores como `isValidEmail`, `isValidCpf` e `isAdult` são lógica de domínio pura — não dependem de I/O, framework ou UI. O diretório `src/domain/auth/` já existe e já abriga `types.ts`. Colocar validators no mesmo domínio mantém coesão.

Alternativa rejeitada: `src/lib/validators.ts` — lib é para utilitários genéricos/transversais; validators de auth são específicos do domínio de autenticação.

### D2 — Localização das constantes brasileiras

**Decisão:** `src/constants/brazil.ts` exportando `BR_STATES` e `GENDERS`

Arrays de dados que nunca mudam e são usados em múltiplas camadas (action + componente) pertencem a `src/constants/`. O arquivo agrupa dados do Brasil especificamente, facilitando eventual expansão (CEPs, DDDs, etc.).

Alternativa rejeitada: `src/domain/auth/constants.ts` — estados e gêneros não são conceitos do domínio de autenticação; são dados geográficos/demográficos reutilizáveis.

### D3 — Localização das funções de máscara

**Decisão:** `src/lib/masks.ts`

Máscaras são transformações puras de string sem semântica de domínio. São utilitários — pertencem a `src/lib/`. Além disso, masks de CPF, telefone e CEP podem ser reutilizadas em outros formulários futuros.

### D4 — Extração do GoogleIcon

**Decisão:** `src/components/ui/google-icon.tsx`

O SVG do Google é idêntico nos dois componentes que o usam. Extrair para `src/components/ui/` (componentes de UI compartilhados) é o padrão mais natural. O arquivo `google-account-button.tsx` será deletado (código morto), então o `GoogleIcon` será usado apenas em `google-signin-button.tsx` — mas ainda vale extrair para evitar reintrodução da duplicação.

### D5 — Migração dos componentes de login

**Decisão:** Mover `src/components/login/` → `src/app/login/_components/` com kebab-case

Os componentes `LoginForm`, `LoginMarketingPanel` e `PasswordField` são específicos da rota `/login`, não são compartilhados. Ficar em `src/components/` implica compartilhamento — o que é enganoso. A convenção do projeto (cadastro) usa `_components/` dentro da rota com kebab-case.

Renomeação dos arquivos:
- `LoginForm.tsx` → `login-form.tsx`
- `LoginMarketingPanel.tsx` → `login-marketing-panel.tsx`
- `PasswordField.tsx` → `password-field.tsx`

O `src/app/login/page.tsx` precisará atualizar seus imports.

### D6 — EmailField inline vs FormField genérico

**Decisão:** Substituir o `EmailField` inline do `LoginForm` pelo `FormField` genérico já existente

O `FormField` em `src/app/cadastro/_components/form-field.tsx` já cobre o caso de uso de email (suporta `type="email"`). Mover o `FormField` para `src/app/login/_components/` ou criar um `src/components/ui/form-field.tsx` compartilhado são as duas opções.

**Sub-decisão:** Promover `FormField` e `SelectField` para `src/components/ui/` — são componentes genéricos de UI que podem ser reutilizados entre rotas (login e cadastro já os compartilhariam).

## Risks / Trade-offs

**[Risk] Quebra de imports em runtime** → Mitigação: TypeScript vai apontar erros de import no build; a PR não passa se algum import estiver quebrado. Testar com `next build` antes de mergear.

**[Risk] FeatureIcon em marketing-panel.tsx e mobile-feature-row.tsx é visualmente idêntico mas pode divergir no futuro** → Mitigação: Extrair para componente local dentro do mesmo diretório `_components/` (não para `src/components/ui/`) — fica próximo de quem usa, sem acoplamento global.

**[Risk] Renomear arquivos de componentes de login quebra possíveis hotlinks ou referências em docs** → Mitigação: Projeto está em desenvolvimento inicial (branch `v0.1.0`), sem docs externos. Risco zero.

**[Trade-off] Promover FormField para src/components/ui/ cria dependência entre rotas** → Aceitável: `FormField` é um primitivo de UI genérico (label + input + erro), não carrega lógica de domínio. Compartilhar primitivos de UI é desejado.
