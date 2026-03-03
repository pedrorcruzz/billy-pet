---
name: screen-workflow
description: Controlador de telas no Billy Pet. Cria, edita e remove componentes e telas. Monta a tela — decide onde cada componente exibe, ordem e posição. Não edita o interior dos componentes, apenas a composição e layout. Usar ao criar, alterar ou remover telas em app/, adicionar/remover componentes de uma tela ou ajustar posicionamento.
---

# Screen Workflow — Controlador de Telas

Esta skill controla **telas** e **componentes na tela**. Cria, edita e remove. **Monta** a tela: decide o que exibe, em que ordem e posição. Não altera a lógica interna dos componentes — apenas a composição e o layout. Regras em [frontend-standards.mdc](../../rules/frontend-standards.mdc). Componentes novos: seguir [create-frontend-component](../create-frontend-component/SKILL.md).

---

## Papel do controlador

| Pode fazer | Não faz |
|------------|---------|
| Criar telas em `app/` | Editar código dentro de `components/` |
| Editar telas (adicionar, remover, reposicionar componentes) | Alterar props ou lógica dos componentes |
| Remover telas ou componentes da tela | |
| Ajustar ordem, posição e layout dos componentes | |
| Registrar rotas no Expo Router | |

---

## Criar tela

1. Definir escopo: objetivo, layout, rota
2. Mapear componentes necessários em `components/`
3. Criar componentes faltantes (skill create-frontend-component)
4. Montar a tela chamando os componentes na ordem desejada
5. Posicionar em `app/` (kebab-case) e registrar no layout

---

## Editar tela

Ajustar a **composição** da tela:

- **Adicionar** componente: importar e incluir no JSX na posição desejada
- **Remover** componente: retirar do JSX e do import
- **Reposicionar**: alterar a ordem dos componentes no JSX ou ajustar estilos de layout (flex, margin, padding)
- **Trocar** componente: substituir no JSX mantendo a posição

Não alterar o código dentro do componente — apenas onde ele é chamado e como está posicionado.

---

## Remover tela

- Remover o arquivo da tela em `app/`
- Remover registro no `_layout.tsx` (tabs, stack, etc.)
- Se a tela usava componentes exclusivos, avaliar se podem ser removidos de `components/`

---

## Montar a tela — composição

Estrutura típica:

```tsx
<View style={styles.container}>
  <ScreenHeader title="..." />        {/* posição 1 */}
  <ScrollView style={styles.content}>
    <ProductCard {...} />            {/* posição 2 */}
    <ProductCard {...} />            {/* posição 3 */}
  </ScrollView>
  <Button title="..." />             {/* posição 4 */}
</View>
```

Ajustes de posição: usar `StyleSheet` no arquivo da tela — `marginTop`, `marginBottom`, `flex`, `alignItems`, `justifyContent`, `gap`. Tokens em `constants/Tokens.ts`.

---

## Checklist

- [ ] Tela montada com componentes (sem UI complexa inline)
- [ ] Componentes importados de `@/components/`
- [ ] Cores e tokens — Colors.ts e Tokens.ts
- [ ] Alterações apenas na composição/layout, não no interior dos componentes
- [ ] Rotas atualizadas em `app/` quando criar ou remover telas
