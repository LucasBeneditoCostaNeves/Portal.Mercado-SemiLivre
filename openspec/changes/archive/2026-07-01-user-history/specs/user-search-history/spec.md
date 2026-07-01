## ADDED Requirements

### Requirement: Exibir histórico de buscas ao focar no SearchBar
Quando o usuário autenticado focar no input de pesquisa, o sistema SHALL consultar o backend e exibir um dropdown com até 5 termos buscados recentemente, ordenados do mais recente para o mais antigo. Usuários não autenticados não veem o dropdown de histórico.

#### Scenario: Usuário autenticado foca no input com histórico disponível
- **WHEN** um usuário autenticado clica/foca no input de pesquisa e possui buscas anteriores
- **THEN** um dropdown exibe até 5 termos recentes com ícone de relógio e o label "Buscas recentes"

#### Scenario: Usuário autenticado sem histórico
- **WHEN** um usuário autenticado foca no input mas nunca realizou buscas
- **THEN** o dropdown não é exibido (sem lista vazia)

#### Scenario: Usuário não autenticado
- **WHEN** um usuário sem sessão foca no input de pesquisa
- **THEN** nenhum dropdown de histórico é exibido

#### Scenario: Selecionar termo do histórico
- **WHEN** o usuário clica em um item do dropdown de histórico
- **THEN** o input é preenchido com o termo selecionado e o sistema navega para `/buscar?q={termo}`

#### Scenario: Fechar dropdown ao clicar fora
- **WHEN** o usuário clica fora do input e do dropdown
- **THEN** o dropdown é fechado sem disparar busca

### Requirement: Registrar busca ao navegar para /buscar
O sistema SHALL registrar o termo de busca no histórico do usuário autenticado quando ele navegar para `/buscar?q={termo}`. O registro SHALL ser fire-and-forget e não bloquear a navegação.

#### Scenario: Busca registrada ao navegar
- **WHEN** um usuário autenticado acessa `/buscar?q=notebook`
- **THEN** o termo "notebook" é registrado no histórico via POST /history/search (sem bloquear a página)

#### Scenario: Busca duplicada dentro de 1 minuto não é duplicada
- **WHEN** o mesmo usuário busca "notebook" duas vezes em menos de 1 minuto
- **THEN** apenas um registro é criado no banco para esse termo nesse intervalo

#### Scenario: Usuário não autenticado não gera registro
- **WHEN** um usuário sem sessão acessa `/buscar?q=notebook`
- **THEN** nenhum registro é criado no histórico
