---
name: project-structure
description: Padroniza a estrutura de pastas do Billy Pet. Define onde colocar components, hooks, contexts, services, utils e app. Usar ao criar arquivos novos, organizar código ou quando o usuário perguntar sobre a estrutura do projeto.
---

# Estrutura do Projeto — Billy Pet

Esta skill define **onde** cada tipo de código deve ficar. Seguir rigorosamente para manter o projeto organizado.

---

## Pastas na raiz

```
raiz-do-projeto/
  app/           # Rotas (Expo Router)
  components/    # Componentes React
  contexts/      # React Context (estado global)
  hooks/         # Custom hooks
  services/      # Lógica de negócio, API, validações
  utils/         # Funções utilitárias (helpers, formatação)
  constants/     # Cores, tokens, constantes
  assets/        # Imagens, ícones
```

---

## Regras por pasta

| Pasta | O que coloca | O que NÃO coloca |
|-------|--------------|------------------|
| **app/** | Telas (rotas Expo Router), layouts, grupos `(tabs)`, `(auth)` | Lógica de negócio, componentes reutilizáveis |
| **components/** | Componentes React reutilizáveis. Domínios em subpastas: `auth/`, `product/`, `cart/` | Estado global, chamadas à API |
| **contexts/** | Providers de React Context (AuthContext, CartContext) | Hooks, services, componentes |
| **hooks/** | Custom hooks (`useAuth`, `useDebouncedValidation`) | Context providers, services |
| **services/** | Dados mockados, chamadas à API (`auth/authService.ts`) | Componentes, utils genéricos |
| **utils/** | Funções puras: formatação, validação, helpers (`authUtils.ts`) | Estado, chamadas à API |
| **constants/** | Cores, tokens, valores fixos | Lógica |

---

## Fluxo de dependências

```
app/ (telas)
  └── components/ (UI)
        └── hooks/ (acesso a estado)
              └── contexts/ (estado global)
                    └── services/ (dados, API)
components/ ──► hooks/ ──► contexts/ ──► services/
                └── utils/ (validação, helpers)
```

- **app/** importa de **components/** e **hooks/**
- **components/** importa de **hooks/**, **utils/** (validação, helpers)
- **hooks/** importa de **contexts/**
- **contexts/** importa de **services/**
- **services/** não importa de contexts, hooks ou components

---

## Exemplos por domínio

### Auth

| Pasta | Arquivo | Responsabilidade |
|-------|---------|------------------|
| services/ | `auth/authService.ts` | Login/logout mock, futuramente API |
| utils/ | `authUtils.ts` | Regras de validação (usuário, email, senha) |
| contexts/ | `AuthContext.tsx` | Estado isAuthenticated, funções login/logout |
| hooks/ | `useAuth.ts` | `useContext(AuthContext)` |
| hooks/ | `useDebouncedValidation.ts` | Validação com debounce |
| components/ | `auth/LoginForm.tsx`, `auth/SignUpForm.tsx` | UI dos formulários |
| app/ | `(auth)/login.tsx`, `(auth)/register.tsx` | Telas |

### Produto (futuro)

| Pasta | Arquivo | Responsabilidade |
|-------|---------|------------------|
| services/ | `product/productService.ts` | Listagem, detalhes (API) |
| hooks/ | `useProducts.ts` | Busca e cache de produtos |
| components/ | `product/ProductCard.tsx` | Card de produto |
| app/ | `(tabs)/index.tsx` | Tela inicial |

---

## Onde colocar arquivos novos

1. **Novo componente de UI** → `components/` (subpasta por domínio se houver)
2. **Novo estado global** → `contexts/` + `hooks/` para acesso
3. **Nova chamada à API ou regra de negócio** → `services/` (subpasta por domínio)
4. **Nova função helper/formatação** → `utils/`
5. **Nova tela** → `app/` (convenção: nome do arquivo = rota)
6. **Novo hook reutilizável** → `hooks/`

---

## Nomenclatura

- **Componentes**: PascalCase (`LoginForm.tsx`, `ProductCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.ts`, `useDebouncedValidation.ts`)
- **Services**: camelCase (`authService.ts`)
- **Contexts**: PascalCase + Context (`AuthContext.tsx`)
- **Rotas**: kebab-case (`product-detail.tsx`, `forgot-password.tsx`)
