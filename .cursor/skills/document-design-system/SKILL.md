---
name: document-design-system
description: Documenta o design system do Billy Pet usando o template de Artefato Digital Acessível, adaptado para mobile (React Native). Cria ou atualiza constants/Tokens.ts e documentação em docs/design-system/ com versionamento. Usar ao documentar design system, criar tokens, padronizar estilos ou quando o usuário pedir documentação de design.
---

# Documentar Design System — Artefato Digital Acessível (Mobile)

Documenta o design system do Billy Pet seguindo o **Template de Documentação: Artefato Digital Acessível**, adaptado para **React Native / mobile**. Regras em [.cursor/rules/design-system.mdc](../../rules/design-system.mdc).

---

## Template Obrigatório (adaptado para mobile)

O documento gerado deve seguir esta estrutura. Gerar em `docs/design-system/vN.md` (v1, v2, v3...).

### 1. Visão Geral e Escopo

| Item | Valor |
|------|-------|
| **1.1 Nome do Projeto** | Billy Pet |
| **1.2 Padrão de Acessibilidade Adotado** | WCAG 2.2 Nível AA |
| **1.3 Público-alvo** | Usuários de app mobile (iOS/Android) — pet shop, compra de produtos para pets |
| **1.4 Responsável pela Acessibilidade** | Pedro Henrique Rosa Cruz |

### 2. Checklist de Design Acessível (UI/UX)

| Item | Critério | Implementação Billy Pet |
|------|----------|-------------------------|
| **2.1 Contraste de Cores** | Texto normal: 4.5:1; texto grande/ícones: 3:1 | Cores em `Colors.ts`; validar com WebAIM Contrast Checker |
| **2.2 Não uso da cor como único indicador** | Informações não dependem apenas da cor | Usar ícone + cor, texto + cor (ex: obrigatório com * e cor) |
| **2.3 Fontes Legíveis** | Tamanho mínimo legível | Body 16px (`Tokens.typography.body`); headings 20→24→28 |
| **2.4 Foco Visível** | Elementos interativos com indicador de foco | `accessibilityState`; área de toque mínima 48×48 |
| **2.5 Hierarquia de Títulos** | Estrutura clara H1, H2, H3 | `Tokens.typography.h1`, `h2`, `h3` nos títulos |

### 3. Checklist de Desenvolvimento (Mobile / React Native)

| Item | Critério Web (original) | Adaptação Mobile |
|------|-------------------------|------------------|
| **3.1 Componentes Semânticos** | HTML semântico (`<nav>`, `<main>`, `<button>`) | `accessibilityRole`: button, link, header, image; `accessibilityLabel` em elementos interativos |
| **3.2 Navegação por Toque** | Navegação por teclado TAB | Gestos touch; ordem lógica de foco; `accessibilityOrder` quando necessário |
| **3.3 Atributos ALT** | Imagens com alt descritivo | `accessibilityLabel` em `Image`; `accessibilityElementsHidden` para decorativas |
| **3.4 Formulários Acessíveis** | Labels associados, mensagens de erro | Ver seção 7. Padrões de Formulário (extraídos do código) |
| **3.5 ARIA / accessibilityProps** | aria-label quando necessário | `accessibilityLabel`, `accessibilityLabelledBy`, `accessibilityHint` |
| **3.6 Botões/Links Descritivos** | Texto do link explica destino | `accessibilityLabel` descritivo; evitar "clique aqui" |

### 4. Conteúdo e Mídia

| Item | Critério |
|------|----------|
| **4.1 Textos Simples** | Linguagem clara, evitar jargões |
| **4.2 Legendas/Transcrição** | Vídeos com legendas; áudios com transcrição |
| **4.3 Evitar Piscadas** | Elementos não piscam mais de 3 vezes por segundo |

### 5. Ferramentas de Validação e Testes (Mobile)

| Tipo | Ferramenta |
|------|------------|
| **5.1 Automático** | Android Accessibility Scanner; Xcode Accessibility Inspector |
| **5.2 Manual** | Navegação completa por gestos; ordem de foco |
| **5.3 Leitor de Tela** | TalkBack (Android), VoiceOver (iOS) |
| **5.4 Simulador de Contraste** | WebAIM Contrast Checker; stiletest |

### 6. Declaração de Acessibilidade

- **Publicação**: Tela ou seção "Acessibilidade" no app, com compromisso, nível de conformidade (WCAG 2.2 AA) e contato para feedback.
- **Responsável**: Pedro Henrique Rosa Cruz

### 7. Padrões de Formulário (extraídos do código)

**Obrigatório**: ao gerar o documento, **ler** `components/auth/AuthInput.tsx`, `components/auth/AuthHintBox.tsx` e `utils/authUtils.ts` para extrair os padrões reais implementados.

| Item | Implementação Billy Pet |
|------|-------------------------|
| **Campo obrigatório** | Asterisco (*) ao lado do label; cor `error`; toque no * abre Alert "O asterisco indica que este campo é obrigatório"; `accessibilityLabel` "Campo obrigatório. Toque para mais informações." |
| **Labels** | `accessibilityLabel` no TextInput com o nome do campo |
| **Erros** | `accessibilityHint` com mensagem; texto de erro abaixo do input (cor `error`) |
| **Hints** | AuthHintBox com regras; `accessibilityLabel` em cada item; AUTH_HINTS e REGISTER_HINTS em authUtils |
| **Validação** | authUtils: validateName, validateUsername, validateEmail, validatePassword, validateConfirmPassword — mensagens em pt-BR |

**Regras de validação** (authUtils): nome ≥2 chars; usuário sem espaço, ≤20 chars, letras/números/_; senha ≥4 chars, 1 maiúscula, 1 símbolo; e-mail com @ e domínio.

---

## Tokens (constants/Tokens.ts)

Manter estrutura de tokens. Cores em `Colors.ts`.

```typescript
export const Tokens = {
  typography: { body: 16, h3: 20, h2: 24, h1: 28, fontWeight: { normal: '400', semibold: '600', bold: '700' } },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 16 },
  touchTarget: 48, // min 48×48 (Apple 44, Android 48)
} as const;
```

---

## Workflow

1. **Ler o código** — `components/auth/AuthInput.tsx`, `AuthHintBox.tsx`, `utils/authUtils.ts` para extrair padrões de formulário
2. **Criar ou atualizar Tokens.ts** — typography, spacing, radius, touchTarget
3. **Gerar documento** em `docs/design-system/vN.md` seguindo o template (seções 1–7)
4. **Incluir** tabela de tokens, paleta Colors.ts, seção 7 com padrões de formulário reais, checklist completo

---

## Regras

- **Acessibilidade não é opcional**: integrar no fluxo de design e desenvolvimento
- **Foco mobile**: WCAG 2.2 AA; TalkBack e VoiceOver
- **Ferramentas**: Accessibility Inspector (Xcode), Android Accessibility Scanner, WebAIM Contrast Checker
- **Arquivo final**: sempre em `docs/design-system/vN.md` (v1, v2, v3...)
