# Spec: auth-validators

## Purpose

Centraliza as funções de validação de domínio de autenticação (e-mail, CPF e maioridade) em `src/domain/auth/validators.ts`, eliminando duplicação entre Server Actions e garantindo que a lógica de negócio fique na camada de domínio.

## Requirements

### Requirement: Validação de e-mail de domínio
O sistema SHALL expor uma função `isValidEmail(email: string): boolean` em `src/domain/auth/validators.ts` que verifica se o valor é um endereço de e-mail sintaticamente válido.

#### Scenario: E-mail válido retorna true
- **WHEN** `isValidEmail` recebe uma string no formato `usuario@dominio.tld`
- **THEN** a função retorna `true`

#### Scenario: E-mail sem @ retorna false
- **WHEN** `isValidEmail` recebe uma string sem o caractere `@`
- **THEN** a função retorna `false`

#### Scenario: String vazia retorna false
- **WHEN** `isValidEmail` recebe uma string vazia
- **THEN** a função retorna `false`

---

### Requirement: Validação de CPF de domínio
O sistema SHALL expor uma função `isValidCpf(cpf: string): boolean` em `src/domain/auth/validators.ts` que valida o CPF pelo algoritmo de dígitos verificadores, aceitando tanto o formato puro (`11122233344`) quanto formatado (`111.222.333-44`).

#### Scenario: CPF válido formatado retorna true
- **WHEN** `isValidCpf` recebe `"111.444.777-35"` (CPF válido)
- **THEN** a função retorna `true`

#### Scenario: CPF com todos os dígitos iguais retorna false
- **WHEN** `isValidCpf` recebe `"111.111.111-11"`
- **THEN** a função retorna `false`

#### Scenario: CPF com dígito verificador inválido retorna false
- **WHEN** `isValidCpf` recebe um CPF com dígito verificador incorreto
- **THEN** a função retorna `false`

#### Scenario: CPF com menos de 11 dígitos retorna false
- **WHEN** `isValidCpf` recebe uma string com menos de 11 dígitos numéricos
- **THEN** a função retorna `false`

---

### Requirement: Validação de maioridade de domínio
O sistema SHALL expor uma função `isAdult(birthDate: string): boolean` em `src/domain/auth/validators.ts` que verifica se a data no formato `DD/MM/AAAA` corresponde a uma pessoa com 18 anos ou mais na data atual.

#### Scenario: Data de nascimento de maior de idade retorna true
- **WHEN** `isAdult` recebe uma data que representa uma pessoa com 18 anos completos ou mais
- **THEN** a função retorna `true`

#### Scenario: Data de nascimento de menor de idade retorna false
- **WHEN** `isAdult` recebe uma data que representa uma pessoa com menos de 18 anos
- **THEN** a função retorna `false`

#### Scenario: Formato de data inválido retorna false
- **WHEN** `isAdult` recebe uma string que não corresponde ao formato `DD/MM/AAAA`
- **THEN** a função retorna `false`

---

### Requirement: Importação pelas Server Actions
As Server Actions de autenticação SHALL importar os validators de `src/domain/auth/validators.ts` em vez de definir funções locais.

#### Scenario: Action de login usa validator de e-mail
- **WHEN** `loginWithEmail` valida o campo de e-mail
- **THEN** a validação é delegada a `isValidEmail` importado de `src/domain/auth/validators.ts`

#### Scenario: Action de cadastro usa validators de domínio
- **WHEN** `registerWithEmail` valida e-mail, `savePersonalData` valida CPF e maioridade
- **THEN** todas usam funções importadas de `src/domain/auth/validators.ts`
