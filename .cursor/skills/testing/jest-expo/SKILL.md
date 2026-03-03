---
name: jest-expo-testing
description: Passo a passo para testar projetos Expo com Jest e jest-expo. Cobre instalação, configuração, escrita e execução de testes. Usar ao criar testes, configurar Jest em projetos Expo ou quando o usuário pedir ajuda com testes.
---

# Testes com Jest e jest-expo (Expo)

Passo a passo para configurar e escrever testes em projetos Expo. Seguir `.cursor/rules/testing-standards.mdc` para estrutura e nomeação.

## 1. Instalação

```bash
npx expo install jest-expo jest @types/jest --dev
```

Ou manualmente:
```bash
npm install --save-dev jest-expo @types/jest
```
(Jest vem como dependência do jest-expo)

## 2. Configuração

Em `package.json`:

```json
{
  "scripts": {
    "test": "jest --passWithNoTests"
  },
  "jest": {
    "preset": "jest-expo"
  }
}
```

- `--passWithNoTests`: evita falha quando não há arquivos de teste ainda.

## 3. Estrutura de arquivos

Testes ao lado do arquivo testado (colocation):

```
utils/formatPrice.ts      → utils/formatPrice.test.ts
components/Button.tsx     → components/Button.test.tsx
```

Nunca criar pasta global `tests/` na raiz.

## 4. Escrever teste — utilitário

```typescript
// utils/formatPrice.test.ts
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formata valor em reais', () => {
    expect(formatPrice(19.9)).toBe('R$ 19,90');
  });

  it('retorna zero para valor inválido', () => {
    expect(formatPrice(0)).toBe('R$ 0,00');
  });
});
```

## 5. Executar testes

```bash
npm test
```

Para rodar em modo watch (re-executa ao salvar):
```bash
npx jest --watch
```

## 6. Troubleshooting

| Problema | Solução |
|----------|---------|
| "No tests found" | Verificar se o arquivo termina em `.test.ts` ou `.test.tsx` e está no padrão `**/?(*.)+(spec|test).[tj]s?(x)` |
| Erro de import/transform | jest-expo já configura transform para React Native; verificar se o preset está em `package.json` |
| Módulo não encontrado | Adicionar `moduleNameMapper` em `jest` se usar aliases (`@/` etc.) |
| Testes lentos | Usar `--maxWorkers=1` para debug: `jest --maxWorkers=1` |

## 7. Checklist ao criar teste novo

- [ ] Arquivo `.test.ts` ou `.test.tsx` ao lado do módulo
- [ ] `describe` para agrupar, `it` para cada caso, `expect` para asserções
- [ ] Testar comportamento, não implementação
- [ ] Rodar `npm test` para validar
