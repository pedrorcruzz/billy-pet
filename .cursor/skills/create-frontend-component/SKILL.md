---
name: create-frontend-component
description: Cria componentes React Native seguindo os padrões do Billy Pet — cores de constants/Colors.ts, componentes reutilizáveis, sem hex hardcoded. Usar ao criar ou modificar componentes em app/ ou components/.
---

# Criar Componente Frontend — Billy Pet

Seguir o passo a passo abaixo. Regras completas em [.cursor/rules/frontend-standards.mdc](../../rules/frontend-standards.mdc).

## Passo 1: Verificar reutilização

Antes de criar, conferir em `components/`:

- [ ] Existe componente parecido que pode ser estendido?
- [ ] Um componente genérico com props resolve?
- [ ] Composição de componentes existentes resolve?

Se sim → reutilizar ou estender. Se não → seguir para o passo 2.

---

## Passo 2: Cores — usar apenas Colors.ts

**Nunca** usar `#000`, `#fff`, `rgba()` ou hex direto no componente.

### Cores disponíveis (constants/Colors.ts)

| Nome | Uso |
|------|-----|
| `text` | Texto principal |
| `background` | Fundo |
| `tint` / `secondary` | Verde — tabs, botões, destaques |
| `card` | Marrom — fundo de cards |
| `tabIconDefault` | Ícone inativo |
| `tabIconSelected` | Ícone ativo |

### Se precisar de nova cor

1. Adicionar em `constants/Colors.ts` em `light` e `dark`
2. Nome semântico (ex: `border`, `primary`, `textLight`)

### Como usar no componente

```tsx
import Colors from '@/constants/Colors';
import { useThemeColor } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';

// Opção A: useThemeColor (recomendado — respeita tema)
const color = useThemeColor({}, 'text');
const bg = useThemeColor({}, 'background');

// Opção B: Colors direto
const theme = useColorScheme();
const tint = Colors[theme].tint;
```

### Usar componentes Themed quando possível

```tsx
import { Text, View } from '@/components/Themed';
// Já aplicam text/background do tema automaticamente
```

---

## Passo 3: Estrutura do componente

```tsx
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
// ou useThemeColor se precisar de cores específicas

export function NomeDoComponente({ ...props }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // cores via useThemeColor no componente, não aqui
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
```

**Regra**: cores dinâmicas vêm de `useThemeColor`/`Colors` e são aplicadas no JSX (ex: `style={[styles.container, { backgroundColor }]}`). StyleSheet não aceita hooks — nunca colocar hex em StyleSheet.

---

## Passo 4: Checklist final

- [ ] Nenhum hex ou rgba no código
- [ ] Cores vindas de Colors.ts
- [ ] Componente reutilizável (props para variar)
- [ ] Nome em PascalCase
- [ ] Arquivo em `components/` ou na pasta apropriada
