## Purpose

Especifica a página `/checkout/endereco` (Step 2 do fluxo de checkout), incluindo controle de acesso, exibição e seleção de endereços cadastrados, adição de novos endereços via modal, indicador de progresso do checkout e navegação entre steps.

---

## Requirements

### Requirement: Acesso autenticado à página de seleção de endereço
A página `/checkout/endereco` SHALL redirecionar usuários não autenticados para `/login` antes de renderizar qualquer conteúdo.

#### Scenario: Usuário não autenticado é redirecionado
- **WHEN** um usuário sem sessão válida acessa `/checkout/endereco`
- **THEN** o sistema redireciona para `/login`

#### Scenario: Usuário autenticado acessa normalmente
- **WHEN** um usuário com sessão válida acessa `/checkout/endereco`
- **THEN** a página é renderizada exibindo os endereços cadastrados do usuário

---

### Requirement: Exibição da lista de endereços cadastrados
A página SHALL exibir todos os endereços cadastrados na conta do usuário.

#### Scenario: Usuário possui endereços cadastrados
- **WHEN** o usuário acessa a página e possui ao menos um endereço cadastrado
- **THEN** cada endereço é exibido em um card com: logradouro, número, complemento (se houver), cidade, estado e CEP

#### Scenario: Usuário não possui endereços cadastrados
- **WHEN** o usuário acessa a página e não possui nenhum endereço cadastrado
- **THEN** a página exibe um estado vazio com mensagem informativa e CTA para adicionar o primeiro endereço

---

### Requirement: Seleção de endereço de entrega
A página SHALL permitir que o usuário selecione exatamente um endereço como destino de entrega.

#### Scenario: Seleção de endereço existente
- **WHEN** o usuário clica em um card de endereço
- **THEN** o endereço é marcado como selecionado (destaque visual) e os demais são desmarcados

#### Scenario: Endereço padrão pré-selecionado
- **WHEN** o usuário acessa a página e possui um endereço marcado como padrão
- **THEN** esse endereço é pré-selecionado automaticamente ao carregar a página

#### Scenario: Nenhum endereço selecionado bloqueia avanço
- **WHEN** o usuário tenta prosseguir sem selecionar nenhum endereço
- **THEN** o botão de continuar permanece desabilitado e nenhuma navegação ocorre

---

### Requirement: Adição de novo endereço via modal
A página SHALL permitir que o usuário adicione um novo endereço sem sair do fluxo de checkout.

#### Scenario: Abertura do modal de novo endereço
- **WHEN** o usuário clica no botão "Adicionar novo endereço"
- **THEN** um modal é exibido com o formulário de cadastro de endereço

#### Scenario: Campos obrigatórios do formulário de endereço
- **WHEN** o modal de novo endereço é exibido
- **THEN** o formulário contém os campos: CEP (com máscara), logradouro, número, complemento (opcional), cidade e estado

#### Scenario: Submissão bem-sucedida de novo endereço
- **WHEN** o usuário preenche todos os campos obrigatórios e submete o formulário
- **THEN** o endereço é salvo via API, o modal é fechado, a lista de endereços é atualizada e o novo endereço é pré-selecionado automaticamente

#### Scenario: Submissão com campos obrigatórios vazios
- **WHEN** o usuário tenta submeter o formulário com campos obrigatórios em branco
- **THEN** erros de validação são exibidos por campo e o endereço não é enviado para a API

#### Scenario: Fechamento do modal sem salvar
- **WHEN** o usuário fecha o modal sem submeter o formulário
- **THEN** o modal é fechado sem alterações na lista de endereços

---

### Requirement: Indicador de progresso do checkout
A página SHALL exibir um indicador visual do step atual dentro do fluxo de checkout.

#### Scenario: Step 2 ativo no indicador
- **WHEN** o usuário acessa `/checkout/endereco`
- **THEN** o indicador de steps mostra "Endereço" como step atual e "Carrinho" como step anterior (concluído)

---

### Requirement: Navegação entre steps
A página SHALL permitir ao usuário avançar para o próximo step ou retornar ao carrinho.

#### Scenario: Avançar com endereço selecionado
- **WHEN** o usuário possui um endereço selecionado e clica em "Continuar"
- **THEN** o sistema navega para o próximo step do checkout (`/checkout/pagamento`) passando o ID do endereço selecionado via `searchParams`

#### Scenario: Retornar ao carrinho
- **WHEN** o usuário clica em "Voltar ao carrinho"
- **THEN** o sistema navega para `/carrinho`
