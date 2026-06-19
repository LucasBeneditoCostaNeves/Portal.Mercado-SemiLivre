## Purpose

Especifica o comportamento e a estrutura do componente ProductCard, responsável por exibir as informações de um produto no catálogo do Portal Mercado Semi-Livre.

---

## Requirements

### Requirement: ProductCard exibe informações do produto
O componente ProductCard SHALL receber um objeto do tipo `Product` e exibir: imagem placeholder (ícone Tabler), badge opcional (OFERTA/NOVO), título com clamp de 2 linhas, preço formatado, parcelamento, indicador de frete grátis e rating com contagem de avaliações.

#### Scenario: Card com badge OFERTA
- **WHEN** o ProductCard recebe `badge: "OFERTA"`
- **THEN** um badge amarelo (#FFE600) com texto "OFERTA" é exibido acima do título

#### Scenario: Card com badge NOVO
- **WHEN** o ProductCard recebe `badge: "NOVO"`
- **THEN** um badge verde claro com texto "NOVO" é exibido acima do título

#### Scenario: Card sem badge
- **WHEN** o ProductCard recebe `badge: undefined`
- **THEN** nenhum badge é renderizado

#### Scenario: Título longo é truncado
- **WHEN** o título do produto excede 2 linhas
- **THEN** o texto é truncado com `line-clamp-2` e reticências

---

### Requirement: ProductCard usa tipo Product do domínio
O componente ProductCard SHALL aceitar como prop um objeto conforme o tipo `Product` definido em `src/domain/catalog/types.ts`, sem receber strings avulsas.

#### Scenario: Tipo correto forçado em compile time
- **WHEN** um componente tenta passar um objeto sem o campo `price` para ProductCard
- **THEN** o TypeScript reporta erro de compilação

---

### Requirement: ProductCard é um Server Component
O ProductCard SHALL ser implementado como Server Component puro (sem `"use client"`), sem estado local nem event handlers.

#### Scenario: Sem bundle JavaScript no cliente
- **WHEN** o ProductCard é renderizado
- **THEN** nenhum JavaScript de hidratação é enviado ao cliente para este componente

---

### Requirement: Preço exibido com centavos em superscript
O campo `price` (number) SHALL ser formatado e exibido com a parte inteira em tamanho normal e os centavos em `<sup>` com `text-xs`, no formato `R$ 1.499,99`.

#### Scenario: Preço formatado corretamente
- **WHEN** `price` é `1499.99`
- **THEN** o card exibe "R$ 1.499" com ",99" em superscript menor
