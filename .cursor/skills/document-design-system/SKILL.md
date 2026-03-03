---
name: document-design-system
description: Documenta o design system do Billy Pet usando modelo baseado em tokens. Cria ou atualiza constants/Tokens.ts e documentação. Sempre gera arquivo em docs/design-system/ com versionamento (v1, v2, v3...). Usar ao documentar design system, criar tokens, padronizar estilos ou quando o usuário pedir documentação de design.
---

# Documentar Design System — Modelo Baseado em Tokens

Documenta e mantém o design system do Billy Pet usando **tokens** como fonte única de verdade. Regras de acessibilidade em [.cursor/rules/design-system.mdc](../../rules/design-system.mdc).

---

## O que são tokens

Tokens são **variáveis nomeadas** que representam decisões de design. Em vez de `fontSize: 16` espalhado no código, usa-se `fontSize: Tokens.typography.body`. Mudar o token atualiza todo o app.

**Tipos**:
- **Primitivos**: valores brutos (ex: `16`, `48`)
- **Semânticos**: nomes de uso (ex: `body`, `touchTarget`)

---

## Estrutura de Tokens (constants/Tokens.ts)

Criar ou atualizar `constants/Tokens.ts` com:

```typescript
/**
 * Design Tokens — Billy Pet
 * Modelo baseado em tokens. WCAG 2.0 AA.
 */

export const Tokens = {
  typography: {
    body: 16,
    h3: 20,
    h2: 24,
    h1: 28,
    fontWeight: {
      normal: '400' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  touchTarget: 48, // min 48×48 (Apple 44, Android 48)
} as const;
```

**Cores**: permanecem em `Colors.ts` — tokens de cor já existem lá. Tokens.ts foca em tipografia, spacing, radius e touch.

---

## Workflow de documentação

### 1. Criar ou atualizar Tokens.ts

- [ ] Verificar se `constants/Tokens.ts` existe
- [ ] Incluir `typography`, `spacing`, `radius`, `touchTarget`
- [ ] Valores conforme design-system.mdc (body 16, headings 20→24→28, touch 48, padding 16)

### 2. Usar tokens nos componentes

```tsx
import { Tokens } from '@/constants/Tokens';

const styles = StyleSheet.create({
  title: {
    fontSize: Tokens.typography.h2,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  card: {
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
  },
  button: {
    minHeight: Tokens.touchTarget,
    minWidth: Tokens.touchTarget,
  },
});
```

### 3. Gerar documentação em docs/design-system (obrigatório)

**Sempre** ao finalizar, criar o arquivo em `docs/design-system/` com versionamento:

- Verificar quais versões já existem (`v1.md`, `v2.md`, etc.)
- Criar a próxima versão: `v1.md`, `v2.md`, `v3.md`...
- Exemplo: se existem v1 e v2 → criar `v3.md`

Conteúdo do arquivo:
- Tabela de tokens com valor e uso
- Referência a Colors.ts para cores
- Link para design-system.mdc (contraste, WCAG)

---

## Checklist de tokens

| Categoria | Token | Valor | Uso |
|-----------|-------|-------|-----|
| Typography | body | 16 | Texto principal |
| Typography | h3 | 20 | Subtítulos |
| Typography | h2 | 24 | Títulos de seção |
| Typography | h1 | 28 | Títulos principais |
| Spacing | md | 16 | Padding base, gaps |
| Spacing | sm | 8 | Entre cards |
| Radius | md | 12 | Cards, botões |
| Touch | touchTarget | 48 | Botões, áreas tocáveis |

---

## Regras

- **Não duplicar**: se Colors.ts já tem a cor, não recriar em Tokens
- **Semântico**: preferir `Tokens.spacing.md` a `16` direto
- **Consistência**: novos valores devem vir de Tokens; se não existir token, adicionar em Tokens.ts primeiro
- **Acessibilidade**: contraste e touch targets seguem design-system.mdc
- **Arquivo final**: sempre gerar em `docs/design-system/vN.md` (v1, v2, v3...) ao concluir
