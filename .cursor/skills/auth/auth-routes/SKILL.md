---
name: auth-routes
description: Implementa rotas com autenticação, níveis de acesso (admin/usuário) e fluxo de carrinho no Billy Pet. Segue rigorosamente .cursor/rules/auth-routes.mdc. Usar ao criar ou modificar rotas, proteção de rotas, checkout, carrinho ou fluxo de login.
---

# Auth Routes — Billy Pet (E-commerce)

Seguir **rigorosamente** as regras em `.cursor/rules/auth-routes.mdc`. Esta skill detalha o passo a passo para implementar.

## Princípio

Autenticação **opcional** para navegação. Login só é exigido ao **finalizar compra** ou acessar rotas admin.

---

## Passo 1: Estrutura de rotas (Expo Router)

```
app/
  (tabs)/           # Público — catálogo, carrinho
  (auth)/           # Login, cadastro (modal ou stack)
  (admin)/          # Protegido — só admin
    _layout.tsx     # Verificar role, redirecionar se não admin
```

Criar os grupos de rota conforme a estrutura. Rotas públicas em `(tabs)/`, auth em `(auth)/`, admin em `(admin)/`.

---

## Passo 2: Níveis de acesso

| Tipo | Acesso |
|------|--------|
| Visitante | Catálogo, produto, carrinho (sem checkout) |
| Usuário | + checkout (após login) |
| Admin | + rotas admin |

**Implementar**: no `_layout.tsx` de `(admin)/`, verificar `user?.role === 'admin'`. Se não for admin → `router.replace('/(auth)/login')` ou similar.

---

## Passo 3: Carrinho — persistência local

Visitante pode adicionar ao carrinho sem login. Persistir em AsyncStorage (ou equivalente):

```ts
// hooks/useCart.ts ou similar
// Salvar itens em AsyncStorage quando deslogado
```

---

## Passo 4: Checkout — exigir login

Ao clicar em "Finalizar compra" ou "Ir para pagamento":

1. Verificar se usuário está logado
2. Se **não** → redirecionar para `/(auth)/login` ou exibir modal de login
3. Bloquear avanço até login

---

## Passo 5: Mesclagem do carrinho ao logar

Após login bem-sucedido:

1. Ler itens do carrinho local (AsyncStorage)
2. Enviar para o backend ou mesclar no estado do usuário logado
3. Limpar carrinho local
4. Redirecionar para checkout ou carrinho

---

## Checklist

- [ ] Rotas públicas acessíveis sem login
- [ ] Rotas admin protegidas (verificar role)
- [ ] Checkout exige login
- [ ] Carrinho persiste localmente quando deslogado
- [ ] Mesclagem do carrinho ao logar
