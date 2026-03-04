---
name: document-design-system
description: Documenta o design system do Billy Pet usando o template de Artefato Digital Acessível, adaptado para mobile (React Native). Cria ou atualiza constants/Tokens.ts e documentação em docs/design-system/ com versionamento. Usar ao documentar design system, criar tokens, padronizar estilos ou quando o usuário pedir documentação de design.
---

# Documentar Design System — Artefato Digital Acessível (Mobile)

Documenta o design system do Billy Pet seguindo o **Template de Documentação: Artefato Digital Acessível**, adaptado para **React Native / mobile**. Regras em [.cursor/rules/design-system.mdc](../../rules/design-system.mdc).

---

## Regra absoluta: 100% fiel ao código

**Nada de inventar.** Documentar apenas o que existe no código. Se não houver:
- Tela de Acessibilidade → escrever: "Ainda não implementada"
- Lib X → escrever: "Não utiliza"
- Recurso Y → escrever: "Não implementado"

Não assumir, não inferir. Buscar no código e documentar o que encontrar.

---

## Workflow obrigatório (antes de escrever)

1. **Escanear o código** — buscar em `app/`, `components/`, `constants/`:
   - `useThemeColor`, `Colors.light`, `Colors.dark` → mapeamento de cores
   - `Tokens.typography`, `fontSize`, `fontWeight` → tipografia
   - `Tokens.spacing`, `padding`, `margin`, `gap`, `flex` → espaçamento
   - `accessibilityRole`, `accessibilityLabel`, `accessibilityHint` → acessibilidade
   - Formulários: `AuthInput`, `AuthHintBox`, `authUtils` (se existirem)
2. **Ler** `constants/Tokens.ts`, `constants/Colors.ts` — valores atuais
3. **Só então** gerar o documento com o que foi encontrado

---

## Template Obrigatório (estrutura — conteúdo vem do código)

O documento gerado deve seguir esta estrutura. Gerar em `docs/design-system/vN.md` (v1, v2, v3...).

### 1. Visão Geral e Escopo

| Item | Valor |
|------|-------|
| **1.1 Nome do Projeto** | Billy Pet |
| **1.2 Padrão de Acessibilidade Adotado** | WCAG 2.2 Nível AA |
| **1.3 Público-alvo** | Usuários de app mobile (iOS/Android) — pet shop, compra de produtos para pets |
| **1.4 Responsável pela Acessibilidade** | Buscar em package.json, README ou config; se não houver: "Não definido" |

### 2. Checklist de Design Acessível (UI/UX)

**Extrair do código** o que está implementado. Se não encontrar: "Não implementado" ou "Não verificado".

| Item | Critério | Implementação Billy Pet |
|------|----------|-------------------------|
| **2.1 Contraste de Cores** | Texto 4.5:1; grande 3:1 | Listar onde cores são usadas; se não houver validação: "Não verificado" |
| **2.2 Cor como único indicador** | Não depender só de cor | Buscar ícone+cor, texto+cor; se não houver: "Não implementado" |
| **2.3 Fontes Legíveis** | Tamanho mínimo legível | Extrair fontSize de Tokens e componentes; listar valores reais |
| **2.4 Foco Visível** | Indicador de foco | Buscar accessibilityState, touchTarget; se não houver: "Não implementado" |
| **2.5 Hierarquia de Títulos** | H1, H2, H3 | Buscar uso de h1/h2/h3; se não houver: "Não implementado" |

### 3. Checklist de Desenvolvimento (Mobile)

**Extrair do código** — buscar `accessibilityRole`, `accessibilityLabel`, `accessibilityHint`, `accessibilityOrder`. Documentar o que existe; o que não existir: "Não implementado".

### 4. Conteúdo e Mídia

Documentar critérios; para implementação: buscar vídeos, áudios, animações no app. Se não houver: "Não aplicável" ou "Não utiliza".

### 5. Ferramentas de Validação

Listar ferramentas mencionadas no projeto (README, docs, scripts). Se não houver: "Não documentado no projeto".

### 6. Declaração de Acessibilidade

- **Publicação**: Buscar tela/rota "Acessibilidade" ou "accessibility" em app/. Se não existir: "Ainda não implementada"
- **Responsável**: Buscar em config; se não houver: "Não definido"

### 7. Padrões de Formulário

**Só incluir se existir** AuthInput, AuthHintBox, authUtils. Extrair do código:
- Campo obrigatório: como é indicado? (asterisco, cor, etc.)
- Labels, erros, hints: como estão implementados?
- Validação: listar funções e regras em authUtils

Se não houver formulários: "Não há componentes de formulário no projeto" ou "Ainda não implementado".

### 8. Mapeamento de Cores por Elemento

**Extrair dinamicamente**: buscar todos os arquivos que usam `useThemeColor(...)` ou `Colors.light.X` / `Colors.dark.X`. Para cada uso encontrado, adicionar linha na tabela:

| Elemento / Componente | Propriedade | Token Colors.ts | Hex (de Colors.ts) |
|-----------------------|-------------|-----------------|---------------------|
| ... | ... | ... | ... |

Hex vem de `Colors.ts`. Só incluir linhas que existem no código.

### 9. Padrões de Tipografia

**Extrair dinamicamente**: buscar `fontSize`, `fontWeight`, `Tokens.typography` em todos os componentes. Montar tabela:

| Uso | Token | Valor | Componente exemplo |
|-----|-------|-------|-------------------|
| ... | ... | ... | ... |

Só incluir o que for encontrado no código.

### 10. Espaçamento e Layout (flex)

**Extrair dinamicamente**: buscar `Tokens.spacing`, `padding`, `margin`, `gap`, `flex` em todos os componentes. Montar tabela:

| Padrão | Token / Valor | Onde é usado |
|--------|---------------|--------------|
| ... | ... | ... |

Só incluir o que for encontrado no código.

---

## Tokens e Cores

**Ler** `constants/Tokens.ts` e `constants/Colors.ts` — documentar os valores atuais. Não inventar valores.

---

## Regras

- **100% fiel**: documentar apenas o que existe; o que não existe: "Ainda não implementado", "Não utiliza", "Não definido"
- **Dinâmico**: sempre escanear o código antes de gerar; nunca usar tabelas fixas ou valores inventados
- **Arquivo final**: `docs/design-system/vN.md` (v1, v2, v3...)
