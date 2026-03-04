# Billy Pet — Padrões do Projeto

## Visão Geral

**Billy Pet** é um aplicativo de pet shop desenvolvido em **React Native com Expo**, focado exclusivamente na venda de produtos para pets (ração, acessórios, medicamentos, brinquedos, etc.).

---

## Stack Tecnológica

- **React Native** + **Expo** (SDK 54)
- **Expo Router** — roteamento baseado em arquivos
- **TypeScript** — tipagem obrigatória
- **React 19** + **React Native Reanimated**

---

## Linguagem e Documentação

- **Arquivos `.md` e comentários**: em **português (pt-BR)**
- **Estrutura de pastas e código**: em **inglês** (nomes de arquivos, pastas, variáveis, funções, componentes)
- **Clean Code**: código autoexplicativo; comentários apenas quando necessário
  - Comentar o _porquê_, não o _como_
  - Comentários sempre em **pt-BR**
  - Evitar comentários óbvios; preferir nomes claros de variáveis e funções
  - **Não usar comentários desnecessários** — nomes de funções, variáveis e props devem ser autoexplicativos; omitir comentários que apenas repetem o que o nome já deixa óbvio

---

## Estrutura de Pastas

```
app/                    # Rotas (Expo Router)
  (tabs)/               # Navegação por abas
  _layout.tsx           # Layout raiz
components/             # Componentes reutilizáveis
constants/              # Cores e constantes
```

---

## Padrões de Código

### Componentes

- Usar **componentes funcionais** com hooks
- Preferir `const` para declaração de componentes
- Extrair lógica reutilizável em **custom hooks**
- Manter componentes pequenos e focados

### Estilização

- Usar `StyleSheet` do React Native
- Centralizar cores em `constants/Colors.ts`
- Evitar estilos inline; preferir objetos de estilo nomeados

### Rotas (Expo Router)

- Rotas em `app/` com convenção de pastas
- Grupos com `(nome)` para organização sem afetar a URL
- Layouts compartilhados em `_layout.tsx`

### Tipagem

- Tipar props com interfaces ou types
- Evitar `any`; usar `unknown` quando o tipo for incerto
- Exportar tipos compartilhados em arquivos dedicados

---

## Domínio do Negócio

O app trata **apenas** de produtos para pets:

- Alimentação (ração, petiscos)
- Acessórios (coleiras, caminhas, comedouros)
- Higiene e saúde
- Brinquedos
- Medicamentos e suplementos

Não incluir: serviços (banho, tosa), adoção de animais ou outros segmentos fora de produtos.

---

## Convenções de Nomenclatura

- **Componentes**: PascalCase (`ProductCard.tsx`, `CartButton.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useCart.ts`, `useProducts.ts`)
- **Arquivos de rota**: kebab-case ou nomes descritivos (`product-detail.tsx`, `cart.tsx`)
- **Constantes**: UPPER_SNAKE_CASE ou camelCase conforme contexto

---

## Boas Práticas

1. **Acessibilidade**: incluir `accessibilityLabel` em elementos interativos
2. **Internacionalização**: preparar textos para futura tradução (i18n)
3. **Estado**: preferir estado local; considerar Context ou Zustand para estado global (carrinho, usuário)

---

## Comandos Úteis

```bash
npm start          # Inicia o Expo
npm run android    # Android
npm run ios        # iOS
npm run web        # Web
```
