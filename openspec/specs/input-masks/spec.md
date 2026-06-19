# Spec: input-masks

## Purpose

Centraliza as funções de máscara de input de formulário (`maskCpf`, `maskDate`, `maskPhone`, `maskCep`) em `src/lib/masks.ts`, eliminando definições locais duplicadas nos componentes.

## Requirements

### Requirement: Funções de máscara em módulo utilitário
O sistema SHALL expor em `src/lib/masks.ts` as funções de formatação de input: `maskCpf`, `maskDate`, `maskPhone` e `maskCep`, cada uma aceitando uma `string` e retornando uma `string` formatada.

#### Scenario: maskCpf formata corretamente
- **WHEN** `maskCpf("12345678900")` é chamada
- **THEN** retorna `"123.456.789-00"`

#### Scenario: maskDate formata corretamente
- **WHEN** `maskDate("01011990")` é chamada
- **THEN** retorna `"01/01/1990"`

#### Scenario: maskPhone formata celular com 9 dígitos
- **WHEN** `maskPhone("11999998888")` é chamada
- **THEN** retorna `"(11) 99999-8888"`

#### Scenario: maskPhone formata fixo com 8 dígitos
- **WHEN** `maskPhone("1133334444")` é chamada
- **THEN** retorna `"(11) 3333-4444"`

#### Scenario: maskCep formata corretamente
- **WHEN** `maskCep("01310100")` é chamada
- **THEN** retorna `"01310-100"`

---

### Requirement: Componente de formulário importa máscaras do módulo utilitário
O componente `personal-data-form.tsx` SHALL importar as funções de máscara de `src/lib/masks.ts` em vez de defini-las localmente.

#### Scenario: Nenhuma função de máscara definida localmente no componente
- **WHEN** `personal-data-form.tsx` é inspecionado
- **THEN** não há definição local de `maskCpf`, `maskDate`, `maskPhone` ou `maskCep` — apenas imports de `src/lib/masks.ts`
