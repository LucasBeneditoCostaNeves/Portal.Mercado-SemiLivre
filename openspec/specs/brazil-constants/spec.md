# Spec: brazil-constants

## Purpose

Centraliza constantes brasileiras reutilizáveis (estados e gêneros) em `src/constants/brazil.ts`, eliminando arrays inline dispersos em actions e componentes.

## Requirements

### Requirement: Constante de estados brasileiros
O sistema SHALL expor em `src/constants/brazil.ts` um array `BR_STATES` do tipo `readonly string[]` contendo as siglas dos 27 estados brasileiros (incluindo DF) em ordem alfabética.

#### Scenario: Array contém todos os estados
- **WHEN** `BR_STATES` é importado de `src/constants/brazil.ts`
- **THEN** o array contém exatamente 27 elementos representando as siglas dos estados e do DF

#### Scenario: Action de cadastro usa BR_STATES para validação
- **WHEN** `savePersonalData` valida o campo `state`
- **THEN** verifica se o valor está em `BR_STATES` importado de `src/constants/brazil.ts`

#### Scenario: Componente de formulário usa BR_STATES para renderizar opções
- **WHEN** o `SelectField` de estado é renderizado em `personal-data-form.tsx`
- **THEN** as opções são geradas a partir de `BR_STATES` importado de `src/constants/brazil.ts`

---

### Requirement: Constante de gêneros válidos
O sistema SHALL expor em `src/constants/brazil.ts` um array `GENDERS` com os valores aceitos pelo campo gênero: `masculino`, `feminino`, `nao-binario`, `prefiro-nao-informar`.

#### Scenario: Action de cadastro usa GENDERS para validação
- **WHEN** `savePersonalData` valida o campo `gender`
- **THEN** verifica se o valor está em `GENDERS` importado de `src/constants/brazil.ts`

#### Scenario: Nenhum arquivo define o array de gêneros localmente
- **WHEN** o codebase é inspecionado
- **THEN** nenhuma action ou componente define o array de gêneros inline — apenas importa de `src/constants/brazil.ts`
